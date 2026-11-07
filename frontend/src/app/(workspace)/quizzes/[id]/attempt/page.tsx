
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
  Send,
  Trophy,
} from "lucide-react";
import { saveManagedQuiz, useManagedQuizzes } from "@/lib/quiz-storage";

type Question = {
  id: string | number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const questionSets: Record<string, Question[]> = {
  "quiz-01": [
    {
      id: 1,
      question: "Which of the following best describes Machine Learning?",
      options: [
        "Programming computers using only fixed rules",
        "Enabling systems to learn patterns from data",
        "Designing physical computer components",
        "Managing database transactions",
      ],
      correctAnswer: 1,
      explanation:
        "Machine Learning enables systems to learn patterns from data and make predictions without explicitly programming every rule.",
    },
    {
      id: 2,
      question: "Which type of learning uses labeled training data?",
      options: [
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Supervised Learning",
        "Transfer Learning",
      ],
      correctAnswer: 2,
      explanation:
        "Supervised learning uses labeled examples containing inputs and their corresponding target outputs.",
    },
    {
      id: 3,
      question: "What is the primary purpose of a training dataset?",
      options: [
        "To evaluate the final model only",
        "To teach a model patterns and relationships",
        "To permanently store model predictions",
        "To replace the testing dataset",
      ],
      correctAnswer: 1,
      explanation:
        "Training data is used by the learning algorithm to estimate model parameters and discover patterns.",
    },
    {
      id: 4,
      question: "Which algorithm is commonly used for classification?",
      options: [
        "Linear Regression",
        "K-Means",
        "Logistic Regression",
        "Principal Component Analysis",
      ],
      correctAnswer: 2,
      explanation:
        "Logistic Regression is commonly used for classification tasks, particularly binary classification.",
    },
    {
      id: 5,
      question: "What does overfitting mean?",
      options: [
        "A model performs poorly on training data",
        "A model memorizes training patterns and generalizes poorly",
        "A model has too few parameters",
        "A model always produces identical predictions",
      ],
      correctAnswer: 1,
      explanation:
        "Overfitting occurs when a model fits training data too closely, including noise, and performs poorly on unseen data.",
    },
    {
      id: 6,
      question: "Which dataset is commonly used to assess performance on unseen data?",
      options: [
        "Training dataset",
        "Validation dataset only",
        "Testing dataset",
        "Augmented dataset",
      ],
      correctAnswer: 2,
      explanation:
        "A held-out test dataset estimates how well a trained model performs on unseen examples.",
    },
    {
      id: 7,
      question: "What is the purpose of feature engineering?",
      options: [
        "Creating or transforming useful input features",
        "Deleting every input variable",
        "Increasing the size of the testing dataset",
        "Replacing the learning algorithm",
      ],
      correctAnswer: 0,
      explanation:
        "Feature engineering creates or transforms variables to make useful information more accessible to a model.",
    },
    {
      id: 8,
      question: "Which metric measures the proportion of predicted positives that are actually positive?",
      options: [
        "Recall",
        "Precision",
        "Accuracy",
        "Mean Squared Error",
      ],
      correctAnswer: 1,
      explanation:
        "Precision is true positives divided by all predicted positives.",
    },
  ],
};

const quizTitles: Record<string, string> = {
  "quiz-01": "Introduction to Machine Learning",
  "quiz-02": "Database Management Systems",
  "quiz-03": "Data Structures and Algorithms",
  "quiz-04": "Software Engineering Principles",
  "quiz-05": "Computer Networks",
  "quiz-06": "Artificial Intelligence Fundamentals",
};

const quizDurations: Record<string, number> = {
  "quiz-01": 30,
  "quiz-02": 25,
  "quiz-03": 45,
  "quiz-04": 35,
  "quiz-05": 20,
  "quiz-06": 50,
};

const fallbackQuestions = questionSets["quiz-01"];

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const savedQuiz = useManagedQuizzes().find((item) => item.id === id);

  const managedQuestions = savedQuiz?.questions ?? [];
  const questions =
    savedQuiz && managedQuestions.length > 0
      ? managedQuestions
      : questionSets[id] ?? fallbackQuestions;
  const quizTitle = savedQuiz?.title ?? quizTitles[id] ?? "Academic Quiz";
  const duration = savedQuiz?.duration ?? quizDurations[id] ?? 30;
  const quizUnavailable =
    (!savedQuiz && !quizTitles[id]) ||
    (savedQuiz !== undefined && savedQuiz.status !== "Published") ||
    (savedQuiz !== undefined &&
      managedQuestions.length === 0 &&
      !quizTitles[id]);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [marked, setMarked] = useState<number[]>([]);
  const [timer, setTimer] = useState({ duration, seconds: duration * 60 });
  const secondsLeft =
    timer.duration === duration ? timer.seconds : duration * 60;
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submissionInProgress = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const submitQuiz = useCallback(() => {
    if (submitted || submissionInProgress.current || questions.length === 0) {
      return;
    }
    submissionInProgress.current = true;

    const correctCount = questions.filter(
      (question) => answers[String(question.id)] === question.correctAnswer,
    ).length;

    const totalQuestions = questions.length;

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const attemptData = {
      quizId: id,
      quizTitle,
      answers,
      questions,
      correctCount,
      incorrectCount: answeredCount - correctCount,
      unansweredCount,
      totalQuestions,
      scorePercentage,
      submittedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(
        `nexora-quiz-result-${id}`,
        JSON.stringify(attemptData),
      );
      window.dispatchEvent(new Event("nexora-quiz-result-changed"));
      setSubmissionError("");
      setSubmitted(true);
      setShowSubmitModal(false);
      if (savedQuiz) {
        try {
          saveManagedQuiz({
            ...savedQuiz,
            attempts: (savedQuiz.attempts ?? 0) + 1,
          });
        } catch (error) {
          console.error("Failed to update quiz attempt count:", error);
        }
      }
    } catch (error) {
      console.error("Failed to save quiz result:", error);
      setSubmissionError("Unable to save your result. Please try submitting again.");
      submissionInProgress.current = false;
    }
  }, [
    submitted,
    questions,
    answers,
    id,
    quizTitle,
    answeredCount,
    unansweredCount,
    savedQuiz,
  ]);

  useEffect(() => {
    if (submitted) return;
    const timerId = setTimeout(() => {
      if (secondsLeft <= 1) {
        submitQuiz();
      } else {
        setTimer({ duration, seconds: secondsLeft - 1 });
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [submitted, secondsLeft, duration, submitQuiz]);

  // Keyboard navigation
  useEffect(() => {
    if (submitted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (showSubmitModal) return;

      if (event.key === "ArrowRight") {
        setCurrentQuestion((q) => Math.min(q + 1, questions.length - 1));
      }

      if (event.key === "ArrowLeft") {
        setCurrentQuestion((q) => Math.max(q - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitted, showSubmitModal, questions.length]);

  const selectAnswer = (optionIndex: number) => {
    const questionId = questions[currentQuestion]?.id;
    if (questionId === undefined) return;
    setAnswers((previous) => ({
      ...previous,
      [String(questionId)]: optionIndex,
    }));
  };

  const toggleMark = () => {
    setMarked((previous) =>
      previous.includes(currentQuestion)
        ? previous.filter((q) => q !== currentQuestion)
        : [...previous, currentQuestion]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const score = questions.reduce(
    (total, question) =>
      total +
      (answers[String(question.id)] === question.correctAnswer ? 1 : 0),
    0
  );

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  if (quizUnavailable) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-white">Quiz unavailable</h1>
        <p className="mt-3 text-slate-400">
          This quiz has not been published or does not contain any questions.
        </p>
        <button
          onClick={() => router.push("/quizzes")}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Back to Quiz Center
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-b from-[#171D35] to-[#11162A] p-5 text-center shadow-xl shadow-violet-950/10 sm:p-8 lg:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
            <Trophy size={36} />
          </div>

          <p className="mt-6 text-sm font-medium text-violet-300">
            QUIZ COMPLETED
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Your Results
          </h1>
          <p className="mt-3 text-slate-400">{quizTitle}</p>

          <div className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-violet-500/30 bg-violet-500/5">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
            <span className="mt-1 text-xs text-slate-400">Your Score</span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            <ResultStat label="Correct" value={`${score}`} />
            <ResultStat label="Incorrect" value={`${answeredCount - score}`} />
            <ResultStat label="Unanswered" value={`${unansweredCount}`} />
          </div>

          <p className="mt-8 text-sm text-slate-400">
            You answered {answeredCount} of {questions.length} questions.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/quizzes")}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Back to Quiz Center
            </button>
            <button
              onClick={() => router.push(`/quizzes/${id}/review`)}
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
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-5 px-4 pb-8 pt-5 sm:space-y-6 sm:px-6 sm:pb-10 sm:pt-6 lg:px-10 xl:px-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Exit Quiz
        </Link>

        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 shadow-sm shadow-black/10 sm:px-4 ${
            secondsLeft <= 300
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-violet-500/20 bg-violet-500/10 text-violet-300"
          }`}
        >
          <Clock size={17} />
          <span className="font-mono text-sm font-semibold tabular-nums">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Quiz Title & Progress */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-medium text-violet-300">QUIZ IN PROGRESS</p>
            <h1 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              {quizTitle}
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
      </div>

      {submissionError && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300"
        >
          {submissionError}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Question Area */}
        <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              Question {currentQuestion + 1}
            </span>
            <button
              onClick={toggleMark}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                marked.includes(currentQuestion)
                  ? "bg-amber-500/10 text-amber-300"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Flag size={14} />
              {marked.includes(currentQuestion) ? "Marked for review" : "Mark for review"}
            </button>
          </div>

          <h2 className="mt-5 text-lg font-medium leading-8 text-white sm:mt-6 sm:text-xl">
            {question.question}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select one answer.
          </p>

          <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
            {question.options.map((option, index) => {
              const selected = answers[String(question.id)] === index;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
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
                  <span className={`text-sm leading-6 ${selected ? "text-white" : "text-slate-300"}`}>
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

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5 sm:mt-8 sm:pt-6">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((q) => q - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Submit Quiz
                <Send size={15} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((q) => q + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Next Question
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>

        {/* Question Palette */}
        <aside className="h-fit min-w-0 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 shadow-lg shadow-black/10 sm:p-5">
          <h3 className="text-sm font-semibold text-white">Question Navigator</h3>
          <p className="mt-1 text-xs text-slate-500">
            Select a question to navigate.
          </p>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[String(questions[index].id)] !== undefined;
              const isMarked = marked.includes(index);
              const isCurrent = currentQuestion === index;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  title={`Question ${index + 1}`}
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
              <span className="font-medium text-amber-300">{marked.length}</span>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
          >
            <Send size={15} />
            Submit Quiz
          </button>
        </aside>
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11162A] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <AlertCircle size={24} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">
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
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04]"
              >
                Continue Quiz
              </button>
              <button
                onClick={submitQuiz}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Confirm Submit
              </button>
            </div>
          </div>
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
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
