import { cn } from "@/lib/utils";

interface AdContainerProps {
  className?: string;
  /** Prevents CLS by reserving space */
  slotHeight?: "sm" | "md" | "lg";
}

const heightMap: Record<string, string> = {
  sm: "min-h-[90px]",
  md: "min-h-[250px]",
  lg: "min-h-[400px]",
};

/**
 * Placeholder component for AdSense ad slots.
 * In development and when ads are disabled, shows nothing.
 * When ads are enabled and approved, this will render the real AdSense unit.
 */
export function AdContainer({ className, slotHeight = "md" }: AdContainerProps) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  // Don't render anything if ads are not enabled
  if (!adsEnabled) return null;

  // When ads are enabled but no client ID is set, reserve space to prevent CLS
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-border-default bg-surface-hover/30",
        heightMap[slotHeight],
        className
      )}
      aria-hidden="true"
    >
      <span className="text-xs text-text-tertiary">Advertisement</span>
    </div>
  );
}
