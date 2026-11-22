"use client";

import { useMemo, useSyncExternalStore } from "react";

export type EnrollmentStatus = "Enrolled" | "Completed";

export interface StudentEnrollment {
  courseId: string;
  termId: string;
  status: EnrollmentStatus;
}

const STORAGE_PREFIX = "nexora-student-enrollments";
const CHANGE_EVENT = "nexora-student-enrollments-changed";
const EMPTY_SNAPSHOT = "[]";

function getStorageKey(studentId: string) {
  return `${STORAGE_PREFIX}:${encodeURIComponent(studentId)}`;
}

function normalizeEnrollments(snapshot: string): StudentEnrollment[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) {
      console.error("Saved student enrollments must be an array.");
      return [];
    }

    return parsed.filter(
      (enrollment): enrollment is StudentEnrollment =>
        typeof enrollment === "object" &&
        enrollment !== null &&
        typeof enrollment.courseId === "string" &&
        typeof enrollment.termId === "string" &&
        (enrollment.status === "Enrolled" || enrollment.status === "Completed"),
    );
  } catch (error) {
    console.error("Failed to parse student enrollments:", error);
    return [];
  }
}

function getSnapshot(studentId: string) {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    return window.localStorage.getItem(getStorageKey(studentId)) ?? EMPTY_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read student enrollments:", error);
    return EMPTY_SNAPSHOT;
  }
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

export function useStudentEnrollments(studentId: string) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribe(studentId, callback),
    () => getSnapshot(studentId),
    () => EMPTY_SNAPSHOT,
  );
  return useMemo(() => normalizeEnrollments(snapshot), [snapshot]);
}
