import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { icon: typeof Info; bg: string; text: string; border: string }
> = {
  info: {
    icon: Info,
    bg: "bg-info-50",
    text: "text-info-600",
    border: "border-info-100",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-success-50",
    text: "text-success-700",
    border: "border-success-100",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning-50",
    text: "text-warning-700",
    border: "border-warning-100",
  },
  error: {
    icon: XCircle,
    bg: "bg-error-50",
    text: "text-error-700",
    border: "border-error-100",
  },
};

export function Alert({ variant, title, children, className }: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        config.bg,
        config.border,
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.text)} />
      <div>
        {title && (
          <p className={cn("text-sm font-semibold", config.text)}>{title}</p>
        )}
        <div className={cn("text-sm", config.text, title && "mt-1")}>
          {children}
        </div>
      </div>
    </div>
  );
}
