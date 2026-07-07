import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, hint, error, className, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${selectId}-error`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "block w-full rounded-md border bg-surface-card px-3 py-2 text-sm text-text-primary transition-colors duration-150",
            "focus:border-border-focus focus:outline-none",
            error
              ? "border-error-500"
              : "border-border-default hover:border-border-hover",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <p className="text-xs text-text-tertiary">{hint}</p>
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

Select.displayName = "Select";
