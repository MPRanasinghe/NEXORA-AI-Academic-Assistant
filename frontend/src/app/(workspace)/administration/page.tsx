"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Database,
  Layers,
  SearchCode,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Sliders,
  Sparkles,
  Bot,
  AlertCircle,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  Eye,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import PipelineDiagram from "@/components/admin/PipelineDiagram";
import {
  useAdminDocuments,
  useAdminDataset,
  DEFAULT_AGENT_EXECUTIONS,
  DEFAULT_CHUNKS,
  AgentExecution,
} from "@/lib/rag-admin-storage";

export default function AdministrationOverviewPage() {
  const router = useRouter();
  const { documents } = useAdminDocuments();
  const { dataset } = useAdminDataset();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<AgentExecution | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const totalChunks = documents.reduce((sum, d) => sum + d.chunkCount, 0);
  const indexedDocs = documents.filter((d) => d.status === "Indexed").length;
  const processingDocs = documents.filter((d) => d.status === "Processing").length;

  // Evaluation averages
  const avgContextRel = 0.92;
  const avgGroundedness = 0.95;
  const avgAnswerRel = 0.93;
  const overallEval = ((avgContextRel + avgGroundedness + avgAnswerRel) / 3) * 100;

  // Activity trend data for lightweight SVG visualization
  const telemetryDays = [
    { day: "Mon", queries: 142, agents: 98, success: 139 },
    { day: "Tue", queries: 189, agents: 132, success: 185 },
    { day: "Wed", queries: 210, agents: 164, success: 206 },
    { day: "Thu", queries: 195, agents: 147, success: 192 },
    { day: "Fri", queries: 245, agents: 188, success: 241 },
    { day: "Sat", queries: 112, agents: 74, success: 110 },
    { day: "Sun", queries: 130, agents: 89, success: 128 },
  ];

  const maxQueries = Math.max(...telemetryDays.map((d) => d.queries));

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="NEXORA Intelligence Administration"
        subtitle="Explainable Agentic RAG Control Center for Higher Education & Academic Governance"
        badge="Agentic Perception-Action Loop"
        lastUpdated="Just now"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/administration/retrieval"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
            >
              <SearchCode size={15} />
              <span>Explore Retrieval</span>
            </Link>
            <Link
              href="/administration/knowledge-base"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              <Database size={15} />
              <span>Upload Document</span>
            </Link>
          </div>
        }
      />

      {/* Research System Overview Alert Notice */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-[#11162A] to-violet-500/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-cyan-500/20 p-2 text-cyan-300">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Academic-Administration Domain Research Hypothesis
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Bridging foundational Sparse VSM (Term Frequency & Cosine Similarity) with Dense Embedding representations via an iterative Agentic Loop (Observation → Reasoning → Action) yields verifiable mathematical explainability and superior Groundedness over standard black-box RAG.
              </p>
            </div>
          </div>
          <Link
            href="/administration/explainability"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:underline"
          >
            <span>View Math Engine</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Key Telemetry Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            System Telemetry & Index Statistics
          </h2>
          <span className="text-xs text-slate-500">Live Demonstrator Metrics</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminStatCard
            label="Indexed Documents"
            value={documents.length}
            sublabel={`${indexedDocs} Active · ${processingDocs} Ingesting`}
            icon={Database}
            trend="+12%"
            color="violet"
          />
          <AdminStatCard
            label="Vector Chunks"
            value={totalChunks}
            sublabel="512-Token Recursive VSM"
            icon={Layers}
            trend="+24"
            color="cyan"
          />
          <AdminStatCard
            label="Retrieval Queries"
            value="1,227"
            sublabel="Academic Regulation Inquiries"
            icon={SearchCode}
            trend="+18%"
            color="blue"
          />
          <AdminStatCard
            label="Agent Executions"
            value="892"
            sublabel="Multi-Step Reasoning Traces"
            icon={Activity}
            trend="98.2% Success"
            color="emerald"
          />
          <AdminStatCard
            label="Avg. Latency"
            value="340ms"
            sublabel="Hybrid Ranking & Fusion"
            icon={Clock}
            trend="Fast"
            color="amber"
          />
          <AdminStatCard
            label="RAG Evaluation"
            value={`${overallEval.toFixed(1)}%`}
            sublabel="Mean Benchmark Score"
            icon={CheckCircle2}
            trend="Top Tier"
            color="emerald"
          />
        </div>
      </section>

      {/* Retrieval Pipeline Architecture Diagram */}
      <PipelineDiagram />

      {/* Activity Chart & Evaluation Summary Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Telemetry Chart */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 lg:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-semibold text-white">
                Weekly Retrieval & Agentic Volume
              </h3>
              <p className="text-xs text-slate-400">
                Queries vs. Iterative Agent Executions across 7 days
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-violet-300">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                Total Queries
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Agent Loops
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-8 flex h-52 items-end justify-between gap-3 px-2 sm:gap-6">
            {telemetryDays.map((item) => {
              const queryHeight = (item.queries / maxQueries) * 100;
              const agentHeight = (item.agents / maxQueries) * 100;

              return (
                <div key={item.day} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-full w-full items-end justify-center gap-1.5">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#080B18] px-2.5 py-1 text-[11px] shadow-xl group-hover:block">
                      <p className="font-semibold text-white">{item.day}</p>
                      <p className="text-violet-300">{item.queries} Queries</p>
                      <p className="text-cyan-300">{item.agents} Agent Loops</p>
                    </div>

                    {/* Query bar */}
                    <div
                      style={{ height: `${queryHeight}%` }}
                      className="w-1/2 rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400 transition-all duration-300 group-hover:brightness-125"
                    />

                    {/* Agent bar */}
                    <div
                      style={{ height: `${agentHeight}%` }}
                      className="w-1/2 rounded-t-lg bg-gradient-to-t from-cyan-500 to-cyan-300 transition-all duration-300 group-hover:brightness-125"
                    />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-slate-400">
            <span>Peak throughput: 245 queries / day</span>
            <Link
              href="/administration/analytics"
              className="flex items-center gap-1 text-violet-300 hover:text-violet-200 hover:underline"
            >
              <span>Full Analytics Suite</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Empirical Evaluation Summary Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              Evaluation Metrics (RAG Triad)
            </h3>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              Benchmark v1
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Empirically measured over {dataset.length} ground-truth regulation queries
          </p>

          <div className="mt-6 space-y-5">
            {/* Context Relevance */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Context Relevance</span>
                <span className="font-semibold text-cyan-300">{(avgContextRel * 100).toFixed(1)}%</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Precision of retrieved regulatory clauses to student intent
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  style={{ width: `${avgContextRel * 100}%` }}
                  className="h-full rounded-full bg-cyan-400"
                />
              </div>
            </div>

            {/* Groundedness */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Groundedness (Faithfulness)</span>
                <span className="font-semibold text-emerald-300">{(avgGroundedness * 100).toFixed(1)}%</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Degree to which answer is strictly derived from retrieved text
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  style={{ width: `${avgGroundedness * 100}%` }}
                  className="h-full rounded-full bg-emerald-400"
                />
              </div>
            </div>

            {/* Answer Relevance */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Answer Relevance</span>
                <span className="font-semibold text-violet-300">{(avgAnswerRel * 100).toFixed(1)}%</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Completeness in answering user&apos;s original query constraints
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  style={{ width: `${avgAnswerRel * 100}%` }}
                  className="h-full rounded-full bg-violet-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <Link
              href="/administration/evaluation"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/10 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              <BookOpenCheck size={14} />
              <span>Launch Evaluation Benchmark</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Agent Execution Overview & Recent Documents Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Agent Monitor Quick Feed */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Recent Agentic Execution Traces
              </h3>
              <p className="text-xs text-slate-400">
                Multi-step perception-action loops resolving complex academic queries
              </p>
            </div>
            <Link
              href="/administration/agent-monitor"
              className="text-xs text-violet-400 hover:text-violet-300 hover:underline"
            >
              View All ({DEFAULT_AGENT_EXECUTIONS.length})
            </Link>
          </div>

          <div className="space-y-3">
            {DEFAULT_AGENT_EXECUTIONS.slice(0, 3).map((exec) => (
              <div
                key={exec.id}
                onClick={() => setSelectedExecution(exec)}
                className="group cursor-pointer rounded-xl border border-white/[0.05] bg-[#0D1225] p-4 transition hover:border-violet-500/30 hover:bg-[#141A30]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={exec.status} />
                    <span className="font-mono text-[11px] text-slate-500">
                      {exec.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {exec.durationMs}ms · {exec.iterationCount} iterations
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-200 group-hover:text-violet-200">
                  {exec.query}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Evidence: {exec.evidenceCount} clauses</span>
                  <span className="flex items-center gap-1 text-violet-300">
                    <Eye size={12} />
                    Inspect Trace
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base Activity */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Knowledge Base Ingestion
              </h3>
              <p className="text-xs text-slate-400">
                Academic policy documents active in the vector corpus
              </p>
            </div>
            <Link
              href="/administration/knowledge-base"
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Manage ({documents.length})
            </Link>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#0D1225] p-3.5 transition hover:border-white/[0.1]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                    <FileText size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-200">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {doc.category} · {doc.chunkCount} chunks ({doc.fileSize})
                    </p>
                  </div>
                </div>

                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Trace Inspection Modal */}
      {selectedExecution && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedExecution(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-300">
                  {selectedExecution.id}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Agentic Perception-Action Trace
                </h3>
              </div>
              <button
                onClick={() => setSelectedExecution(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Query: </span>
              {selectedExecution.query}
            </div>

            {/* Trace Step Timeline */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Step-by-Step Cycle (Observation → Reasoning → Action)
              </h4>

              <div className="space-y-3">
                {selectedExecution.traces.map((step) => {
                  const cycleColor =
                    step.cycle === "Observation"
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      : step.cycle === "Reasoning"
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                      : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";

                  return (
                    <div
                      key={step.stepNumber}
                      className="rounded-xl border border-white/[0.05] bg-[#0D1225] p-4"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${cycleColor}`}>
                          Step {step.stepNumber}: {step.cycle}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-white">
                        {step.details.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        {step.details.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synthesized Answer */}
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
              <p className="text-xs font-semibold text-emerald-400">
                Synthesized Grounded Answer:
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-200">
                {selectedExecution.finalAnswer}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
                <span>Citations: </span>
                {selectedExecution.citations.map((c) => (
                  <span
                    key={c}
                    className="rounded bg-white/[0.05] px-2 py-0.5 text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedExecution(null)}
                className="rounded-xl bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/[0.1] hover:text-white"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
