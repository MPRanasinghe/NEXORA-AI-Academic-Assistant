
"use client";

import { useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  saveManagedQuiz,
  useDeletedQuizIds,
  useManagedQuizzes,
  type ManagedQuiz,
  type QuizQuestion,
} from "@/lib/quiz-storage";
import { getQuizById } from "@/lib/quiz-catalog";

type Question = QuizQuestion;

const createQuestion = (): Question => ({
  id: crypto.randomUUID(),
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
});

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isClientReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const managedQuizzes = useManagedQuizzes();
  const deletedQuizIds = useDeletedQuizIds();
  const storedQuiz = getQuizById(id, managedQuizzes, deletedQuizIds);

  const [saving, setSaving] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState<ManagedQuiz | null>(null);
  const quiz = editedQuiz ?? storedQuiz;

  const updateQuizField = (
    field: keyof ManagedQuiz,
    value: string | number
  ) => {
    setEditedQuiz((current) => {
      const base = current ?? storedQuiz;
      return base ? { ...base, [field]: value } : null;
    });
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Question,
    value: string | number | string[]
  ) => {
    setEditedQuiz((current) => {
      const base = current ?? storedQuiz;
      if (!base) return null;

      return {
        ...base,
        questions: base.questions.map((question) =>
          question.id === questionId
            ? { ...question, [field]: value }
            : question
        ),
      };
    });
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setEditedQuiz((current) => {
      const base = current ?? storedQuiz;
      if (!base) return null;

      return {
        ...base,
        questions: base.questions.map((question) => {
          if (question.id !== questionId) return question;

          const options = [...question.options];
          options[optionIndex] = value;

          return { ...question, options };
        }),
      };
    });
  };

  const addQuestion = () => {
    setEditedQuiz((current) => {
      const base = current ?? storedQuiz;
      return base
        ? { ...base, questions: [...base.questions, createQuestion()] }
        : null;
    });
  };

  const removeQuestion = (questionId: string) => {
    setEditedQuiz((current) => {
      const base = current ?? storedQuiz;
      return base
        ? {
            ...base,
            questions: base.questions.filter(
              (question) => question.id !== questionId,
            ),
          }
        : null;
    });
  };

  const saveQuiz = (status: "Draft" | "Published") => {
    if (!quiz) return;

    if (!quiz.title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    if (quiz.questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    const incomplete = quiz.questions.some(
      (question) =>
        !question.question.trim() ||
        question.options.some((option) => !option.trim()) ||
        !question.explanation.trim()
    );

    if (incomplete) {
      alert("Please complete all questions, answer options, and explanations.");
      return;
    }

    setSaving(true);

    try {
      const updatedQuiz: ManagedQuiz = {
        ...quiz,
        status,
        questionCount: quiz.questions.length,
      };

      saveManagedQuiz(updatedQuiz);

      setEditedQuiz(updatedQuiz);

      alert(
        status === "Published"
          ? "Quiz published successfully!"
          : "Changes saved successfully!"
      );

      router.push("/quiz-management");
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Unable to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isClientReady) {
    return (
      <main className="min-h-screen bg-[#080B18] p-8 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 py-24 text-[#94A3B8]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading quiz...
        </div>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="min-h-screen bg-[#080B18] p-8 text-white">
        <div className="mx-auto max-w-4xl py-24 text-center">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <p className="mt-3 text-[#94A3B8]">
            This quiz may have been deleted or not saved.
          </p>
          <button
            onClick={() => router.push("/quiz-management")}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Back to Quiz Management
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080B18] px-4 py-8 text-[#F8FAFC] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div>
          <button
            onClick={() => router.push("/quiz-management")}
            className="mb-5 flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Management
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-violet-400">
                ACADEMIC STAFF WORKSPACE
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Edit Quiz
              </h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Update quiz details, questions, and publishing status.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                quiz.status === "Published"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {quiz.status}
            </span>
          </div>
        </div>

        {/* Quiz Details */}
        <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Quiz Details</h2>

          <div className="space-y-2">
            <label className="text-sm text-[#94A3B8]">Quiz Title</label>
            <input
              value={quiz.title}
              onChange={(e) => updateQuizField("title", e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-3 text-sm outline-none focus:border-violet-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#94A3B8]">Description</label>
            <textarea
              value={quiz.description || ""}
              onChange={(e) =>
                updateQuizField("description", e.target.value)
              }
              rows={3}
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-3 text-sm outline-none focus:border-violet-500"
              placeholder="Describe this quiz..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <input
                value={quiz.subject}
                onChange={(e) =>
                  updateQuizField("subject", e.target.value)
                }
                className="input-style"
                placeholder="Subject"
              />
            </Field>

            <Field label="Difficulty">
              <select
                value={quiz.difficulty || "Medium"}
                onChange={(e) =>
                  updateQuizField("difficulty", e.target.value)
                }
                className="input-style"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </Field>

            <Field label="Duration (minutes)">
              <input
                type="number"
                min={1}
                value={quiz.duration}
                onChange={(e) =>
                  updateQuizField("duration", Number(e.target.value))
                }
                className="input-style"
              />
            </Field>
          </div>
        </section>

        {/* Questions */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Questions</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                {quiz.questions.length} question(s)
              </p>
            </div>

            <button
              onClick={addQuestion}
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>

          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Question {index + 1}
                </h3>

                <button
                  onClick={() => removeQuestion(question.id)}
                  title="Remove question"
                  className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <textarea
                value={question.question}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "question",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-3 text-sm outline-none focus:border-violet-500"
                placeholder="Enter your question..."
              />

              <div className="space-y-3">
                <label className="text-sm text-[#94A3B8]">
                  Answer Options
                </label>

                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${
                      question.correctAnswer === optionIndex
                        ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                        : "border-white/[0.08] bg-[#080B18]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          optionIndex
                        )
                      }
                      className="accent-emerald-500"
                    />

                    <span className="w-6 text-xs text-[#64748B]">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>

                    <input
                      value={option}
                      onChange={(e) =>
                        updateOption(
                          question.id,
                          optionIndex,
                          e.target.value
                        )
                      }
                      className="flex-1 bg-transparent text-sm outline-none"
                      placeholder={`Option ${optionIndex + 1}`}
                    />

                    {question.correctAnswer === optionIndex && (
                      <span className="text-xs text-emerald-400">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#94A3B8]">
                  Explanation
                </label>
                <textarea
                  value={question.explanation || ""}
                  onChange={(e) =>
                    updateQuestion(
                      question.id,
                      "explanation",
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="Explain why this answer is correct..."
                />
              </div>
            </div>
          ))}

          {quiz.questions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/[0.12] p-12 text-center">
              <p className="text-sm text-[#94A3B8]">
                No questions yet. Add your first question above.
              </p>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
          <button
            onClick={() => saveQuiz("Draft")}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-5 py-3 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/[0.04] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>

          <button
            onClick={() => saveQuiz("Published")}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {saving ? "Saving..." : "Save & Publish"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #080b18;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-style:focus {
          border-color: #8b5cf6;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-[#94A3B8]">{label}</label>
      {children}
    </div>
  );
}
