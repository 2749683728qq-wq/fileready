"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ShieldCheck } from "lucide-react";
import { Input, Select, AdContainer } from "@/components/ui";
import {
  calculateDpi,
  formatDpiNumber,
  getUnitName,
} from "@/lib/image";
import type { LengthUnit, DpiCalculation } from "@/lib/image";
import { formatAspectRatio } from "@/lib/utils";
import { useT, useLocale } from "@/i18n";

const UNIT_OPTIONS: { value: LengthUnit; label: string }[] = [
  { value: "px", label: "Pixels (px)" },
  { value: "mm", label: "Millimeters (mm)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "in", label: "Inches (in)" },
];

export default function DpiCalculatorPage() {
  const t = useT();
  const locale = useLocale();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [unit, setUnit] = useState<LengthUnit>("px");
  const [dpi, setDpi] = useState(300);

  const [calculation, setCalculation] = useState<DpiCalculation | null>(null);

  const handleCalculate = useCallback(() => {
    if (width <= 0 || height <= 0 || dpi <= 0) return;
    const result = calculateDpi({ width, height, unit, dpi });
    setCalculation(result);
  }, [width, height, unit, dpi]);

  // Auto-calculate when inputs change
  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10) || 0;
      setWidth(v);
    },
    []
  );
  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10) || 0;
      setHeight(v);
    },
    []
  );
  const handleDpiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10) || 0;
      setDpi(v);
    },
    []
  );

  const hasValidInput = width > 0 && height > 0 && dpi > 0;

  return (
    <div className="mx-auto max-w-3xl" translate="no">
      {/* Breadcrumb */}
      <nav aria-label={t("breadcrumb.label")} className="mb-4 text-sm text-text-tertiary">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href={`/${locale}`} className="hover:text-text-link">
              {t("breadcrumb.home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${locale}`} className="hover:text-text-link">
              {t("breadcrumb.tools")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary" aria-current="page">
            {t("dpi.title")}
          </li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("dpi.title")}
      </h1>
      <p className="mt-2 text-text-secondary">
        {t("dpi.desc")}
      </p>

      {/* Calculator Area */}
      <section className="mt-8 space-y-6">
        <div className="rounded-lg border border-border-default bg-surface-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            {t("dpi.enterDims")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("dpi.width")}
              type="number"
              min={1}
              value={width || ""}
              onChange={handleWidthChange}
              hint={unit !== "px" ? getUnitName(unit) : t("dpi.pixelsHint")}
            />
            <Input
              label={t("dpi.height")}
              type="number"
              min={1}
              value={height || ""}
              onChange={handleHeightChange}
              hint={unit !== "px" ? getUnitName(unit) : t("dpi.pixelsHint")}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              label={t("dpi.unit")}
              options={UNIT_OPTIONS}
              value={unit}
              onChange={(e) => setUnit(e.target.value as LengthUnit)}
            />
            <Input
              label={t("dpi.dpiLabel")}
              type="number"
              min={1}
              max={1200}
              value={dpi || ""}
              onChange={handleDpiChange}
              hint={t("dpi.dpiHint")}
            />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!hasValidInput}
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Ruler className="h-4 w-4" />
              {t("dpi.calculate")}
            </button>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="rounded-lg border border-border-default bg-surface-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                {t("dpi.dimsAt").replace("{dpi}", String(dpi))}
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <div className="text-xs text-text-tertiary">{t("dpi.pixels")}</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {calculation.widthPx} × {calculation.heightPx}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">{t("dpi.millimeters")}</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {formatDpiNumber(calculation.widthMm)} ×{" "}
                    {formatDpiNumber(calculation.heightMm)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">{t("dpi.centimeters")}</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {formatDpiNumber(calculation.widthCm)} ×{" "}
                    {formatDpiNumber(calculation.heightCm)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">{t("dpi.inches")}</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {formatDpiNumber(calculation.widthIn)} ×{" "}
                    {formatDpiNumber(calculation.heightIn)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
                <span>
                  <strong>{t("dpi.megapixelsLabel")}</strong>{" "}
                  {formatDpiNumber(calculation.megapixels)} MP
                </span>
                <span>
                  <strong>{t("dpi.aspectRatioLabel")}</strong>{" "}
                  {formatAspectRatio(
                    calculation.widthPx,
                    calculation.heightPx
                  )}
                </span>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-lg border border-border-default bg-surface-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                {t("dpi.commonDpi")}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-default text-left">
                      <th className="pb-2 pr-4 font-semibold text-text-secondary">{t("dpi.dpiTh")}</th>
                      <th className="pb-2 pr-4 font-semibold text-text-secondary">{t("dpi.pixelsTh")}</th>
                      <th className="pb-2 pr-4 font-semibold text-text-secondary">{t("dpi.mmTh")}</th>
                      <th className="pb-2 pr-4 font-semibold text-text-secondary">{t("dpi.cmTh")}</th>
                      <th className="pb-2 pr-4 font-semibold text-text-secondary">{t("dpi.inTh")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.table.map((row) => (
                      <tr
                        key={row.dpi}
                        className={
                          row.dpi === dpi
                            ? "border-b border-border-default bg-primary-50/50"
                            : "border-b border-border-default"
                        }
                      >
                        <td className="py-2 pr-4 font-medium text-text-primary">
                          {row.dpi}
                          {row.dpi === dpi && (
                            <span className="ml-1.5 text-xs text-primary-600">
                              {t("dpi.current")}
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          {row.widthPx} × {row.heightPx}
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          {formatDpiNumber(row.widthMm)} ×{" "}
                          {formatDpiNumber(row.heightMm)}
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          {formatDpiNumber(row.widthCm)} ×{" "}
                          {formatDpiNumber(row.heightCm)}
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          {formatDpiNumber(row.widthIn)} ×{" "}
                          {formatDpiNumber(row.heightIn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-text-tertiary">
                Pixel values at different DPIs show how many pixels would be
                needed to achieve the same physical size at that resolution.
                Physical dimensions (mm, cm, in) remain constant regardless of
                DPI — DPI only changes the pixel count.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Privacy Notice */}
      <section className="mt-12 rounded-lg border border-success-100 bg-success-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t("privacy.everythingLocal")}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              {t("privacy.localBrief")}
            </p>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="mt-12">
        <AdContainer slotHeight="sm" />
      </div>

      {/* Help Section */}
      <section className="mt-12 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("dpi.aboutTitle")}
        </h2>
        <div className="mt-4 space-y-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary">
              {t("dpi.about1Q")}
            </h3>
            <p className="mt-1">
              {t("dpi.about1A")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {t("dpi.about2Q")}
            </h3>
            <p className="mt-1">
              {t("dpi.about2A")}
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-8 border-t border-border-default pt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("related.title")}
        </h2>
        <ul className="mt-3 space-y-1.5">
          <li>
            <Link
              href={`/${locale}/tools/image-resizer`}
              className="text-sm text-text-link hover:underline"
            >
              Image Resizer &amp; Cropper
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/tools/image-compressor`}
              className="text-sm text-text-link hover:underline"
            >
              Image Compressor
            </Link>
          </li>
        </ul>
      </section>

      {/* Last updated */}
      <p className="mt-8 text-xs text-text-tertiary">
        {t("lastUpdated")}
      </p>
    </div>
  );
}
