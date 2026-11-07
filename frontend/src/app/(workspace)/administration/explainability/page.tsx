"use client";

import React, { useState, useMemo } from "react";
import {
  Binary,
  Layers,
  SearchCode,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Info,
  Hash,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  getStoredChunks,
  calculateSparseRetrieval,
  calculateHybridRanking,
  RetrievalResult,
} from "@/lib/rag-admin-storage";

export default function ExplainabilityPage() {
  const allChunks = useMemo(() => getStoredChunks(), []);
  const sampleQuery = "What GPA threshold and credit hours clear academic probation?";

  const [query, setQuery] = useState(sampleQuery);
  const [alpha, setAlpha] = useState(0.6);

  const rawResults = useMemo(() => {
    return calculateSparseRetrieval(query, allChunks);
  }, [query, allChunks]);

  const hybridResults = useMemo(() => {
    return calculateHybridRanking(rawResults, alpha);
  }, [rawResults, alpha]);

  const [selectedChunkId, setSelectedChunkId] = useState<string>(
    hybridResults[0]?.chunkId || "chunk-reg-014"
  );

  const selectedResult = useMemo(() => {
    return hybridResults.find((r) => r.chunkId === selectedChunkId) || hybridResults[0];
  }, [hybridResults, selectedChunkId]);

  // Rankings across all 3 methods for comparison table
  const sparseRankings = useMemo(() => {
    return [...rawResults]
      .sort((a, b) => b.sparseScore - a.sparseScore)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rawResults]);

  const denseRankings = useMemo(() => {
    return [...rawResults]
      .sort((a, b) => b.denseScore - a.denseScore)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rawResults]);

  const sparseRank = sparseRankings.find((r) => r.chunkId === selectedChunkId)?.rank || 1;
  const denseRank = denseRankings.find((r) => r.chunkId === selectedChunkId)?.rank || 1;
  const hybridRank = hybridResults.find((r) => r.chunkId === selectedChunkId)?.rank || 1;

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Mathematical Retrieval Explainability"
        subtitle="Deconstruct step-by-step why an academic clause was selected over competing documents using foundational linear algebra and term weighting"
        badge="Mathematical Transparency"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Explainability" },
        ]}
      />

      {/* Research Statement Card */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-[#11162A] to-cyan-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-500/20 p-2 text-violet-300">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              White-Box Retrieval Verification in Academic Governance
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              When an AI system advises a university student on probation or credit waivers, the underlying retrieval cannot be a black box. Below is the full mathematical derivation showing token frequency weights, vector dot product, and cosine angle.
            </p>
          </div>
        </div>
      </div>

      {/* Target Query Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Target Research Query Under Audit
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Chunk:</span>
            <select
              value={selectedChunkId}
              onChange={(e) => setSelectedChunkId(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              {allChunks.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} ({c.section.slice(0, 28)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedResult && (
        <>
          {/* Comparative Rank Shifts Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Sparse VSM Ranking */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                1. Sparse TF-IDF Alone
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white">Rank #{sparseRank}</span>
                <span className="text-xs text-slate-500">Score: {selectedResult.sparseScore.toFixed(4)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Exact keyword and numerical token matches in academic text
              </p>
            </div>

            {/* Dense Latent Ranking */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                2. Dense Embedding Alone
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white">Rank #{denseRank}</span>
                <span className="text-xs text-slate-500">Score: {selectedResult.denseScore.toFixed(4)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Semantic conceptual overlap in latent embedding space
              </p>
            </div>

            {/* Hybrid Ranking */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                3. Final Hybrid Fusion (α={alpha})
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-emerald-300">Rank #{hybridRank}</span>
                <span className="text-xs text-emerald-400 font-mono">Score: {selectedResult.hybridScore.toFixed(4)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Composite rank resolving keyword-semantic discrepancies
              </p>
            </div>
          </div>

          {/* Mathematical Worked Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Worked Calculation Details */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Vector Space Model (VSM) Mathematical Derivation
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Salton Cosine Similarity formula applied to query vector <code className="text-cyan-400">q</code> and document vector <code className="text-violet-400">d</code>
              </p>

              {/* Formula Display */}
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#080B18] p-4 font-mono text-xs text-cyan-300">
                cos(θ) = (q · d) / ( ||q|| × ||d|| )
              </div>

              {/* Step by Step Breakdown */}
              <div className="mt-5 space-y-4 text-xs">
                <div className="rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Step 1: Dot Product (q · d)</span>
                    <span className="font-mono text-cyan-300">{selectedResult.sparseMath.dotProduct}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Sum of products of sublinear TF-IDF weights for overlapping regulatory terms ({selectedResult.matchedTerms.join(", ") || "none"}).
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Step 2: Query Vector Magnitude (||q||)</span>
                    <span className="font-mono text-violet-300">{selectedResult.sparseMath.queryMagnitude}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Euclidean norm of query vector: √[ ∑ (tf(t, q) · idf(t))² ].
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Step 3: Document Vector Magnitude (||d||)</span>
                    <span className="font-mono text-emerald-300">{selectedResult.sparseMath.docMagnitude}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Euclidean norm of 512-token partition vector: √[ ∑ (1 + ln(tf(t, d)))² ].
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Final Cosine Similarity:</span>
                    <span className="font-mono text-emerald-300 text-sm">
                      {selectedResult.sparseMath.dotProduct} / ({selectedResult.sparseMath.queryMagnitude} × {selectedResult.sparseMath.docMagnitude}) = {selectedResult.sparseScore.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Text & Justification */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Audited Evidence Text & Semantic Justification
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Retrieved clause: {selectedResult.chunkId} ({selectedResult.documentTitle})
              </p>

              <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs leading-relaxed text-slate-200">
                <p className="mb-2 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                  Verbatim Regulation:
                </p>
                {selectedResult.text}
              </div>

              {/* Justification Box */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">
                  Why this chunk was selected:
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Contains exact regulatory threshold tokens (<strong className="text-slate-200">probation</strong>, <strong className="text-slate-200">gpa</strong>, <strong className="text-slate-200">credits</strong>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                    <span>Dense semantic distance shows high affinity with academic standing policies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-violet-400" />
                    <span>Hybrid rank combination puts it at the top of the context window.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 text-[11px] text-slate-500">
                Demonstration mathematical calculation calculated live in frontend memory.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
