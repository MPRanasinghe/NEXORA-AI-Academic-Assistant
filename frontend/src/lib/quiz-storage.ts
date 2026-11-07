"use client";

import { useMemo, useSyncExternalStore } from "react";

export const QUIZ_STORAGE_KEY = "nexora-managed-quizzes";

export type QuizStatus = "Published" | "Draft";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type ManagedQuiz = {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  duration: number;
  questions: QuizQuestion[];
  questionCount: number;
  status: QuizStatus;
  createdAt?: string;
  attempts?: number;
};

const EMPTY_SNAPSHOT = "[]";
const CHANGE_EVENT = "nexora-managed-quizzes-changed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeQuestion(
  value: unknown,
  quizId: string,
  index: number,
): QuizQuestion | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.question !== "string" ||
    !Array.isArray(value.options) ||
    !value.options.every((option) => typeof option === "string")
  ) {
    return null;
  }

  const correctAnswer = Number(value.correctAnswer);
  if (
    !Number.isInteger(correctAnswer) ||
    correctAnswer < 0 ||
    correctAnswer >= value.options.length
  ) {
    return null;
  }

  return {
    id:
      typeof value.id === "string" || typeof value.id === "number"
        ? String(value.id)
        : `${quizId}-question-${index + 1}`,
    question: value.question,
    options: value.options,
    correctAnswer,
    explanation:
      typeof value.explanation === "string" ? value.explanation : "",
  };
}

export function normalizeManagedQuiz(value: unknown): ManagedQuiz | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.title !== "string" ||
    !value.title.trim()
  ) {
    return null;
  }

  const questions = Array.isArray(value.questions)
    ? value.questions
        .map((question, index) =>
          normalizeQuestion(question, value.id as string, index),
        )
        .filter((question): question is QuizQuestion => question !== null)
    : [];
  const duration = Number(value.duration);

  return {
    id: value.id,
    title: value.title,
    description:
      typeof value.description === "string" ? value.description : "",
    subject: typeof value.subject === "string" ? value.subject : "General",
    difficulty:
      typeof value.difficulty === "string" ? value.difficulty : "Intermediate",
    duration: Number.isFinite(duration) && duration > 0 ? duration : 1,
    questions,
    questionCount: questions.length,
    status: value.status === "Published" ? "Published" : "Draft",
    ...(typeof value.createdAt === "string"
      ? { createdAt: value.createdAt }
      : {}),
    ...(Number.isFinite(Number(value.attempts))
      ? { attempts: Number(value.attempts) }
      : {}),
  };
}

export function parseManagedQuizzes(snapshot: string): ManagedQuiz[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) {
      console.error("Saved quizzes must be stored as an array.");
      return [];
    }

    const uniqueQuizzes = new Map<string, ManagedQuiz>();
    for (const entry of parsed) {
      const quiz = normalizeManagedQuiz(entry);
      if (quiz) uniqueQuizzes.set(quiz.id, quiz);
    }
    return [...uniqueQuizzes.values()];
  } catch (error) {
    console.error("Failed to parse saved quizzes:", error);
    return [];
  }
}

export function getQuizStorageSnapshot() {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    return window.localStorage.getItem(QUIZ_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read saved quizzes:", error);
    return EMPTY_SNAPSHOT;
  }
}

function subscribeToQuizStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === QUIZ_STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useManagedQuizzes() {
  const snapshot = useSyncExternalStore(
    subscribeToQuizStorage,
    getQuizStorageSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  return useMemo(() => parseManagedQuizzes(snapshot), [snapshot]);
}

function writeQuizzes(quizzes: ManagedQuiz[]) {
  if (typeof window === "undefined") {
    throw new Error("Quiz storage is only available in the browser.");
  }
  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveManagedQuiz(quiz: ManagedQuiz) {
  const normalized = normalizeManagedQuiz(quiz);
  if (!normalized) throw new Error("Cannot save invalid quiz data.");

  const quizzes = parseManagedQuizzes(getQuizStorageSnapshot());
  const existingIndex = quizzes.findIndex((item) => item.id === normalized.id);
  if (existingIndex >= 0) quizzes[existingIndex] = normalized;
  else quizzes.push(normalized);
  writeQuizzes(quizzes);
}

export function deleteManagedQuiz(id: string) {
  const quizzes = parseManagedQuizzes(getQuizStorageSnapshot());
  writeQuizzes(quizzes.filter((quiz) => quiz.id !== id));
}
