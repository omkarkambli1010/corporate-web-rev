"use client";

import { useEffect, useRef } from "react";
import { Alignment, Fit, Layout, RuntimeLoader, decodeImage, useRive } from "@rive-app/react-canvas";
import type { RiveSlides, RiveValues } from "./riveTypes";

/* Serve the runtime from our own origin (copied by scripts/copy-rive-wasm.mjs)
   rather than the package's default CDN. */
RuntimeLoader.setWasmUrl("/rive/rive.wasm");
RuntimeLoader.setWasmFallbackUrl("/rive/rive_fallback.wasm");

const FITS = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  fill: Fit.Fill,
  layout: Fit.Layout,
} as const;

export interface RivePlayerProps {
  src: string;
  artboard?: string;
  stateMachine: string;
  fit?: keyof typeof FITS;
  values?: RiveValues;
  slides?: RiveSlides;
  triggers?: Readonly<Record<string, () => void>>;
  className?: string;
  onReady: () => void;
  onError: () => void;
}

type DecodedImage = Awaited<ReturnType<typeof decodeImage>>;

/** Fetches and decodes one image for a View Model image property. */
async function loadImage(url: string): Promise<DecodedImage> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Rive image ${url}: HTTP ${response.status}`);
  return decodeImage(new Uint8Array(await response.arrayBuffer()));
}

/**
 * The canvas half of <RiveAnimation>. Loaded with next/dynamic (ssr: false),
 * so the runtime only reaches pages that actually have a .riv to play.
 */
export default function RivePlayer({
  src,
  artboard,
  stateMachine,
  fit = "contain",
  values,
  slides,
  triggers,
  className,
  onReady,
  onError,
}: RivePlayerProps) {
  const binds = Boolean((values && Object.keys(values).length > 0) || slides || triggers);
  const { rive, RiveComponent } = useRive(
    {
      src,
      artboard,
      stateMachine,
      autoplay: true,
      // Bind the default View Model only when the page drives it; a file with
      // no View Model (e.g. a looping loader) would warn otherwise.
      autoBind: binds,
      layout: new Layout({ fit: FITS[fit], alignment: Alignment.Center }),
      onLoad: onReady,
      onLoadError: onError,
    },
    // Stops drawing while the canvas is off screen.
    { shouldUseIntersectionObserver: true },
  );

  // Fill the slide list from page content: one item instance per slide, its
  // strings set straight away and its images once they decode. Runs before the
  // values effect below, so `index` lands on a populated list.
  const slidesKey = JSON.stringify(slides ?? null);
  useEffect(() => {
    const vm = rive?.viewModelInstance;
    const spec = JSON.parse(slidesKey) as RiveSlides | null;
    if (!rive || !vm || !spec) return;
    const list = vm.list(spec.list);
    const itemModel = rive.viewModelByName(spec.viewModel);
    if (!list || !itemModel) {
      console.warn(`[rive] ${src}: no list "${spec.list}" of "${spec.viewModel}" to fill.`);
      return;
    }
    let cancelled = false;
    const decoded: DecodedImage[] = [];
    while (list.length > 0) list.removeInstanceAt(list.length - 1);
    for (const item of spec.items) {
      const instance = itemModel.instance();
      for (const [name, text] of Object.entries(item.strings ?? {})) {
        const prop = instance.string(name);
        if (prop) prop.value = text;
      }
      list.addInstance(instance);
      for (const [name, url] of Object.entries(item.images ?? {})) {
        loadImage(url)
          .then((image) => {
            if (cancelled) return image.unref();
            decoded.push(image);
            const prop = instance.image(name);
            // The runtime's image setter takes the decoded wrapper (as its own
            // React hook does), though its typings name the native image.
            if (prop) (prop as unknown as { value: DecodedImage }).value = image;
          })
          .catch((error) => console.warn("[rive]", error));
      }
    }
    return () => {
      cancelled = true;
      for (const image of decoded) image.unref();
    };
  }, [rive, slidesKey, src]);

  // Push the page's state into the View Model. Keyed on the serialised values
  // so a new object with the same contents does not re-run it.
  const valuesKey = JSON.stringify(values ?? {});
  useEffect(() => {
    const vm = rive?.viewModelInstance;
    if (!vm) return;
    const next = JSON.parse(valuesKey) as Record<string, boolean | number | string>;
    for (const [name, value] of Object.entries(next)) {
      if (typeof value === "boolean") {
        const prop = vm.boolean(name);
        if (prop) prop.value = value;
      } else if (typeof value === "number") {
        const prop = vm.number(name);
        if (prop) prop.value = value;
      } else {
        const choice = vm.enum(name);
        if (choice) choice.value = value;
        else {
          const text = vm.string(name);
          if (text) text.value = value;
        }
      }
    }
  }, [rive, valuesKey, slidesKey]);

  // Triggers the file fires (e.g. a click on a neighbouring card) call back
  // into the page. Subscribed by name; the latest callbacks are read from a ref.
  const triggersRef = useRef(triggers);
  useEffect(() => {
    triggersRef.current = triggers;
  });
  const triggerNames = Object.keys(triggers ?? {}).sort().join("|");
  useEffect(() => {
    const vm = rive?.viewModelInstance;
    if (!vm || !triggerNames) return;
    const subscriptions = triggerNames.split("|").flatMap((name) => {
      const prop = vm.trigger(name);
      if (!prop) return [];
      const handler = () => triggersRef.current?.[name]?.();
      prop.on(handler);
      return [() => prop.off(handler)];
    });
    return () => subscriptions.forEach((off) => off());
  }, [rive, triggerNames]);

  return <RiveComponent className={className} aria-hidden="true" />;
}
