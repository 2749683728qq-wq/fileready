import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

type ResultStatus = "pass" | "fail" | "warning" | "unknown";

interface ResultItem {
  label: string;
  status: ResultStatus;
  detail?: string;
}

interface ResultSummaryProps {
  items: ResultItem[];
  className?: string;
}

export function ResultSummary({ items, className }: ResultSummaryProps) {
  const t = useT();

  const statusConfig: Record<ResultStatus, { icon: typeof CheckCircle2; label: string; color: string }> = {
    pass: { icon: CheckCircle2, label: t("result.passed"), color: "text-success-600" },
    fail: { icon: XCircle, label: t("result.failed"), color: "text-error-600" },
    warning: { icon: AlertTriangle, label: t("result.needsReview"), color: "text-warning-600" },
    unknown: { icon: HelpCircle, label: t("result.cannotDetermine"), color: "text-text-tertiary" },
  };

  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 text-sm">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = counts[key] || 0;
          if (count === 0) return null;
          const Icon = config.icon;
          return (
            <div key={key} className={cn("flex items-center gap-1.5", config.color)}>
              <Icon className="h-4 w-4" />
              <span className="font-medium">{count}</span>
              <span className="text-text-tertiary">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Items */}
      <ul className="divide-y divide-border-default rounded-lg border border-border-default bg-surface-card">
        {items.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <li key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-primary">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.detail && (
                  <span className="text-xs text-text-tertiary">{item.detail}</span>
                )}
                <span className={cn("flex items-center gap-1 text-sm font-medium", config.color)}>
                  <Icon className="h-4 w-4" />
                  {config.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
