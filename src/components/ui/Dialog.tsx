"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "rounded-xl border border-border-default bg-surface-card p-0 shadow-lg backdrop:bg-black/40",
        "w-full max-w-lg",
        className
      )}
      aria-labelledby="dialog-title"
    >
      <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
        <h2 id="dialog-title" className="text-lg font-semibold text-text-primary">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
          aria-label={t("ui.closeDialog")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  );
}
