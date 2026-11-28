
"use client";

import { useEffect } from "react";

import {
  useToast,
  type ToastItem,
} from "@/context/ToastContext";

import styles from "./ToastContainer.module.scss";

function ToastCard({
  toast,
}: Readonly<{
  toast: ToastItem;
}>) {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      removeToast(toast.id);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.content}>
        {toast.message}
      </div>

      <button
        type="button"
        className={styles.closeButton}
        aria-label="Close notification"
        onClick={() => removeToast(toast.id)}
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      className={styles.container}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
        />
      ))}
    </div>
  );
}
