"use client";

import React, { useState } from "react";
import {
  Search,
  Brain,
  FileSpreadsheet,
  Binary,
  Layers,
  Filter,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";

interface Stage {
  id: string;
  name: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  details: string;
  math: string;
}

const STAGES: Stage[] = [
  {
    id: "query",
    name: "Query Ingestion",
    sub: "Academic Input",
    icon: Search,
    color: "from-blue-500 to-indigo-500",
    details: "Ingests natural language student or staff queries regarding degree requirements, regulations, or course policies.",
    math: "q = 'What GPA threshold clears academic probation with 12 credits?'",
  },
  {
    id: "analysis",
    name: "Query Analysis",
    sub: "Token & Intent Decomposition",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    details: "Analyzes semantic intents, extracts key academic terms, decomposes multi-constraint conditions.",
    math: "Tokens = {probation, gpa, threshold, credits, removal}, TF(t_i, q)",
  },
  {
    id: "sparse",
    name: "Sparse Retrieval",
    sub: "TF-IDF / Sublinear VSM",
    icon: FileSpreadsheet,
    color: "from-purple-500 to-pink-500",
    details: "Matches exact regulatory numbers, module codes (e.g. CS204), and specific legal phrases using Vector Space Models.",
    math: "Score_sparse(q, d) = (∑ tf_idf(t, q) · tf_idf(t, d)) / (||q|| · ||d||)",
  },
  {
    id: "dense",
    name: "Dense Retrieval",
    sub: "Semantic Embeddings",
    icon: Binary,
    color: "from-cyan-500 to-teal-500",
    details: "Encodes dense latent representations (768-d) capturing conceptual intent beyond exact keyword matches.",
    math: "Score_dense(q, d) = cos(e_q, e_d) = (e_q · e_d) / (||e_q|| ||e_d||)",
  },
  {
    id: "hybrid",
    name: "Hybrid Ranking",
    sub: "Normalized Reciprocal Fusion",
    icon: Layers,
    color: "from-emerald-500 to-cyan-500",
    details: "Blends normalized sparse and dense scores with research weight α (default α=0.60) to eliminate keyword vs semantic trade-offs.",
    math: "Score_hybrid = α · S_sparse + (1 - α) · S_dense",
  },
  {
    id: "context",
    name: "Context Selection",
    sub: "Threshold & Deduplication",
    icon: Filter,
    color: "from-amber-500 to-orange-500",
    details: "Applies similarity cutoffs (≥0.65) and evidence sufficiency checks to assemble verifiable context chunks.",
    math: "C* = { d ∈ Corpus | Score_hybrid(q, d) ≥ θ }, Top-K = 5",
  },
  {
    id: "answer",
    name: "Grounded Answer",
    sub: "Faithful Generation",
    icon: CheckCircle2,
    color: "from-emerald-400 to-green-500",
    details: "Generates verifiable answer explicitly grounded in retrieved academic regulations with exact clause citations.",
    math: "y = LLM(q, C*), Groundedness ≥ 0.90 constraint",
  },
];

export default function PipelineDiagram() {
  const [activeStage, setActiveStage] = useState<Stage>(STAGES[4]); // default to Hybrid

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Dual-Stage Explainable Retrieval Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            From raw academic question to mathematically verified grounded response
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          <Info size={13} />
          Click any stage to inspect mathematical logic
        </span>
      </div>

      {/* Horizontal Scrollable Stages on mobile, Grid on desktop */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="flex min-w-[760px] items-center justify-between gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage.id === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setActiveStage(stage)}
                  className={`group flex flex-1 flex-col items-center rounded-xl border p-3.5 text-center transition-all duration-200 ${
                    isSelected
                      ? "border-violet-400/50 bg-violet-500/15 shadow-lg shadow-violet-500/10"
                      : "border-white/[0.06] bg-[#0D1225] hover:border-white/[0.14] hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stage.color} text-white shadow-md transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon size={18} />
                  </div>

                  <p
                    className={`mt-2.5 text-xs font-semibold ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {stage.name}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {stage.sub}
                  </p>
                </button>

                {idx < STAGES.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center px-1 text-slate-600">
                    <ChevronRight size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Panel */}
      <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#0D1225]/80 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                Stage {STAGES.findIndex((s) => s.id === activeStage.id) + 1} of 7
              </span>
              <h4 className="text-base font-semibold text-white">
                {activeStage.name} ({activeStage.sub})
              </h4>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {activeStage.details}
            </p>
          </div>

          <div className="rounded-lg border border-violet-400/20 bg-black/40 p-3.5 font-mono text-xs text-cyan-300 md:max-w-md">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Mathematical Formulation
            </p>
            <p className="mt-1 font-semibold text-slate-200">{activeStage.math}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
