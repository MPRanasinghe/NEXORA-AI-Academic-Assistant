"use client";

import React, { useState } from "react";
import {
  Activity,
  Bot,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  Info,
  Layers,
  ArrowRight,
  Terminal,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getStoredExecutions,
  AgentExecution,
} from "@/lib/rag-admin-storage";

export default function AgentMonitorPage() {
  const [executions] = useState<AgentExecution[]>(getStoredExecutions());
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeExec, setActiveExec] = useState<AgentExecution | null>(executions[0] || null);

  const filteredExecutions = executions.filter((e) => {
    const matchSearch =
      e.query.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      selectedStatus === "All" || e.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Agent Execution Monitor"
        subtitle="Inspect multi-step Perception-Action Cycles (Observation → Reasoning → Action) resolving complex, multi-constraint academic inquiries"
        badge="Autonomous Reasoning Telemetry"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Agent Monitor" },
        ]}
      />

      {/* Explanatory Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-[#11162A] to-violet-500/10 p-5 text-xs text-slate-300">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-300">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Agentic Perception-Action Loop vs. Single-Shot RAG
            </h3>
            <p className="mt-1 leading-relaxed">
              Unlike Naïve RAG which retrieves once and generates, our Explainable Agent observes missing regulatory constraints, formulates sub-queries, inspects evidence sufficiency, and performs iterative actions until verifiable ground truth is attained.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search executions by query text or execution ID..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Iterating">Iterating</option>
            <option value="Max Iterations Reached">Max Iterations</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Main Split: Executions List vs Trace Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Executions List (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Logged Executions ({filteredExecutions.length})</span>
            <span>Click to view step trace</span>
          </div>

          <div className="max-h-[700px] space-y-3 overflow-y-auto pr-1">
            {filteredExecutions.map((exec) => {
              const isSelected = activeExec?.id === exec.id;

              return (
                <div
                  key={exec.id}
                  onClick={() => setActiveExec(exec)}
                  className={`group cursor-pointer rounded-2xl border p-4 transition duration-200 ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/[0.06] bg-[#11162A] hover:border-white/[0.12] hover:bg-[#141A30]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {exec.id}
                    </span>
                    <StatusBadge status={exec.status} />
                  </div>

                  <p className="mt-2.5 text-xs font-semibold text-white group-hover:text-cyan-200">
                    {exec.query}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{exec.iterationCount} Iteration{exec.iterationCount > 1 ? "s" : ""}</span>
                    <span>{exec.durationMs}ms</span>
                    <span className="text-emerald-400 font-mono">
                      Sufficiency: {(exec.sufficiencyScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Trace Timeline View (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {activeExec ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300">
                      {activeExec.id}
                    </span>
                    <StatusBadge status={activeExec.status} />
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white">
                    Agentic Reasoning & Action Trace
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Started: {activeExec.startedAt} · Duration: {activeExec.durationMs}ms
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#080B18] px-3.5 py-2 text-right">
                  <span className="text-[10px] uppercase text-slate-500">Sufficiency</span>
                  <p className="font-mono font-bold text-emerald-400">
                    {(activeExec.sufficiencyScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Original User Query */}
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs text-slate-200">
                <span className="font-semibold text-slate-400">Student/Staff Inquiry: </span>
                {activeExec.query}
              </div>

              {/* Step Timeline */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Execution Cycles ({activeExec.traces.length} steps logged)
                </h4>

                <div className="mt-4 relative space-y-4 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-0.5 before:bg-white/[0.08]">
                  {activeExec.traces.map((step) => {
                    const badgeStyles =
                      step.cycle === "Observation"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : step.cycle === "Reasoning"
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

                    return (
                      <div key={step.stepNumber} className="relative pl-9">
                        {/* Dot indicator */}
                        <div className="absolute left-2.5 top-3.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#11162A] bg-cyan-400" />

                        <div className="rounded-xl border border-white/[0.06] bg-[#0D1225] p-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badgeStyles}`}>
                              Step {step.stepNumber}: {step.cycle}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {step.timestamp}
                            </span>
                          </div>

                          <h5 className="mt-2 text-xs font-semibold text-white">
                            {step.details.title}
                          </h5>

                          <p className="mt-1 text-xs leading-relaxed text-slate-300">
                            {step.details.summary}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Synthesized Answer */}
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Grounded Regulation Answer:
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  {activeExec.finalAnswer}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-400">Regulatory Citations:</span>
                  {activeExec.citations.map((c) => (
                    <span
                      key={c}
                      className="rounded bg-black/40 px-2 py-0.5 text-slate-300 font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#11162A] text-xs text-slate-500">
              Select an agent execution to inspect trace
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
