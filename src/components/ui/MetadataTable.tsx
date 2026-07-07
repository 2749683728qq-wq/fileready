"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Shield, MapPin, Camera, Clock, ImageIcon, FileText } from "lucide-react";
import type { MetadataCategory } from "@/lib/image";
import { getPrivacyRiskColor } from "@/lib/image";
import { useT } from "@/i18n";

interface MetadataTableProps {
  categories: MetadataCategory[];
  showPrivacyBadge?: boolean;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "GPS Location": MapPin,
  "Camera Info": Camera,
  "Timestamps": Clock,
  "Image Properties": ImageIcon,
  "File Info": FileText,
};

export function MetadataTable({
  categories,
  showPrivacyBadge = true,
  className = "",
}: MetadataTableProps) {
  const t = useT();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (name: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (categories.length === 0) {
    return (
      <div className={`rounded-lg border border-border-default bg-surface-card p-6 text-center ${className}`}>
        <Shield className="mx-auto h-8 w-8 text-text-tertiary" />
        <p className="mt-2 text-sm text-text-secondary">
          {t("ui.noMetadata")}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">
          {t("ui.noMetadataDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {categories.map((category) => {
        const isCollapsed = collapsedCategories.has(category.name);
        const Icon = CATEGORY_ICONS[category.name] || FileText;

        return (
          <div
            key={category.name}
            className="rounded-lg border border-border-default bg-surface-card"
          >
            {/* Category Header */}
            <button
              type="button"
              onClick={() => toggleCategory(category.name)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-secondary/50 transition-colors"
              aria-expanded={!isCollapsed}
            >
              <Icon className="h-4 w-4 shrink-0 text-text-tertiary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                {category.name}
              </span>
              <span className="text-xs text-text-tertiary">
                {category.entries.length} {category.entries.length === 1 ? t("ui.entry") : t("ui.entries")}
              </span>
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-text-tertiary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-text-tertiary" />
              )}
            </button>

            {/* Category Entries */}
            {!isCollapsed && (
              <div className="border-t border-border-default">
                <table className="w-full">
                  <tbody>
                    {category.entries.map((entry, idx) => (
                      <tr
                        key={entry.key}
                        className={
                          idx < category.entries.length - 1
                            ? "border-b border-border-default"
                            : ""
                        }
                      >
                        <td className="px-4 py-2 text-sm text-text-secondary w-2/5">
                          {entry.label}
                        </td>
                        <td className="px-4 py-2 text-sm text-text-primary">
                          {entry.value}
                        </td>
                        {showPrivacyBadge && (
                          <td className="px-4 py-2 text-right">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getPrivacyRiskColor(entry.privacyRisk)}`}
                            >
                              {entry.privacyRisk}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
