"use client";

import React, { useState } from "react";
import {
  LineChart,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Activity,
  Filter,
  Info,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AnalyticsReportsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [selectedMetric, setSelectedMetric] = useState("All");

  const trendData = [
    { period: "Week 1", contextRel: 88, groundedness: 92, answerRel: 89, latency: 410 },
    { period: "Week 2", periodFull: "Oct 15", contextRel: 89, groundedness: 94, answerRel: 90, latency: 380 },
    { period: "Week 3", periodFull: "Oct 22", contextRel: 91, groundedness: 93, answerRel: 92, latency: 360 },
    { period: "Week 4", periodFull: "Oct 29", contextRel: 93, groundedness: 96, answerRel: 94, latency: 330 },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ["Period", "Context Relevance (%)", "Groundedness (%)", "Answer Relevance (%)", "Mean Latency (ms)"],
      ...trendData.map((d) => [d.period, d.contextRel, d.groundedness, d.answerRel, d.latency]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rag_triad_telemetry_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Research Analytics & Telemetry"
        subtitle="Empirical performance trajectories, latency distribution across sparse-dense components, and agent loop convergence"
        badge="Empirical Telemetry"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Analytics & Reports" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#11162A] px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Semester to Date">Semester to Date</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-violet-500"
            >
              <Download size={14} />
              <span>Export CSV Report</span>
            </button>
          </div>
        }
      />

      {/* RAG Triad Trajectory Chart */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-white">
              RAG Triad Empirical Trajectory (Monthly Progression)
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrating progressive accuracy gains as regulations are parsed with Hybrid α=0.60
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Context Relevance
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Groundedness
            </span>
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              Answer Relevance
            </span>
          </div>
        </div>

        {/* Visual Graph Bars */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trendData.map((d) => (
            <div
              key={d.period}
              className="rounded-2xl border border-white/[0.06] bg-[#080B18] p-5 text-center"
            >
              <span className="font-semibold text-xs text-slate-400">{d.period}</span>
              <div className="mt-4 space-y-3 text-left">
                <div>
                  <div className="flex justify-between text-[11px] text-cyan-300">
                    <span>Context Rel.</span>
                    <span className="font-mono">{d.contextRel}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      style={{ width: `${d.contextRel}%` }}
                      className="h-full rounded-full bg-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-emerald-400">
                    <span>Groundedness</span>
                    <span className="font-mono">{d.groundedness}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      style={{ width: `${d.groundedness}%` }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-violet-300">
                    <span>Answer Rel.</span>
                    <span className="font-mono">{d.answerRel}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      style={{ width: `${d.answerRel}%` }}
                      className="h-full rounded-full bg-violet-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
                Mean Latency: <span className="font-mono text-slate-300">{d.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latency & Iteration Distributions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latency Breakdown by Component */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <h3 className="text-base font-semibold text-white">
            Retrieval Pipeline Latency Profiling
          </h3>
          <p className="text-xs text-slate-400">
            Average milliseconds consumed across discrete RAG stages (Total: 340ms)
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Query Parsing & Sublinear Tokenization</span>
                <span className="font-mono text-cyan-400">22ms (6%)</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.06]">
                <div style={{ width: "6%" }} className="h-full rounded-full bg-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Sparse TF-IDF Dot Product Calculation</span>
                <span className="font-mono text-purple-400">38ms (11%)</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.06]">
                <div style={{ width: "11%" }} className="h-full rounded-full bg-purple-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Dense Embedding Vector Search (HNSW / Flat)</span>
                <span className="font-mono text-blue-400">120ms (35%)</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.06]">
                <div style={{ width: "35%" }} className="h-full rounded-full bg-blue-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Hybrid Normalization & α=0.60 Re-ranking</span>
                <span className="font-mono text-emerald-400">45ms (13%)</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.06]">
                <div style={{ width: "13%" }} className="h-full rounded-full bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Grounded Answer Generation & Citation Validation</span>
                <span className="font-mono text-violet-400">115ms (35%)</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.06]">
                <div style={{ width: "35%" }} className="h-full rounded-full bg-violet-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Iteration Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <h3 className="text-base font-semibold text-white">
            Agent Loop Iteration Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Perception-Action cycle counts required before reaching sufficiency threshold (θ ≥ 0.85)
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
              <div>
                <p className="text-xs font-semibold text-white">1 Iteration (Direct Answer)</p>
                <p className="text-[11px] text-slate-400">Single regulation lookup, zero ambiguity</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-emerald-400">62%</span>
                <p className="text-[10px] text-slate-500">553 queries</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
              <div>
                <p className="text-xs font-semibold text-white">2 Iterations (Targeted Sub-query)</p>
                <p className="text-[11px] text-slate-400">Multi-part policy (e.g. Warning vs Probation credit caps)</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-cyan-400">28%</span>
                <p className="text-[10px] text-slate-500">250 queries</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5">
              <div>
                <p className="text-xs font-semibold text-white">3+ Iterations (Deep Decomposition)</p>
                <p className="text-[11px] text-slate-400">Cross-department prerequisite waiver conflicts</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-violet-400">10%</span>
                <p className="text-[10px] text-slate-500">89 queries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
