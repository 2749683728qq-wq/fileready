"use client";

import { useState, useRef, useCallback } from "react";
import {
  loadImage,
  isSupportedImage,
  readMetadata,
  stripMetadata,
  ImageError,
  type ImageMeta,
  type MetadataReport,
  type StrippedResult,
} from "@/lib/image";

type AppState =
  | "initial"
  | "reading-file"
  | "file-ready"
  | "format-unsupported"
  | "file-too-large"
  | "processing"
  | "processing-cancelled"
  | "processing-done"
  | "processing-failed"
  | "download-ready";

interface MetadataState {
  appState: AppState;
  meta: ImageMeta | null;
  metadata: MetadataReport | null;
  result: StrippedResult | null;
  error: string | null;
  errorCode: string | null;
  progress: number;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function useImageMetadata() {
  const [state, setState] = useState<MetadataState>({
    appState: "initial",
    meta: null,
    metadata: null,
    result: null,
    error: null,
    errorCode: null,
    progress: 0,
  });

  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const cleanup = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  const selectFile = useCallback(
    async (file: File) => {
      cleanup();

      if (file.size > MAX_FILE_SIZE) {
        setState((prev) => ({
          ...prev,
          appState: "file-too-large",
          error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
          errorCode: "size_exceeded",
        }));
        return;
      }

      if (!isSupportedImage(file)) {
        setState((prev) => ({
          ...prev,
          appState: "format-unsupported",
          error: "Unsupported format. Please use JPG, JPEG, PNG, or WebP files.",
          errorCode: "format_unsupported",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        appState: "reading-file",
        error: null,
        errorCode: null,
      }));

      try {
        const [meta, metadata] = await Promise.all([
          loadImage(file),
          readMetadata(file),
        ]);

        setState((prev) => ({
          ...prev,
          appState: "file-ready",
          meta,
          metadata,
        }));
      } catch (err) {
        const imageErr =
          err instanceof ImageError
            ? err
            : new ImageError("Failed to read file", "load_failed");
        setState((prev) => ({
          ...prev,
          appState: "processing-failed",
          error: imageErr.message,
          errorCode: imageErr.code,
        }));
      }
    },
    [cleanup]
  );

  const startStripping = useCallback(async () => {
    const { meta } = stateRef.current;
    if (!meta) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      appState: "processing",
      progress: 0,
      error: null,
      errorCode: null,
    }));

    const progressTimer = setInterval(() => {
      setState((prev) => {
        if (prev.appState !== "processing") return prev;
        const newProgress = Math.min(prev.progress + Math.random() * 20, 90);
        return { ...prev, progress: newProgress };
      });
    }, 250);

    try {
      const result = await stripMetadata(meta.file);

      clearInterval(progressTimer);
      cleanup();
      resultUrlRef.current = URL.createObjectURL(result.blob);

      setState((prev) => ({
        ...prev,
        appState: "processing-done",
        result,
        progress: 100,
      }));
    } catch (err) {
      clearInterval(progressTimer);

      if (err instanceof ImageError && err.code === "cancelled") {
        setState((prev) => ({
          ...prev,
          appState: "processing-cancelled",
          progress: 0,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        appState: "processing-failed",
        error: err instanceof Error ? err.message : "Metadata stripping failed",
        errorCode: "strip_failed",
        progress: 0,
      }));
    }
  }, [cleanup]);

  const cancelStripping = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const downloadResult = useCallback(() => {
    const { result, meta } = stateRef.current;
    if (!result || !resultUrlRef.current) return;

    const originalName = meta?.file.name || "image";
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const newName = `${baseName}-clean.${originalName.split(".").pop()}`;

    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setState((prev) => ({ ...prev, appState: "download-ready" }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setState({
      appState: "initial",
      meta: null,
      metadata: null,
      result: null,
      error: null,
      errorCode: null,
      progress: 0,
    });
  }, [cleanup]);

  const changeFile = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setState((prev) => ({
      ...prev,
      appState: "initial",
      meta: null,
      metadata: null,
      result: null,
      error: null,
      errorCode: null,
      progress: 0,
    }));
  }, [cleanup]);

  const retry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      appState: prev.meta ? "file-ready" : "initial",
      error: null,
      errorCode: null,
      progress: 0,
      result: null,
    }));
  }, []);

  return {
    ...state,
    resultUrl: resultUrlRef.current,
    selectFile,
    startStripping,
    cancelStripping,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  };
}
