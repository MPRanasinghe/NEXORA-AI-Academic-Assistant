"use client";

import React, { useState, useMemo } from "react";
import {
  SearchCode,
  Sliders,
  Play,
  RotateCcw,
  Layers,
  FileSpreadsheet,
  Binary,
  CheckCircle2,
  ChevronRight,
  Info,
  SlidersHorizontal,
  Eye,
  Hash,
  Sparkles,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  getStoredChunks,
  calculateSparseRetrieval,
  calculateHybridRanking,
  RetrievalResult,
} from "@/lib/rag-admin-storage";

const SAMPLE_QUERIES = [
  "What GPA and credit hours are required to clear academic probation?",
  "Can a student take CS305 without CS204 prerequisite with department approval?",
  "What is the fee for appealing a final grade and can I get a refund?",
  "What are the requirements for First-Class Honours in Software Engineering?",
  "What is the difference between an academic warning and probation?",
];

export default function RetrievalExplorerPage() {
  const allChunks = useMemo(() => getStoredChunks(), []);

  // Controls
  const [query, setQuery] = useState(SAMPLE_QUERIES[0]);
  const [retrievalMode, setRetrievalMode] = useState<"Sparse" | "Dense" | "Hybrid">("Hybrid");
  const [alpha, setAlpha] = useState<number>(0.6); // 0.60 sparse, 0.40 dense
  const [topK, setTopK] = useState<number>(5);
  const [threshold, setThreshold] = useState<number>(0.65);
  const [selectedResult, setSelectedResult] = useState<RetrievalResult | null>(null);

  // Computed results based on current query and alpha
  const rawResults = useMemo(() => {
    return calculateSparseRetrieval(query, allChunks);
  }, [query, allChunks]);

  const rankedResults = useMemo(() => {
    const hybrid = calculateHybridRanking(rawResults, alpha);

    // Filter by mode and threshold
    let filtered = hybrid;
    if (retrievalMode === "Sparse") {
      filtered = [...hybrid].sort((a, b) => b.sparseScore - a.sparseScore);
    } else if (retrievalMode === "Dense") {
      filtered = [...hybrid].sort((a, b) => b.denseScore - a.denseScore);
    }

    return filtered
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
      .slice(0, topK);
  }, [rawResults, alpha, retrievalMode, topK]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Interactive Retrieval Explorer"
        subtitle="Empirically benchmark Vector Space Model TF-IDF against Dense Latent Embeddings and Dynamic Hybrid Fusion"
        badge="Retrieval Experimentation"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Retrieval Explorer" },
        ]}
      />

      {/* Query & Parameter Panel */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-white">
              Retrieval Parameter Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Configure retrieval paradigm, hybrid alpha weighting, and sensitivity cutoffs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sample Queries:</span>
            <select
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="max-w-[260px] rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              {SAMPLE_QUERIES.map((q, idx) => (
                <option key={idx} value={q}>
                  Query #{idx + 1}: {q.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Query Input */}
        <div className="mt-5">
          <label className="text-xs font-medium text-slate-300">
            Natural Language Academic Query (User Prompt)
          </label>
          <div className="mt-1.5 flex gap-3">
            <div className="relative flex-1">
              <SearchCode size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter academic query..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
              />
            </div>
            <button
              onClick={() => setQuery(SAMPLE_QUERIES[0])}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              title="Reset query"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/[0.06] pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Mode Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300">
              Retrieval Paradigm
            </label>
            <div className="mt-2 flex rounded-xl border border-white/[0.08] bg-[#080B18] p-1">
              {(["Sparse", "Dense", "Hybrid"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setRetrievalMode(m)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                    retrievalMode === m
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Hybrid Alpha Slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Hybrid Weight (α)</span>
              <span className="font-mono font-bold text-cyan-400">
                α = {alpha.toFixed(2)} / {(1 - alpha).toFixed(2)}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Sparse: {(alpha * 100).toFixed(0)}% · Dense: {((1 - alpha) * 100).toFixed(0)}%
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={alpha}
              disabled={retrievalMode !== "Hybrid"}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="mt-2.5 w-full accent-cyan-400 disabled:opacity-30"
            />
          </div>

          {/* Top-K Selector */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Top-K Partitions</span>
              <span className="font-mono font-bold text-violet-400">{topK} Chunks</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">Maximum retrieved evidence size</p>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="mt-2.5 w-full accent-violet-500"
            />
          </div>

          {/* Similarity Cutoff Threshold */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Similarity Cutoff (θ)</span>
              <span className="font-mono font-bold text-emerald-400">θ ≥ {threshold.toFixed(2)}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">Evidence sufficiency threshold</p>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="mt-2.5 w-full accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Ranking Formula Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-[#11162A] px-6 py-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-cyan-500/10 px-2 py-1 font-mono text-cyan-400">
            Current Scoring:
          </span>
          <span className="font-mono text-slate-200">
            {retrievalMode === "Hybrid"
              ? `Score_hybrid = (${alpha.toFixed(2)} × Score_sparse) + (${(1 - alpha).toFixed(2)} × Score_dense)`
              : retrievalMode === "Sparse"
              ? `Score_sparse = ∑ (tf_idf(q, t) · tf_idf(d, t)) / (||q|| · ||d||)`
              : `Score_dense = cos(e_q, e_d)`}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Live mathematical re-ranking active
        </span>
      </div>

      {/* Results Ranking List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Ranked Evidence Partitions (Top-{rankedResults.length})
          </h3>
          <span className="text-xs text-slate-500">
            Ordered by final composite similarity score
          </span>
        </div>

        <div className="space-y-3">
          {rankedResults.map((result) => {
            const isAboveThreshold = result.hybridScore >= threshold;

            return (
              <div
                key={result.chunkId}
                className={`rounded-2xl border p-5 transition duration-200 ${
                  isAboveThreshold
                    ? "border-white/[0.08] bg-[#11162A] hover:border-violet-500/30"
                    : "border-amber-500/20 bg-[#11162A]/60 opacity-70"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 font-bold text-violet-300">
                      #{result.rank}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-cyan-300">
                          {result.chunkId}
                        </span>
                        <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400">
                          {result.documentTitle}
                        </span>
                        {!isAboveThreshold && (
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                            Below Threshold θ={threshold}
                          </span>
                        )}
                      </div>

                      <h4 className="mt-1.5 text-sm font-semibold text-white">
                        {result.section}
                      </h4>

                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {result.text}
                      </p>

                      {/* Matched Token Tags */}
                      {result.matchedTerms.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">Matched Tokens:</span>
                          {result.matchedTerms.map((term) => (
                            <span
                              key={term}
                              className="rounded border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 font-mono text-[10px] text-violet-300"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scores Summary & Inspect Button */}
                  <div className="flex shrink-0 flex-col items-end gap-3 sm:text-right">
                    <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3 text-right">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">
                        Final Score
                      </div>
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {retrievalMode === "Hybrid"
                          ? result.hybridScore.toFixed(4)
                          : retrievalMode === "Sparse"
                          ? result.sparseScore.toFixed(4)
                          : result.denseScore.toFixed(4)}
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-2 text-[10px] font-mono text-slate-500">
                        <span>Sparse: {result.sparseScore.toFixed(2)}</span>
                        <span>·</span>
                        <span>Dense: {result.denseScore.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedResult(result)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 hover:underline"
                    >
                      <Eye size={13} />
                      <span>Mathematical Breakdown</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Breakdown Modal */}
      {selectedResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-300">
                  {selectedResult.chunkId} Mathematical Telemetry
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">
                  {selectedResult.section}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Formula Breakdown Cards */}
            <div className="mt-6 space-y-4">
              {/* Sparse TF-IDF Breakdown */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#080B18] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                  1. Sparse VSM (Vector Space Model) Cosine Calculation
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div className="rounded-lg bg-white/[0.02] p-2.5">
                    <span className="text-[10px] text-slate-500">Dot Product (q·d)</span>
                    <p className="font-mono font-semibold text-white">
                      {selectedResult.sparseMath.dotProduct}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2.5">
                    <span className="text-[10px] text-slate-500">||q|| Magnitude</span>
                    <p className="font-mono font-semibold text-white">
                      {selectedResult.sparseMath.queryMagnitude}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2.5">
                    <span className="text-[10px] text-slate-500">||d|| Magnitude</span>
                    <p className="font-mono font-semibold text-white">
                      {selectedResult.sparseMath.docMagnitude}
                    </p>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 p-2.5">
                    <span className="text-[10px] text-violet-400">Cosine Similarity</span>
                    <p className="font-mono font-bold text-violet-300">
                      {selectedResult.sparseMath.cosineSimilarity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dense Embedding Calculation */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#080B18] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  2. Dense Semantic Embedding Affinity
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div className="rounded-lg bg-white/[0.02] p-2.5">
                    <span className="text-[10px] text-slate-500">Dimensions</span>
                    <p className="font-mono font-semibold text-white">768 Float32</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2.5">
                    <span className="text-[10px] text-slate-500">Dot Product</span>
                    <p className="font-mono font-semibold text-white">
                      {selectedResult.denseMath.dotProduct}
                    </p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/10 p-2.5">
                    <span className="text-[10px] text-cyan-400">Dense Score</span>
                    <p className="font-mono font-bold text-cyan-300">
                      {selectedResult.denseScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hybrid Score Synthesis */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  3. Hybrid Score Fusion (α = {alpha})
                </h4>
                <p className="mt-1 font-mono text-xs text-slate-200">
                  ({alpha} × {selectedResult.normalizedSparseScore}) + ({1 - alpha} × {selectedResult.normalizedDenseScore}) ={" "}
                  <span className="font-bold text-emerald-300">{selectedResult.hybridScore}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.1] hover:text-white"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
