import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function Progress({ value, label, size = "md", className }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm text-text-tertiary">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-hover",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
