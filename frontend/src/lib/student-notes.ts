"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface StudentNote {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  updatedAt: number;
}

const STORAGE_PREFIX = "nexora-student-notes";
const CHANGE_EVENT = "nexora-student-notes-changed";
const EMPTY_SNAPSHOT = "[]";

function getStorageKey(studentId: string) {
  return `${STORAGE_PREFIX}:${encodeURIComponent(studentId)}`;
}

function getSnapshot(studentId: string) {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    return window.localStorage.getItem(getStorageKey(studentId)) ?? EMPTY_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read student notes:", error);
    return EMPTY_SNAPSHOT;
  }
}

function parseNotes(snapshot: string): StudentNote[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) {
      console.error("Saved student notes must be an array.");
      return [];
    }
    return parsed.filter(
      (note): note is StudentNote =>
        typeof note === "object" &&
        note !== null &&
        typeof note.id === "string" &&
        typeof note.title === "string" &&
        typeof note.content === "string" &&
        Number.isFinite(note.updatedAt) &&
        (note.courseId === undefined || typeof note.courseId === "string"),
    );
  } catch (error) {
    console.error("Failed to parse student notes:", error);
    return [];
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

function writeNotes(studentId: string, notes: StudentNote[]) {
  if (typeof window === "undefined") {
    throw new Error("Student note storage is only available in the browser.");
  }
  window.localStorage.setItem(getStorageKey(studentId), JSON.stringify(notes));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useStudentNotes(studentId: string) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribe(studentId, callback),
    () => getSnapshot(studentId),
    () => EMPTY_SNAPSHOT,
  );
  return useMemo(() => parseNotes(snapshot), [snapshot]);
}

export function saveStudentNote(studentId: string, note: StudentNote) {
  if (!note.title.trim() || !note.content.trim()) {
    throw new Error("A note title and note content are required.");
  }
  const notes = parseNotes(getSnapshot(studentId));
  const next = notes.filter((item) => item.id !== note.id);
  next.unshift({ ...note, title: note.title.trim() });
  writeNotes(studentId, next);
}

export function deleteStudentNote(studentId: string, noteId: string) {
  const notes = parseNotes(getSnapshot(studentId));
  writeNotes(
    studentId,
    notes.filter((note) => note.id !== noteId),
  );
}
