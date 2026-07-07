"use client";

import { useState, useRef, useCallback } from "react";
import {
  loadImage,
  isSupportedImage,
  processSignature,
  ImageError,
  type ImageMeta,
  type SignatureOptions,
  type SignatureResult,
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

interface ProcessorState {
  appState: AppState;
  meta: ImageMeta | null;
  result: SignatureResult | null;
  error: string | null;
  errorCode: string | null;
  progress: number;
  options: SignatureOptions;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const DEFAULT_OPTIONS: SignatureOptions = {
  autoCrop: true,
  cropPadding: 10,
  removeBackground: true,
  backgroundThreshold: 240,
  colorMode: "black-and-white",
  contrast: 100,
  bwThreshold: 128,
  outputWidth: 0,
  outputHeight: 0,
  maintainAspectRatio: true,
};

export function useSignatureProcessor() {
  const [state, setState] = useState<ProcessorState>({
    appState: "initial",
    meta: null,
    result: null,
    error: null,
    errorCode: null,
    progress: 0,
    options: { ...DEFAULT_OPTIONS },
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
        const meta = await loadImage(file);
        setState((prev) => ({
          ...prev,
          appState: "file-ready",
          meta,
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

  const updateOptions = useCallback((partial: Partial<SignatureOptions>) => {
    setState((prev) => ({
      ...prev,
      options: { ...prev.options, ...partial },
    }));
  }, []);

  const setPreset = useCallback((width: number, height: number) => {
    setState((prev) => ({
      ...prev,
      options: { ...prev.options, outputWidth: width, outputHeight: height },
    }));
  }, []);

  const startProcessing = useCallback(async () => {
    const { meta, options } = stateRef.current;
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
        const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
        return { ...prev, progress: newProgress };
      });
    }, 300);

    try {
      const result = await processSignature(meta.file, {
        ...options,
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
        error: err instanceof Error ? err.message : "Processing failed",
        errorCode: "processing_failed",
        progress: 0,
      }));
    }
  }, [cleanup]);

  const cancelProcessing = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const downloadResult = useCallback(() => {
    const { result, meta } = stateRef.current;
    if (!result || !resultUrlRef.current) return;

    const originalName = meta?.file.name || "signature";
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const newName = `${baseName}-processed.png`;

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
      result: null,
      error: null,
      errorCode: null,
      progress: 0,
      options: { ...DEFAULT_OPTIONS },
    });
  }, [cleanup]);

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
    updateOptions,
    setPreset,
    startProcessing,
    cancelProcessing,
    downloadResult,
    reset,
    changeFile,
    retry,
    MAX_FILE_SIZE,
  };
}
