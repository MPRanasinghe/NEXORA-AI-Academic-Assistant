"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface StudentPreferences {
  quizReminders: boolean;
  courseMaterialUpdates: boolean;
  assistantCitations: boolean;
}

export const DEFAULT_STUDENT_PREFERENCES: StudentPreferences = {
  quizReminders: true,
  courseMaterialUpdates: true,
  assistantCitations: true,
};

const STORAGE_PREFIX = "nexora-student-preferences";
const CHANGE_EVENT = "nexora-student-preferences-changed";

function getStorageKey(studentId: string) {
  return `${STORAGE_PREFIX}:${encodeURIComponent(studentId)}`;
}

function getSnapshot(studentId: string) {
  if (typeof window === "undefined") {
    return JSON.stringify(DEFAULT_STUDENT_PREFERENCES);
  }
  try {
    return (
      window.localStorage.getItem(getStorageKey(studentId)) ??
      JSON.stringify(DEFAULT_STUDENT_PREFERENCES)
    );
  } catch (error) {
    console.error("Failed to read student preferences:", error);
    return JSON.stringify(DEFAULT_STUDENT_PREFERENCES);
  }
}

function parsePreferences(snapshot: string): StudentPreferences {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "quizReminders" in parsed &&
      "courseMaterialUpdates" in parsed &&
      "assistantCitations" in parsed &&
      typeof parsed.quizReminders === "boolean" &&
      typeof parsed.courseMaterialUpdates === "boolean" &&
      typeof parsed.assistantCitations === "boolean"
    ) {
      return {
        quizReminders: parsed.quizReminders,
        courseMaterialUpdates: parsed.courseMaterialUpdates,
        assistantCitations: parsed.assistantCitations,
      };
    }
  } catch (error) {
    console.error("Failed to parse student preferences:", error);
  }
  return DEFAULT_STUDENT_PREFERENCES;
}

function subscribe(studentId: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const key = getStorageKey(studentId);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useStudentPreferences(studentId: string) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribe(studentId, callback),
    () => getSnapshot(studentId),
    () => JSON.stringify(DEFAULT_STUDENT_PREFERENCES),
  );
  return useMemo(() => parsePreferences(snapshot), [snapshot]);
}

export function saveStudentPreferences(
  studentId: string,
  preferences: StudentPreferences,
) {
  if (typeof window === "undefined") {
    throw new Error("Student preference storage is only available in the browser.");
  }
  window.localStorage.setItem(
    getStorageKey(studentId),
    JSON.stringify(preferences),
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
