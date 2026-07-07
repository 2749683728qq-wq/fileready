import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-hover text-text-tertiary">
        {icon || <FileQuestion className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
