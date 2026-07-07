"use client";

import { useState, useRef, useCallback } from "react";
import {
  loadImage,
  compressImage,
  isSupportedImage,
  ImageError,
  type ImageMeta,
  type CompressionResult,
} from "@/lib/image";

type AppState =
  | "initial"
  | "file-selected"
  | "reading-file"
  | "file-ready"
  | "format-unsupported"
  | "file-too-large"
  | "invalid-params"
  | "processing"
  | "processing-cancelled"
  | "processing-done"
  | "processing-failed"
  | "download-ready";

interface CompressorState {
  appState: AppState;
  meta: ImageMeta | null;
  result: CompressionResult | null;
  error: string | null;
  errorCode: string | null;
  progress: number;
  targetSizeBytes: number;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function useImageCompressor() {
  const [state, setState] = useState<CompressorState>({
    appState: "initial",
    meta: null,
    result: null,
    error: null,
    errorCode: null,
    progress: 0,
    targetSizeBytes: 200 * 1024, // Default 200KB
  });

  const abortRef = useRef<AbortController | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Cleanup Object URLs
  const cleanup = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  // Select a file
  const selectFile = useCallback(async (file: File) => {
    cleanup();

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      setState((prev) => ({
        ...prev,
        appState: "file-too-large",
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        errorCode: "size_exceeded",
      }));
      return;
    }

    // Format check
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
      const meta = await loadImage(file);
      setState((prev) => ({
        ...prev,
        appState: "file-ready",
        meta,
      }));
    } catch (err) {
      const imageErr = err instanceof ImageError ? err : new ImageError("Failed to read file", "load_failed");
      setState((prev) => ({
        ...prev,
        appState: "processing-failed",
        error: imageErr.message,
        errorCode: imageErr.code,
      }));
    }
  }, [cleanup]);

  // Set target size
  const setTargetSize = useCallback((bytes: number) => {
    setState((prev) => ({ ...prev, targetSizeBytes: bytes }));
  }, []);

  // Start compression
  const startCompression = useCallback(async () => {
    const { meta, targetSizeBytes } = stateRef.current;
    if (!meta) return;

    // Cancel any existing
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

    // Simulate progress updates
    const progressTimer = setInterval(() => {
      setState((prev) => {
        if (prev.appState !== "processing") return prev;
        const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
        return { ...prev, progress: newProgress };
      });
    }, 300);

    try {
      const result = await compressImage(meta, {
        targetSizeBytes,
        signal: controller.signal,
      });

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
        error: err instanceof Error ? err.message : "Compression failed",
        errorCode: "compression_failed",
        progress: 0,
      }));
    }
  }, [cleanup]);

  // Cancel compression
  const cancelCompression = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // Download result
  const downloadResult = useCallback(() => {
    const { result, meta } = stateRef.current;
    if (!result || !resultUrlRef.current) return;

    const originalName = meta?.file.name || "image";
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const ext = result.format.split("/")[1] || "jpg";
    const newName = `${baseName}-compressed.${ext}`;

    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setState((prev) => ({ ...prev, appState: "download-ready" }));
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setState({
      appState: "initial",
      meta: null,
      result: null,
      error: null,
      errorCode: null,
      progress: 0,
      targetSizeBytes: 200 * 1024,
    });
  }, [cleanup]);

  // Change file (back to upload)
  const changeFile = useCallback(() => {
    abortRef.current?.abort();
    cleanup();
    setState((prev) => ({
      ...prev,
      appState: "initial",
      meta: null,
      result: null,
      error: null,
      errorCode: null,
      progress: 0,
    }));
  }, [cleanup]);

  // Retry after error
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
    setTargetSize,
    startCompression,
    cancelCompression,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  };
}
