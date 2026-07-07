"use client";

import { useState, useRef, useCallback } from "react";
import {
  checkFileCompliance,
  detectFileType,
  DEFAULT_REQUIREMENTS,
  type CheckResult,
  type CheckRequirements,
} from "@/lib/check-compliance";

type AppState =
  | "initial"
  | "file-selected"
  | "checking"
  | "results"
  | "error";

interface CheckerState {
  appState: AppState;
  file: File | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  result: CheckResult | null;
  error: string | null;
  requirements: CheckRequirements;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

export function useFileChecker() {
  const [state, setState] = useState<CheckerState>({
    appState: "initial",
    file: null,
    fileName: null,
    fileSize: null,
    fileType: null,
    result: null,
    error: null,
    requirements: { ...DEFAULT_REQUIREMENTS },
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const selectFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setState((prev) => ({
        ...prev,
        appState: "error",
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
      }));
      return;
    }

    const detectedType = detectFileType(file);

    setState((prev) => ({
      ...prev,
      appState: "file-selected",
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: detectedType,
      error: null,
    }));
  }, []);

  const updateRequirements = useCallback(
    (partial: Partial<CheckRequirements>) => {
      setState((prev) => ({
        ...prev,
        requirements: { ...prev.requirements, ...partial },
      }));
    },
    []
  );

  const startCheck = useCallback(async () => {
    const { file, requirements } = stateRef.current;
    if (!file) return;

    setState((prev) => ({
      ...prev,
      appState: "checking",
      error: null,
    }));

    try {
      const result = await checkFileCompliance(file, requirements);

      setState((prev) => ({
        ...prev,
        appState: "results",
        result,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        appState: "error",
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during the check.",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      appState: "initial",
      file: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      result: null,
      error: null,
      requirements: { ...DEFAULT_REQUIREMENTS },
    });
  }, []);

  return {
    ...state,
    selectFile,
    updateRequirements,
    startCheck,
    reset,
    MAX_FILE_SIZE,
  };
}
