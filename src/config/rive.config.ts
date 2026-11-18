/**
 * Rive animation slots — every place the site animates a graphic.
 *
 * Each slot names the .riv file it plays and the contract that file has to
 * meet (artboard, state machine, data-binding properties). Until a slot's
 * `src` is set, <RiveAnimation> renders the slot's fallback, which is the
 * existing image/CSS version, and the Rive runtime is never downloaded.
 *
 * To switch a slot on: export the .riv from the Rive editor into
 * `public/rive/`, set `src` below, and match the names in `bindings`.
 *
 * Bindings use Rive data binding (the default View Model, auto-bound): the
 * page writes these properties and the state machine reacts to them. State
 * machine inputs are deprecated in the runtime, so do not rely on them.
 */
export type RiveBindingType = "boolean" | "number" | "string" | "enum" | "image" | "trigger";

export interface RiveSlot {
  /** Path under /public, e.g. "/rive/arrow-up-right.riv"; null until supplied. */
  src: string | null;
  /** Artboard to play; the file's default artboard when omitted. */
  artboard?: string;
  /** State machine to run. */
  stateMachine: string;
  /** How the artboard fills the slot box. */
  fit?: "contain" | "cover" | "fill" | "layout";
  /** View Model properties the page drives (or, for triggers, listens to). */
  bindings?: Record<string, RiveBindingType>;
  /** List properties the page fills, with the item View Model and its properties. */
  lists?: Record<string, { viewModel: string; properties: Record<string, RiveBindingType> }>;
  /** Artboards the page switches between, when there is more than one. */
  artboards?: readonly string[];
  /** What the animation should do — the brief for whoever builds the .riv. */
  brief: string;
}

export const RIVE_SLOTS = {
  arrowUpRight: {
    src: null,
    stateMachine: "Main",
    bindings: { hover: "boolean" },
    brief:
      "Dotted arrow-up-right (46 x 46 artboard, scales to 32/40). Idle at rest; " +
      "while `hover` is true, nudge right ~4px over 0.2s ease and hold; ease back when false. " +
      "Used by section headings, Market Pulse, News, Market News and the bento cards. " +
      "Two colour variants are needed: primary-1000 (#292075) on light grounds and white on dark — " +
      "deliver as artboards `Light` and `Dark`.",
  },
  loader: {
    src: null,
    stateMachine: "Main",
    brief: "Full-screen loading indicator (64 x 64 artboard). Loops continuously while shown.",
  },
  chevron: {
    src: null,
    stateMachine: "Main",
    bindings: { open: "boolean" },
    brief:
      "Footer accordion chevron (18 x 18). Points up when `open` is true, down when false; " +
      "rotate 180deg over 0.2s ease between the two.",
  },
  faqToggle: {
    src: null,
    stateMachine: "Main",
    bindings: { open: "boolean" },
    brief:
      "FAQ plus/minus (24 x 24, #3b4c72). Plus when `open` is false, minus when true; " +
      "morph between them (vertical bar collapses) over ~0.25s.",
  },
  bentoMarginTrading: {
    src: null,
    stateMachine: "Main",
    fit: "cover",
    bindings: { shown: "boolean" },
    brief:
      "Bento card art — Margin Trading Facility scale. Artboard is the full card. " +
      "Art waits off-card while `shown` is false and slides in (0.5s ease-in) when true; " +
      "plays once and holds. Card text is HTML on top, so leave the text area clear.",
  },
  bentoNri: {
    src: null,
    stateMachine: "Main",
    fit: "cover",
    bindings: { shown: "boolean" },
    brief: "Bento card art — NRI globe and phone. Same contract as bentoMarginTrading.",
  },
  bentoSupport: {
    src: null,
    stateMachine: "Main",
    fit: "cover",
    bindings: { shown: "boolean" },
    brief: "Bento card art — India support map. Same contract as bentoMarginTrading.",
  },
  bentoBaskets: {
    src: null,
    stateMachine: "Main",
    fit: "cover",
    bindings: { shown: "boolean" },
    brief: "Bento card art — Baskets chart and phone. Same contract as bentoMarginTrading.",
  },
  csrCarousel: {
    src: null,
    stateMachine: "Main",
    artboards: ["Desktop", "Tablet", "Mobile"],
    bindings: { index: "number", direction: "number", prev: "trigger", next: "trigger" },
    lists: { slides: { viewModel: "CsrSlide", properties: { image: "image", title: "string" } } },
    brief:
      "About › CSR Activities image stage. The page fills `slides` from the CMS (photo + name per " +
      "activity, any count) and sets `index` to the active slide and `direction` (+1/-1) to the way " +
      "it moved; animate the slide change from that (Figma: smart animate, linear, 0.3s). Draw each " +
      "card's name over its photo from `title`. Fire `prev` / `next` when the user clicks a " +
      "neighbouring card. The description text, pager and arrows stay in HTML under the canvas. " +
      "Artboards: Desktop 1372 x 362 (322 / 644 / 322 cards), Tablet 1192 x 211 (188 / 188 / 376 / " +
      "188 / 188, edges cut by the screen), Mobile 328 x 185 (active card only).",
  },
  lifeAtSsl: {
    src: null,
    stateMachine: "Main",
    artboard: "Stack",
    bindings: { index: "number" },
    lists: { slides: { viewModel: "LifeSlide", properties: { front: "image", left: "image", right: "image" } } },
    brief:
      "About › Life at SSL photo stack, 606 x 412 (scaled down on tablet and mobile). Three framed " +
      "photos — two tilted behind (-9.96deg / 11deg), one in front — with a white 7.4px border, 16px " +
      "radius and soft shadow. The page fills `slides` (front / left / right photo per slide) and sets " +
      "`index`; tween the frames and cross-fade the photos to the new slide (Figma: smart animate, " +
      "linear, 0.3s). Clicks are handled by the HTML button around the canvas; the title, story, " +
      "Read more, CTA and pager stay in HTML.",
  },
} satisfies Record<string, RiveSlot>;

export type RiveSlotKey = keyof typeof RIVE_SLOTS;
