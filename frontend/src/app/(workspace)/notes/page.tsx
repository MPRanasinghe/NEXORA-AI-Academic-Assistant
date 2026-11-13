"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  NotebookPen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import StudentRouteGuard from "@/components/layout/StudentRouteGuard";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import {
  deleteStudentNote,
  saveStudentNote,
  useStudentNotes,
  type StudentNote,
} from "@/lib/student-notes";

type NoteDraft = {
  id: string;
  title: string;
  content: string;
  courseId: string;
};

function createDraft(): NoteDraft {
  return { id: crypto.randomUUID(), title: "", content: "", courseId: "" };
}

export default function NotesPage() {
  const { record } = useStudentAcademicRecord();
  const notes = useStudentNotes(record.studentId);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<NoteDraft | null>(null);
  const [error, setError] = useState("");

  const courseList = useMemo(
    () =>
      record.terms.flatMap((term) =>
        term.courses.map((course) => ({
          id: course.id,
          label: `${course.courseCode} · ${course.courseTitle}`,
        })),
      ),
    [record.terms],
  );

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return notes.filter((note) => {
      const course = courseList.find((item) => item.id === note.courseId);
      return (
        !normalizedQuery ||
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery) ||
        course?.label.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [courseList, notes, query]);

  const openNote = (note?: StudentNote) => {
    setError("");
    setDraft(
      note
        ? {
            id: note.id,
            title: note.title,
            content: note.content,
            courseId: note.courseId ?? "",
          }
        : createDraft(),
    );
  };

  const saveDraft = () => {
    if (!draft) return;
    try {
      saveStudentNote(record.studentId, {
        id: draft.id,
        title: draft.title,
        content: draft.content,
        ...(draft.courseId ? { courseId: draft.courseId } : {}),
        updatedAt: Date.now(),
      });
      setDraft(null);
      setError("");
    } catch (saveError) {
      console.error("Failed to save student note:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this note. Please try again.",
      );
    }
  };

  const removeNote = (noteId: string) => {
    try {
      deleteStudentNote(record.studentId, noteId);
      if (draft?.id === noteId) setDraft(null);
      setError("");
    } catch (deleteError) {
      console.error("Failed to delete student note:", deleteError);
      setError("Unable to delete this note. Please try again.");
    }
  };

  return (
    <StudentRouteGuard>
      <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              <NotebookPen size={14} />
              Student workspace
            </div>
            <h1 className="text-2xl font-semibold sm:text-3xl">My Notes</h1>
            <p className="mt-2 text-sm text-slate-400">
              Create and search private study notes for your demo student profile.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openNote()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Plus size={17} />
            New note
          </button>
        </header>

        <p className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] px-4 py-3 text-xs leading-5 text-cyan-100/70">
          Notes are stored in this browser&apos;s localStorage and are not
          synchronized or backed up. Do not store sensitive information here.
        </p>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="space-y-4">
            <label className="relative block">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes..."
                aria-label="Search notes"
                className="w-full rounded-xl border border-white/[0.08] bg-[#11162A] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-violet-400/40"
              />
            </label>

            {filteredNotes.length ? (
              <div className="space-y-3">
                {filteredNotes.map((note) => {
                  const course = courseList.find(
                    (item) => item.id === note.courseId,
                  );
                  return (
                    <article
                      key={note.id}
                      className={`rounded-2xl border bg-[#11162A] p-4 transition ${
                        draft?.id === note.id
                          ? "border-violet-400/30"
                          : "border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openNote(note)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start gap-3">
                          <FileText
                            size={17}
                            className="mt-0.5 shrink-0 text-violet-300"
                          />
                          <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-semibold text-white">
                              {note.title}
                            </h2>
                            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">
                              {note.content}
                            </p>
                            <p className="mt-3 text-[10px] text-slate-500">
                              {course?.label ?? "General note"} · Updated{" "}
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNote(note.id)}
                        aria-label={`Delete ${note.title}`}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center">
                <NotebookPen size={26} className="mx-auto text-slate-500" />
                <p className="mt-3 text-sm font-medium text-white">
                  {notes.length ? "No notes match your search" : "No notes yet"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {notes.length
                    ? "Try a different title, topic, or course."
                    : "Create a note to keep study material organized."}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-6">
            {draft ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-white">
                    {notes.some((note) => note.id === draft.id)
                      ? "Edit note"
                      : "New note"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(null);
                      setError("");
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <label className="block space-y-2 text-xs text-slate-400">
                  Title
                  <input
                    value={draft.title}
                    onChange={(event) =>
                      setDraft({ ...draft, title: event.target.value })
                    }
                    maxLength={120}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-3 text-sm text-white outline-none focus:border-violet-400/40"
                    placeholder="Note title"
                  />
                </label>
                <label className="block space-y-2 text-xs text-slate-400">
                  Course
                  <select
                    value={draft.courseId}
                    onChange={(event) =>
                      setDraft({ ...draft, courseId: event.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-3 text-sm text-white outline-none focus:border-violet-400/40"
                  >
                    <option value="">General note</option>
                    {courseList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 text-xs text-slate-400">
                  Content
                  <textarea
                    value={draft.content}
                    onChange={(event) =>
                      setDraft({ ...draft, content: event.target.value })
                    }
                    rows={12}
                    className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-violet-400/40"
                    placeholder="Write your study notes..."
                  />
                </label>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Save note
                </button>
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <FileText size={28} className="text-violet-300" />
                <p className="mt-4 font-medium text-white">Select a note</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                  Open an existing note to edit it, or create a new study note.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </StudentRouteGuard>
  );
}
