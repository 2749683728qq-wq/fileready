import { cn } from "@/lib/utils";

interface ComparisonRow {
  label: string;
  before: string;
  after: string;
  improved?: boolean;
}

interface BeforeAfterComparisonProps {
  rows: ComparisonRow[];
  className?: string;
}

export function BeforeAfterComparison({ rows, className }: BeforeAfterComparisonProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border-default", className)}>
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 bg-surface-hover px-4 py-2.5 text-xs font-semibold uppercase text-text-tertiary">
        <div>Property</div>
        <div>Before</div>
        <div>After</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border-default bg-surface-card">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-3 gap-4 px-4 py-3 text-sm",
              row.improved && "bg-success-50/50"
            )}
          >
            <span className="font-medium text-text-primary">{row.label}</span>
            <span className="text-text-secondary">{row.before}</span>
            <span
              className={cn(
                row.improved
                  ? "font-medium text-success-700"
                  : "text-text-primary"
              )}
            >
              {row.after}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
