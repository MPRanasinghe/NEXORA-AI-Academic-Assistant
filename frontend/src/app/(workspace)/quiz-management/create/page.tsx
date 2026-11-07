
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  saveManagedQuiz,
  type ManagedQuiz,
  type QuizQuestion,
} from "@/lib/quiz-storage";

type Question = QuizQuestion;

const createQuestion = (id: string): Question => ({
  id,
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
});

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [duration, setDuration] = useState("20");
  const [questions, setQuestions] = useState<Question[]>([
    createQuestion("initial-question"),
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateQuestion = (
    id: string,
    updates: Partial<Question>
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id
          ? { ...question, ...updates }
          : question
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const validateQuiz = () => {
    if (!title.trim()) return "Please enter a quiz title.";
    if (!subject.trim()) return "Please enter a subject.";
    if (!description.trim()) return "Please enter a description.";

    if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) {
      return "Please enter a valid quiz duration.";
    }

    if (questions.length === 0) {
      return "Please add at least one question.";
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];

      if (!question.question.trim()) {
        return `Please complete Question ${index + 1}.`;
      }

      if (question.options.some((option) => !option.trim())) {
        return `Please complete all four options in Question ${index + 1}.`;
      }

      if (!question.explanation.trim()) {
        return `Please add an explanation for Question ${index + 1}.`;
      }
    }

    return "";
  };

  const saveQuiz = (status: "Draft" | "Published") => {
    setError("");
    setSuccess("");

    const validationError = validateQuiz();

    if (validationError) {
      setError(validationError);
      return;
    }

    const quiz: ManagedQuiz = {
      id: crypto.randomUUID(),
      title,
      description,
      subject,
      difficulty,
      duration: Number(duration),
      questions,
      questionCount: questions.length,
      status,
      createdAt: new Date().toISOString(),
    };

    try {
      saveManagedQuiz(quiz);

      setSuccess(
        status === "Published"
          ? "Quiz published successfully!"
          : "Quiz saved as draft!"
      );

      setTimeout(() => {
        router.push("/quiz-management");
      }, 800);
    } catch {
      setError("Unable to save quiz. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#080B18] px-4 py-8 text-[#F8FAFC] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/quiz-management")}
            className="flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Management
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-violet-400">
                ASSESSMENT BUILDER
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Create New Quiz
              </h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Build an assessment and add your questions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-4 py-3 text-sm text-[#94A3B8]">
              <FileText className="h-4 w-4 text-violet-400" />
              {questions.length} Questions
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <section className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold">Quiz Information</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Configure the basic details of your assessment.
            </p>
          </div>

          <div className="space-y-5">
            <Field label="Quiz Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Machine Learning"
                className="field-input"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn or assess..."
                rows={3}
                className="field-input resize-y"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Subject">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="field-input"
                />
              </Field>

              <Field label="Difficulty">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="field-input"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </Field>
            </div>

            <Field label="Duration (minutes)">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="field-input pl-10"
                />
              </div>
            </Field>
          </div>
        </section>

        {/* Question Builder */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Question Builder</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Create multiple-choice questions and set the correct answers.
              </p>
            </div>

            <button
              onClick={() =>
                setQuestions((current) => [
                  ...current,
                  createQuestion(crypto.randomUUID()),
                ])
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>

          {questions.map((question, questionIndex) => (
            <section
              key={question.id}
              className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-400">
                    {questionIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">Question {questionIndex + 1}</h3>
                    <p className="text-xs text-[#64748B]">
                      Multiple Choice
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setQuestions((current) =>
                      current.filter((item) => item.id !== question.id)
                    )
                  }
                  disabled={questions.length === 1}
                  title="Remove question"
                  className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Field label="Question">
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      question: e.target.value,
                    })
                  }
                  placeholder="Enter your question..."
                  rows={3}
                  className="field-input resize-y"
                />
              </Field>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#CBD5E1]">
                  Answer Options
                </p>

                {question.options.map((option, optionIndex) => {
                  const isCorrect = question.correctAnswer === optionIndex;

                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                          : "border-white/[0.08] bg-[#080B18]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(question.id, {
                            correctAnswer: optionIndex,
                          })
                        }
                        title="Set as correct answer"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition ${
                          isCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-white/[0.05] text-[#94A3B8] hover:bg-white/[0.1]"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + optionIndex)
                        )}
                      </button>

                      <input
                        value={option}
                        onChange={(e) =>
                          updateOption(
                            question.id,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#64748B]"
                      />

                      {isCorrect && (
                        <span className="hidden text-xs text-emerald-400 sm:block">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}

                <p className="text-xs text-[#64748B]">
                  Select the option letter to mark it as the correct answer.
                </p>
              </div>

              <Field label="Answer Explanation">
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      explanation: e.target.value,
                    })
                  }
                  placeholder="Explain why the selected answer is correct..."
                  rows={2}
                  className="field-input resize-y"
                />
              </Field>
            </section>
          ))}
        </section>

        {/* Messages */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
          <button
            onClick={() => router.push("/quiz-management")}
            className="rounded-xl border border-white/[0.1] px-5 py-3 text-sm text-[#CBD5E1] transition hover:bg-white/[0.05]"
          >
            Cancel
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => saveQuiz("Draft")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-5 py-3 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/[0.05]"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </button>

            <button
              onClick={() => saveQuiz("Published")}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Upload className="h-4 w-4" />
              Publish Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Local input styles */}
      <style jsx>{`
        .field-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #080b18;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #f8fafc;
          outline: none;
          transition: border-color 0.2s;
        }

        .field-input::placeholder {
          color: #64748b;
        }

        .field-input:focus {
          border-color: #8b5cf6;
        }

        .field-input option {
          background: #11162a;
          color: #f8fafc;
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
      <label className="block text-sm font-medium text-[#CBD5E1]">
        {label}
      </label>
      {children}
    </div>
  );
}
