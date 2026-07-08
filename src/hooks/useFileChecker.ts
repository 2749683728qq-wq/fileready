"use client";

import { useState, useRef, useCallback } from "react";
import {
  checkFileCompliance,
  detectFileType,
  DEFAULT_REQUIREMENTS,
  type CheckResult,
  type CheckRequirements,
} from "@/lib/check-compliance";
import { useT } from "@/i18n";

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
  const t = useT();
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

  const selectFile = useCallback(
    (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        setState((prev) => ({
          ...prev,
          appState: "error",
          error: t("error.fileTooLarge"),
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
    },
    [t]
  );

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
            : t("error.unexpectedCheck"),
      }));
    }
  }, [t]);

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
