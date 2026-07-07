"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileWarning } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useT } from "@/i18n";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // bytes
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  accept,
  maxSize,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const t = useT();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null);

      if (maxSize && file.size > maxSize) {
        setError(`${t("error.fileTooLargeWithMax")} ${formatBytes(maxSize)}.`);
        return;
      }

      onFileSelect(file);
    },
    [maxSize, onFileSelect, t]
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndAccept(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndAccept(file);
    // Reset so re-selecting the same file works
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label={t("upload.dropzone")}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-150",
          isDragging
            ? "border-primary-400 bg-primary-50"
            : "border-border-default bg-surface-card hover:border-border-hover",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "cursor-pointer"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            isDragging ? "bg-primary-100 text-primary-600" : "bg-surface-hover text-text-tertiary"
          )}
        >
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {isDragging ? t("upload.dropHere") : t("upload.dropzone")}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {accept
              ? `${t("upload.formats")}: ${accept.replace(/\./g, "").toUpperCase()}`
              : t("upload.formatsAll")}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-error-50 px-3 py-2 text-sm text-error-700">
          <FileWarning className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
