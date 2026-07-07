import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, className, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-border-default text-primary-600",
            "focus:ring-2 focus:ring-primary-500 focus:ring-offset-0",
            className
          )}
          {...props}
        />
        <div className="flex-1">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-text-primary cursor-pointer"
          >
            {label}
          </label>
          {hint && <p className="text-xs text-text-tertiary mt-0.5">{hint}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
