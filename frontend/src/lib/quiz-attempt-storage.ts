"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ManagedQuiz, QuizQuestion } from "@/lib/quiz-storage";

export type QuizAttemptStatus = "in_progress" | "submitted";

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  questions: QuizQuestion[];
  duration: number;
  maxAttempts: number;
  startedAt: number;
  expiresAt: number;
  answers: Record<string, number>;
  markedQuestionIds: string[];
  status: QuizAttemptStatus;
  submittedAt?: number;
  correctCount?: number;
  scorePercentage?: number;
}

const EMPTY_SNAPSHOT = "[]";
const CHANGE_EVENT = "nexora-quiz-attempts-changed";
const STORAGE_PREFIX = "nexora-quiz-attempts";

export class AttemptLimitError extends Error {
  constructor() {
    super("You have used all permitted attempts for this quiz.");
    this.name = "AttemptLimitError";
  }
}

export class AttemptExpiredError extends Error {
  constructor() {
    super("This quiz attempt has expired and is being submitted.");
    this.name = "AttemptExpiredError";
  }
}

function getStorageKey(studentId: string) {
  return `${STORAGE_PREFIX}:${encodeURIComponent(studentId)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeQuestion(value: unknown): QuizQuestion | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
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
    id: value.id,
    question: value.question,
    options: value.options,
    correctAnswer,
    explanation:
      typeof value.explanation === "string" ? value.explanation : "",
  };
}

function normalizeAttempt(value: unknown): QuizAttempt | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    typeof value.quizId !== "string" ||
    typeof value.quizTitle !== "string" ||
    typeof value.studentId !== "string" ||
    !Array.isArray(value.questions) ||
    !Number.isFinite(value.duration) ||
    Number(value.duration) <= 0 ||
    !Number.isFinite(value.maxAttempts) ||
    Number(value.maxAttempts) <= 0 ||
    !Number.isFinite(value.startedAt) ||
    !Number.isFinite(value.expiresAt) ||
    !isRecord(value.answers) ||
    !Array.isArray(value.markedQuestionIds) ||
    !value.markedQuestionIds.every((id) => typeof id === "string") ||
    (value.status !== "in_progress" && value.status !== "submitted")
  ) {
    return null;
  }

  const questions = value.questions
    .map(normalizeQuestion)
    .filter((question): question is QuizQuestion => question !== null);
  if (questions.length !== value.questions.length || questions.length === 0) {
    return null;
  }

  const answers: Record<string, number> = {};
  const questionIds = new Set(questions.map((question) => question.id));
  for (const [questionId, answer] of Object.entries(value.answers)) {
    if (
      !questionIds.has(questionId) ||
      !Number.isInteger(answer) ||
      Number(answer) < 0 ||
      Number(answer) >= questions.find((question) => question.id === questionId)!.options.length
    ) {
      return null;
    }
    answers[questionId] = Number(answer);
  }

  const submitted = value.status === "submitted";
  if (
    submitted &&
    (!Number.isFinite(value.submittedAt) ||
      !Number.isInteger(value.correctCount) ||
      !Number.isFinite(value.scorePercentage))
  ) {
    return null;
  }

  return {
    id: value.id,
    quizId: value.quizId,
    quizTitle: value.quizTitle,
    studentId: value.studentId,
    questions,
    duration: Number(value.duration),
    maxAttempts: Number(value.maxAttempts),
    startedAt: Number(value.startedAt),
    expiresAt: Number(value.expiresAt),
    answers,
    markedQuestionIds: value.markedQuestionIds,
    status: value.status,
    ...(submitted
      ? {
          submittedAt: Number(value.submittedAt),
          correctCount: Number(value.correctCount),
          scorePercentage: Number(value.scorePercentage),
        }
      : {}),
  };
}

export function parseQuizAttempts(snapshot: string): QuizAttempt[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) {
      console.error("Saved quiz attempts must be stored as an array.");
      return [];
    }
    return parsed
      .map(normalizeAttempt)
      .filter((attempt): attempt is QuizAttempt => attempt !== null);
  } catch (error) {
    console.error("Failed to parse saved quiz attempts:", error);
    return [];
  }
}

export function getQuizAttemptsSnapshot(studentId: string): string {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  try {
    return window.localStorage.getItem(getStorageKey(studentId)) ?? EMPTY_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read saved quiz attempts:", error);
    return EMPTY_SNAPSHOT;
  }
}

function subscribeToAttempts(studentId: string, callback: () => void) {
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

export function useQuizAttempts(studentId: string) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribeToAttempts(studentId, callback),
    () => getQuizAttemptsSnapshot(studentId),
    () => EMPTY_SNAPSHOT,
  );
  return useMemo(() => parseQuizAttempts(snapshot), [snapshot]);
}

function writeAttempts(studentId: string, attempts: QuizAttempt[]) {
  if (typeof window === "undefined") {
    throw new Error("Quiz attempt storage is only available in the browser.");
  }
  window.localStorage.setItem(getStorageKey(studentId), JSON.stringify(attempts));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function scoreAttempt(attempt: QuizAttempt): QuizAttempt {
  const correctCount = attempt.questions.filter(
    (question) =>
      attempt.answers[question.id] === question.correctAnswer,
  ).length;
  return {
    ...attempt,
    status: "submitted",
    submittedAt: Date.now(),
    correctCount,
    scorePercentage: Math.round(
      (correctCount / attempt.questions.length) * 100,
    ),
  };
}

export function startQuizAttempt(
  studentId: string,
  quiz: ManagedQuiz,
): QuizAttempt {
  const attempts = parseQuizAttempts(getQuizAttemptsSnapshot(studentId));
  const active = attempts.find(
    (attempt) => attempt.quizId === quiz.id && attempt.status === "in_progress",
  );
  if (active && active.expiresAt > Date.now()) return active;

  const previous = attempts.map((attempt) =>
    attempt === active ? scoreAttempt(attempt) : attempt,
  );
  const usedAttempts = previous.filter((attempt) => attempt.quizId === quiz.id);
  const maxAttempts = quiz.maxAttempts ?? 1;
  if (usedAttempts.length >= maxAttempts) {
    if (active) writeAttempts(studentId, previous);
    throw new AttemptLimitError();
  }

  const startedAt = Date.now();
  const attempt: QuizAttempt = {
    id: crypto.randomUUID(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    studentId,
    questions: quiz.questions.map((question) => ({
      ...question,
      options: [...question.options],
    })),
    duration: quiz.duration,
    maxAttempts,
    startedAt,
    expiresAt: startedAt + quiz.duration * 60_000,
    answers: {},
    markedQuestionIds: [],
    status: "in_progress",
  };
  writeAttempts(studentId, [...previous, attempt]);
  return attempt;
}

export function updateQuizAttempt(
  studentId: string,
  attemptId: string,
  update: (attempt: QuizAttempt) => QuizAttempt,
): QuizAttempt {
  const attempts = parseQuizAttempts(getQuizAttemptsSnapshot(studentId));
  const index = attempts.findIndex((attempt) => attempt.id === attemptId);
  if (index < 0) throw new Error("Quiz attempt was not found.");
  const current = attempts[index];
  if (current.status !== "in_progress") {
    throw new Error("This quiz attempt has already been submitted.");
  }
  if (current.expiresAt <= Date.now()) throw new AttemptExpiredError();
  const updated = update(current);
  const next = [...attempts];
  next[index] = updated;
  writeAttempts(studentId, next);
  return updated;
}

export function submitQuizAttempt(
  studentId: string,
  attemptId: string,
): { attempt: QuizAttempt; submitted: boolean } {
  const attempts = parseQuizAttempts(getQuizAttemptsSnapshot(studentId));
  const index = attempts.findIndex((attempt) => attempt.id === attemptId);
  if (index < 0) throw new Error("Quiz attempt was not found.");
  const current = attempts[index];
  if (current.status === "submitted") {
    return { attempt: current, submitted: false };
  }
  const submitted = scoreAttempt(current);
  const next = [...attempts];
  next[index] = submitted;
  writeAttempts(studentId, next);
  return { attempt: submitted, submitted: true };
}
