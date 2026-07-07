import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  hint?: string;
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  name: string;
  options: RadioOption[];
  error?: string;
}

export function RadioGroup({
  label,
  name,
  options,
  error,
  className,
  ...props
}: RadioGroupProps) {
  const groupId = name;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text-primary">{label}</legend>
      <div className="space-y-2">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          return (
            <div key={option.value} className="flex items-start gap-3">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                className={cn(
                  "mt-0.5 h-4 w-4 border-border-default text-primary-600",
                  "focus:ring-2 focus:ring-primary-500 focus:ring-offset-0",
                  className
                )}
                {...props}
              />
              <div>
                <label
                  htmlFor={optionId}
                  className="text-sm text-text-primary cursor-pointer"
                >
                  {option.label}
                </label>
                {option.hint && (
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {option.hint}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-error-600" role="alert" id={`${groupId}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
