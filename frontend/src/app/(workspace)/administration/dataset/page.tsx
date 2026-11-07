"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpenCheck,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Download,
  Upload,
  CheckCircle2,
  ChevronRight,
  Info,
  X,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  useAdminDataset,
  GroundTruthEntry,
} from "@/lib/rag-admin-storage";

export default function GroundTruthDatasetPage() {
  const { dataset, addEntry, updateEntry, removeEntry } = useAdminDataset();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingEntry, setEditingEntry] = useState<GroundTruthEntry | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [formQuestion, setFormQuestion] = useState("");
  const [formExpectedAnswer, setFormExpectedAnswer] = useState("");
  const [formContext, setFormContext] = useState("");
  const [formCategory, setFormCategory] = useState<GroundTruthEntry["category"]>("Academic Regulations");
  const [formDifficulty, setFormDifficulty] = useState<GroundTruthEntry["difficulty"]>("Standard");

  const filteredDataset = useMemo(() => {
    return dataset.filter((entry) => {
      const matchSearch =
        entry.question.toLowerCase().includes(search.toLowerCase()) ||
        entry.expectedAnswer.toLowerCase().includes(search.toLowerCase()) ||
        entry.id.toLowerCase().includes(search.toLowerCase());

      const matchCat =
        selectedCategory === "All" || entry.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [dataset, search, selectedCategory]);

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexora_rag_ground_truth_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEntry) {
      updateEntry(editingEntry.id, {
        question: formQuestion,
        expectedAnswer: formExpectedAnswer,
        referenceContext: formContext,
        category: formCategory,
        difficulty: formDifficulty,
      });
      setEditingEntry(null);
    } else {
      const newEntry: GroundTruthEntry = {
        id: `gt-${String(dataset.length + 1).padStart(3, "0")}`,
        question: formQuestion,
        expectedAnswer: formExpectedAnswer,
        referenceContext: formContext,
        relevantDocIds: ["doc-01"],
        category: formCategory,
        difficulty: formDifficulty,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addEntry(newEntry);
      setIsAddModalOpen(false);
    }

    setFormQuestion("");
    setFormExpectedAnswer("");
    setFormContext("");
  };

  const openEditModal = (entry: GroundTruthEntry) => {
    setEditingEntry(entry);
    setFormQuestion(entry.question);
    setFormExpectedAnswer(entry.expectedAnswer);
    setFormContext(entry.referenceContext);
    setFormCategory(entry.category);
    setFormDifficulty(entry.difficulty);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Ground Truth Benchmark Dataset"
        subtitle="Manage peer-verified university regulatory Q&A pairs and authoritative context clauses for empirical RAG evaluation"
        badge="Empirical Ground Truth"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Ground Truth Dataset" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]"
              title="Export dataset to JSON file"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                setFormQuestion("");
                setFormExpectedAnswer("");
                setFormContext("");
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
            >
              <Plus size={14} />
              <span>Add Ground-Truth Entry</span>
            </button>
          </div>
        }
      />

      {/* Dataset Overview Cards */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions, expected answers, or entry IDs..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Categories</option>
            <option value="Academic Regulations">Academic Regulations</option>
            <option value="Prerequisite Logic">Prerequisite Logic</option>
            <option value="Administrative Regulation">Administrative Regulation</option>
            <option value="Degree Clearance">Degree Clearance</option>
            <option value="Policy Interpretation">Policy Interpretation</option>
          </select>
        </div>
      </div>

      {/* Dataset Entries List */}
      <div className="space-y-4">
        {filteredDataset.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 transition hover:border-violet-500/30"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-violet-300">
                    {entry.id}
                  </span>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[11px] text-slate-400">
                    {entry.category}
                  </span>
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                    {entry.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-500">Created {entry.createdAt}</span>
                </div>

                <h3 className="mt-2.5 text-sm font-bold text-white">
                  {entry.question}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(entry)}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 text-slate-400 hover:text-white"
                  title="Edit entry"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 text-slate-400 hover:text-red-400"
                  title="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Expected Answer */}
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Expected Gold-Standard Answer
                </p>
                <p className="mt-1.5 leading-relaxed text-slate-200">
                  {entry.expectedAnswer}
                </p>
              </div>

              {/* Reference Context */}
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Authoritative Policy Context (Clause)
                </p>
                <p className="mt-1.5 leading-relaxed text-slate-300 font-mono text-[11px]">
                  {entry.referenceContext}
                </p>
              </div>
            </div>

            {/* Scores summary if evaluated */}
            {entry.lastScores && (
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/[0.04] pt-3 text-xs">
                <span className="text-[11px] text-slate-500">Latest Benchmark:</span>
                <span className="font-mono text-cyan-300">
                  Context Rel: {(entry.lastScores.contextRelevance * 100).toFixed(0)}%
                </span>
                <span className="font-mono text-emerald-400">
                  Groundedness: {(entry.lastScores.groundedness * 100).toFixed(0)}%
                </span>
                <span className="font-mono text-violet-300">
                  Answer Rel: {(entry.lastScores.answerRelevance * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Entry Modal */}
      {(isAddModalOpen || editingEntry) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingEntry(null);
          }}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingEntry ? "Edit Ground Truth Entry" : "Add Ground Truth Evaluation Entry"}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Define an academic regulatory question, gold-standard answer, and authoritative source context clause
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEntry(null);
                }}
                className="rounded-lg p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Student/Staff Academic Question
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Under what conditions is academic probation cleared?"
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Gold-Standard Expected Answer
                </label>
                <textarea
                  required
                  rows={3}
                  value={formExpectedAnswer}
                  onChange={(e) => setFormExpectedAnswer(e.target.value)}
                  placeholder="Exact factual answer according to university senate rules..."
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Authoritative Reference Context (Section Clause)
                </label>
                <textarea
                  required
                  rows={2}
                  value={formContext}
                  onChange={(e) => setFormContext(e.target.value)}
                  placeholder="Verbatim text from university handbook or regulations..."
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GroundTruthEntry["category"])}
                    className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                  >
                    <option value="Academic Regulations">Academic Regulations</option>
                    <option value="Prerequisite Logic">Prerequisite Logic</option>
                    <option value="Administrative Regulation">Administrative Regulation</option>
                    <option value="Degree Clearance">Degree Clearance</option>
                    <option value="Policy Interpretation">Policy Interpretation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Evaluation Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as GroundTruthEntry["difficulty"])}
                    className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Multi-step">Multi-step</option>
                    <option value="Complex Regulation">Complex Regulation</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEntry(null);
                  }}
                  className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-500"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
