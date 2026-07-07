import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : "", hint ? hintId : ""].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "block w-full rounded-md border bg-surface-card px-3 py-2 text-sm text-text-primary transition-colors duration-150",
            "placeholder:text-text-tertiary",
            "focus:border-border-focus focus:outline-none",
            error
              ? "border-error-500 focus:border-error-500"
              : "border-border-default hover:border-border-hover",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-text-tertiary">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-error-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
