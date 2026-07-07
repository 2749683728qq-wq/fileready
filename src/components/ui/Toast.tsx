"use client";

import { useEffect, useState, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

// Simple global toast state for use across the app
let addToastGlobal: ((variant: ToastVariant, message: string) => void) | null = null;

export function showToast(variant: ToastVariant, message: string) {
  addToastGlobal?.(variant, message);
}

const variantIcon: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success-100 bg-success-50 text-success-700",
  error: "border-error-100 bg-error-50 text-error-700",
  warning: "border-warning-100 bg-warning-50 text-warning-700",
  info: "border-info-100 bg-info-50 text-info-600",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((variant: ToastVariant, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, variant, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => {
      addToastGlobal = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = variantIcon[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md text-sm min-w-[280px] max-w-[400px] animate-in",
              variantStyles[toast.variant]
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded p-0.5 hover:bg-black/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
