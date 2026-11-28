"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import type { VideoSource } from "@/utils/videoSource";
import { CloseIcon } from "@/components/search/SearchIcons";
import styles from "./video-modal.module.scss";

interface VideoModalProps {
  title: string;
  /** A video that can play on the page; other links open in a new tab. */
  source: Exclude<VideoSource, { kind: "link" }>;
  onClose: () => void;
  captionsUrl?: string;
  transcriptUrl?: string;
}

/** Web addresses and paths on this site only: these links come from data. */
function safeFileLink(link: string | undefined) {
  return link && /^(https?:\/\/|\/(?![/\\]))/i.test(link) ? link : undefined;
}

/**
 * Plays a video in a popup. Render it only while it is open: unmounting the
 * player is what stops the sound. Play, pause, volume and full screen are the
 * player's own controls (YouTube's, or the browser's for a video file).
 *
 * A native modal <dialog> keeps focus inside, closes on Escape and hands focus
 * back to the button that opened it.
 */
export default function VideoModal({
  title,
  source,
  onClose,
  captionsUrl,
  transcriptUrl,
}: VideoModalProps) {
  const transcript = safeFileLink(transcriptUrl);
  const captions = safeFileLink(captionsUrl);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const close = () => dialogRef.current?.close();

  /* The panel fills the dialog, so a click on the dialog itself is a click on
     the backdrop. */
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="video-modal-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <h2 id="video-modal-title" className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} aria-label="Close video" onClick={close}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.frame}>
          {source.kind === "youtube" ? (
            <iframe
              src={source.embedUrl}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <video src={source.src} controls autoPlay playsInline>
              {captions ? (
                <track kind="captions" src={captions} srcLang="en" label="English" default />
              ) : null}
              Your browser cannot play this video.
            </video>
          )}
        </div>

        {transcript ? (
          <a className={styles.external} href={transcript} download>
            Download transcript
          </a>
        ) : null}

        {/* For videos whose owner has switched off playing on other sites. */}
        {source.kind === "youtube" ? (
          <a
            className={styles.external}
            href={source.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube (opens in a new tab)
          </a>
        ) : null}
      </div>
    </dialog>
  );
}
