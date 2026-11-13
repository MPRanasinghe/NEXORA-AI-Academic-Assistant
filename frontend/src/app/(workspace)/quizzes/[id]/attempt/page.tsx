"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  Send,
  Trophy,
} from "lucide-react";
import { getQuizById } from "@/lib/quiz-catalog";
import {
  AttemptExpiredError,
  submitQuizAttempt,
  updateQuizAttempt,
  useQuizAttempts,
} from "@/lib/quiz-attempt-storage";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import {
  saveManagedQuiz,
  useDeletedQuizIds,
  useManagedQuizzes,
} from "@/lib/quiz-storage";

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const attemptId = searchParams.get("attemptId");
  const managedQuizzes = useManagedQuizzes();
  const deletedQuizIds = useDeletedQuizIds();
  const quiz = getQuizById(id, managedQuizzes, deletedQuizIds);
  const { record } = useStudentAcademicRecord();
  const attempts = useQuizAttempts(record.studentId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [now, setNow] = useState<number | null>(null);
  const submissionInProgress = useRef(false);
  const attempt =
    attempts.find(
      (item) => item.id === attemptId && item.quizId === id,
    ) ?? null;
  const questions = attempt?.questions ?? [];
  const answers = attempt?.answers ?? {};
  const markedQuestionIds = attempt?.markedQuestionIds ?? [];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const secondsLeft =
    attempt && now !== null
      ? Math.max(0, Math.ceil((attempt.expiresAt - now) / 1000))
      : null;

  const submitQuiz = useCallback(() => {
    if (!attemptId || submissionInProgress.current) return;
    submissionInProgress.current = true;
    try {
      const result = submitQuizAttempt(record.studentId, attemptId);
      setSubmissionError("");
      setShowSubmitModal(false);
      setNow(Date.now());
      if (result.submitted && quiz) {
        try {
          saveManagedQuiz({
            ...quiz,
            attempts: (quiz.attempts ?? 0) + 1,
          });
        } catch (error) {
          console.error("Failed to update quiz attempt count:", error);
        }
      }
    } catch (error) {
      console.error("Failed to submit quiz attempt:", error);
      setSubmissionError(
        "Unable to save your result. Your answers are still available; please try submitting again.",
      );
    } finally {
      submissionInProgress.current = false;
    }
  }, [
    attemptId,
    quiz,
    record.studentId,
  ]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") return;
    const timerId = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (attempt.expiresAt <= currentTime) submitQuiz();
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [attempt, submitQuiz]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showSubmitModal) return;
      if (event.key === "ArrowRight") {
        setCurrentQuestion((current) =>
          Math.min(current + 1, questions.length - 1),
        );
      }
      if (event.key === "ArrowLeft") {
        setCurrentQuestion((current) => Math.max(current - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attempt, questions.length, showSubmitModal]);

  const updateAnswer = (optionIndex: number) => {
    if (!attempt || !questions[currentQuestion]) return;
    try {
      updateQuizAttempt(record.studentId, attempt.id, (current) => ({
        ...current,
        answers: {
          ...current.answers,
          [questions[currentQuestion].id]: optionIndex,
        },
      }));
      setSubmissionError("");
    } catch (error) {
      if (error instanceof AttemptExpiredError) {
        submitQuiz();
      } else {
        console.error("Failed to save quiz answer:", error);
        setSubmissionError("Unable to save your answer. Please try again.");
      }
    }
  };

  const toggleMark = () => {
    if (!attempt || !questions[currentQuestion]) return;
    const questionId = questions[currentQuestion].id;
    try {
      updateQuizAttempt(record.studentId, attempt.id, (current) => ({
        ...current,
        markedQuestionIds: current.markedQuestionIds.includes(questionId)
          ? current.markedQuestionIds.filter((idValue) => idValue !== questionId)
          : [...current.markedQuestionIds, questionId],
      }));
    } catch (error) {
      if (error instanceof AttemptExpiredError) {
        submitQuiz();
      } else {
        console.error("Failed to update marked questions:", error);
        setSubmissionError("Unable to update the review marker. Please retry.");
      }
    }
  };

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (!attempt) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <AlertCircle size={40} className="text-violet-400" />
        <h1 className="mt-5 text-2xl font-semibold text-white">
          Attempt not found
        </h1>
        <p className="mt-3 text-slate-400">
          Start or continue the quiz from its instructions page to open a saved
          attempt.
        </p>
        <Link
          href={`/quizzes/${id}`}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Return to Quiz Instructions
        </Link>
      </div>
    );
  }

  if (attempt.status === "submitted") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#171D35] to-[#11162A] p-5 text-center shadow-xl shadow-violet-950/10 sm:p-8 lg:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
            <Trophy size={36} />
          </div>
          <p className="mt-6 text-sm font-medium text-violet-300">
            QUIZ COMPLETED
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your Results</h1>
          <p className="mt-3 text-slate-400">{attempt.quizTitle}</p>
          <div className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-violet-500/30 bg-violet-500/5">
            <span className="text-4xl font-bold text-white">
              {attempt.scorePercentage ?? 0}%
            </span>
            <span className="mt-1 text-xs text-slate-400">Practice score</span>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            <ResultStat
              label="Correct"
              value={String(attempt.correctCount ?? 0)}
            />
            <ResultStat
              label="Incorrect"
              value={String(answeredCount - (attempt.correctCount ?? 0))}
            />
            <ResultStat label="Unanswered" value={String(unansweredCount)} />
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Practice results are separate from official academic grades.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/quizzes")}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Back to Quiz Center
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/quizzes/${id}/review?attemptId=${encodeURIComponent(attempt.id)}`,
                )
              }
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center text-slate-300">
        No valid questions are available in this attempt.
      </div>
    );
  }
  const progress = (answeredCount / questions.length) * 100;
  const marked = (questionId: string) =>
    markedQuestionIds.includes(questionId);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5 px-4 pb-8 pt-5 sm:space-y-6 sm:px-6 sm:pb-10 sm:pt-6 lg:px-10 xl:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Exit Quiz
        </Link>
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
            (secondsLeft !== null && secondsLeft <= 300)
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-violet-500/20 bg-violet-500/10 text-violet-300"
          }`}
          aria-live="polite"
        >
          <Clock size={17} />
          <span className="font-mono text-sm font-semibold tabular-nums">
            {secondsLeft === null ? "--:--" : formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-medium text-violet-300">QUIZ IN PROGRESS</p>
            <h1 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              {attempt.quizTitle}
            </h1>
          </div>
          <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{answeredCount} answered</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </section>

      {submissionError && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300"
        >
          {submissionError}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              Question {currentQuestion + 1}
            </span>
            <button
              type="button"
              onClick={toggleMark}
              aria-pressed={marked(question.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                marked(question.id)
                  ? "bg-amber-500/10 text-amber-300"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Flag size={14} />
              {marked(question.id) ? "Marked for review" : "Mark for review"}
            </button>
          </div>
          <h2 className="mt-5 text-lg font-medium leading-8 text-white sm:mt-6 sm:text-xl">
            {question.question}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Select one answer.</p>
          <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
            {question.options.map((option, index) => {
              const selected = answers[question.id] === index;
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => updateAnswer(index)}
                  aria-pressed={selected}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-xl border p-3.5 text-left transition sm:gap-4 sm:p-4 ${
                    selected
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${
                      selected
                        ? "bg-violet-600 text-white"
                        : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={`text-sm leading-6 ${
                      selected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {option}
                  </span>
                  <span className="ml-auto">
                    {selected ? (
                      <CheckCircle2 size={18} className="text-violet-300" />
                    ) : (
                      <Circle size={18} className="text-slate-600" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5 sm:mt-8 sm:pt-6">
            <button
              type="button"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((current) => current - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-30"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Submit Quiz
                <Send size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentQuestion((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Next Question
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>

        <aside className="h-fit min-w-0 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-5">
          <h3 className="text-sm font-semibold text-white">Question Navigator</h3>
          <p className="mt-1 text-xs text-slate-500">
            Select a question to navigate.
          </p>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((item, index) => {
              const isAnswered = answers[item.id] !== undefined;
              const isMarked = marked(item.id);
              const isCurrent = currentQuestion === index;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCurrentQuestion(index)}
                  title={`Question ${index + 1}`}
                  aria-label={`Go to question ${index + 1}${isAnswered ? ", answered" : ""}${isMarked ? ", marked for review" : ""}`}
                  className={`relative flex h-10 items-center justify-center rounded-lg text-xs font-medium transition ${
                    isCurrent
                      ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-[#11162A]"
                      : ""
                  } ${
                    isAnswered
                      ? "bg-violet-600 text-white"
                      : "border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08]"
                  }`}
                >
                  {index + 1}
                  {isMarked && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[#11162A] bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 space-y-2 border-t border-white/[0.07] pt-4">
            <Legend color="bg-violet-600" label="Answered" />
            <Legend color="bg-white/[0.08]" label="Unanswered" />
            <Legend color="bg-amber-400" label="Marked for review" />
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Answered</span>
              <span className="font-medium text-white">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-400">Remaining</span>
              <span className="font-medium text-white">{unansweredCount}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-400">Marked</span>
              <span className="font-medium text-amber-300">
                {markedQuestionIds.length}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
          >
            <Send size={15} />
            Submit Quiz
          </button>
        </aside>
      </div>

      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSubmitModal(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-quiz-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11162A] p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <AlertCircle size={24} />
            </div>
            <h2 id="submit-quiz-title" className="mt-5 text-xl font-semibold text-white">
              Submit your quiz?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              You have answered {answeredCount} out of {questions.length} questions.
              {unansweredCount > 0
                ? ` ${unansweredCount} question(s) remain unanswered.`
                : " All questions have been answered."}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              You cannot change your answers after submission.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04]"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                onClick={submitQuiz}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Confirm Submit
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
