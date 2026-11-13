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
const DEFAULT_STUDENT_ID = "SE/2023/048";

export const DEFAULT_STUDENT_ENROLLMENTS: StudentEnrollment[] = [
  { courseId: "crs-101", termId: "term-y1s1", status: "Completed" },
  { courseId: "crs-102", termId: "term-y1s1", status: "Completed" },
  { courseId: "crs-103", termId: "term-y1s1", status: "Completed" },
  { courseId: "crs-104", termId: "term-y1s1", status: "Completed" },
  { courseId: "crs-105", termId: "term-y1s1", status: "Completed" },
  { courseId: "crs-106", termId: "term-y1s2", status: "Completed" },
  { courseId: "crs-107", termId: "term-y1s2", status: "Completed" },
  { courseId: "crs-108", termId: "term-y1s2", status: "Completed" },
  { courseId: "crs-109", termId: "term-y1s2", status: "Completed" },
  { courseId: "crs-110", termId: "term-y1s2", status: "Completed" },
  { courseId: "crs-201", termId: "term-y2s1", status: "Completed" },
  { courseId: "crs-202", termId: "term-y2s1", status: "Completed" },
  { courseId: "crs-203", termId: "term-y2s1", status: "Completed" },
  { courseId: "crs-204", termId: "term-y2s1", status: "Completed" },
  { courseId: "crs-205", termId: "term-y2s1", status: "Completed" },
  { courseId: "crs-206", termId: "term-y2s2", status: "Completed" },
  { courseId: "crs-207", termId: "term-y2s2", status: "Completed" },
  { courseId: "crs-208", termId: "term-y2s2", status: "Completed" },
  { courseId: "crs-209", termId: "term-y2s2", status: "Completed" },
  { courseId: "crs-210", termId: "term-y2s2", status: "Completed" },
  { courseId: "crs-301", termId: "term-y3s1", status: "Enrolled" },
  { courseId: "crs-302", termId: "term-y3s1", status: "Enrolled" },
  { courseId: "crs-303", termId: "term-y3s1", status: "Enrolled" },
  { courseId: "crs-304", termId: "term-y3s1", status: "Enrolled" },
  { courseId: "crs-305", termId: "term-y3s1", status: "Enrolled" },
];

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
    return (
      window.localStorage.getItem(getStorageKey(studentId)) ??
      (studentId === DEFAULT_STUDENT_ID
        ? JSON.stringify(DEFAULT_STUDENT_ENROLLMENTS)
        : EMPTY_SNAPSHOT)
    );
  } catch (error) {
    console.error("Failed to read student enrollments:", error);
    return studentId === DEFAULT_STUDENT_ID
      ? JSON.stringify(DEFAULT_STUDENT_ENROLLMENTS)
      : EMPTY_SNAPSHOT;
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
    () =>
      studentId === DEFAULT_STUDENT_ID
        ? JSON.stringify(DEFAULT_STUDENT_ENROLLMENTS)
        : EMPTY_SNAPSHOT,
  );
  return useMemo(() => normalizeEnrollments(snapshot), [snapshot]);
}
