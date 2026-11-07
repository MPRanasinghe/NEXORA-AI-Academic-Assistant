"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  FileText,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Terminal,
  ChevronRight,
  Info,
  Play,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getStoredJobs,
  ProcessingJob,
} from "@/lib/rag-admin-storage";

const PROCESSING_STAGES = [
  "Text Extraction",
  "Cleaning",
  "Chunking",
  "Metadata Assignment",
  "Sparse Indexing",
  "Dense Embedding",
  "Index Storage",
];

export default function DocumentProcessingPage() {
  const [jobs, setJobs] = useState<ProcessingJob[]>(getStoredJobs());
  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(jobs[0] || null);

  const handleRetryJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updated: ProcessingJob = {
            ...j,
            status: "Running",
            progress: 30,
            stage: "Text Extraction",
            logs: [
              ...j.logs,
              `[${new Date().toLocaleTimeString()}] Retried job execution initiated by administrator...`,
            ],
          };
          if (selectedJob?.id === jobId) setSelectedJob(updated);
          return updated;
        }
        return j;
      })
    );

    // Simulate progress completion
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id === jobId) {
            const completed: ProcessingJob = {
              ...j,
              status: "Completed",
              progress: 100,
              stage: "Completed",
              logs: [
                ...j.logs,
                `[${new Date().toLocaleTimeString()}] Pipeline completed successfully: Inverted index and dense embeddings persisted.`,
              ],
            };
            if (selectedJob?.id === jobId) setSelectedJob(completed);
            return completed;
          }
          return j;
        })
      );
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Document Processing Pipeline"
        subtitle="Monitor text extraction, token cleaning, boundary chunking, sparse TF-IDF dictionary building, and dense vector embedding generation"
        badge="Ingestion Telemetry"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Document Processing" },
        ]}
      />

      {/* Pipeline Stages Map */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Academic Document Ingestion Sequence
        </h3>
        <p className="mt-0.5 text-xs text-slate-400">
          The 7-stage deterministic transformation from unstructured academic policy to searchable vector space
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {PROCESSING_STAGES.map((stage, idx) => (
            <div
              key={stage}
              className="flex flex-col items-center rounded-xl border border-white/[0.05] bg-[#0D1225] p-3 text-center"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
                {idx + 1}
              </span>
              <p className="mt-2 text-xs font-semibold text-white">{stage}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {idx === 0 && "OCR & Parsers"}
                {idx === 1 && "Header Scrubbing"}
                {idx === 2 && "512-Token Splits"}
                {idx === 3 && "Regulation Tags"}
                {idx === 4 && "Sublinear TF"}
                {idx === 5 && "768-d Vectors"}
                {idx === 6 && "Vector Store"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Split: Jobs List vs Logs Terminal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Jobs List (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Processing Queue ({jobs.length} jobs)</span>
            <span>Simulated Backend Worker</span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-white/[0.06] bg-[#11162A] hover:border-white/[0.12] hover:bg-[#141A30]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-300">
                      {job.id}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-white">
                    {job.documentTitle}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Stage: {job.stage}</span>
                    <span className="font-mono">{job.durationMs}ms</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                    <div
                      style={{ width: `${job.progress}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        job.status === "Failed"
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-violet-500 to-cyan-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Job Telemetry & Execution Log (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {selectedJob ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {selectedJob.id}
                    </span>
                    <StatusBadge status={selectedJob.status} />
                  </div>
                  <h3 className="mt-1 text-base font-bold text-white">
                    {selectedJob.documentTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Started: {selectedJob.startedAt} · Duration: {selectedJob.durationMs}ms
                  </p>
                </div>

                <button
                  onClick={() => handleRetryJob(selectedJob.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-violet-500"
                >
                  <RotateCcw size={14} />
                  <span>Re-run Ingestion Pipeline</span>
                </button>
              </div>

              {/* Terminal Logs */}
              <div className="mt-6">
                <div className="flex items-center justify-between rounded-t-xl border border-white/[0.08] bg-[#080B18] px-4 py-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-cyan-400" />
                    <span className="font-mono text-[11px]">Worker Execution Telemetry Log</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Live stream</span>
                </div>

                <div className="max-h-[360px] overflow-y-auto rounded-b-xl border-x border-b border-white/[0.08] bg-black/70 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
                  {selectedJob.logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-600">&gt;</span>
                      <span className="text-cyan-200">{log}</span>
                    </div>
                  ))}
                  <div className="mt-2 text-slate-500">
                    [INFO] Memory utilization: 142 MB RSS · Workers: 2 threads
                  </div>
                </div>
              </div>

              {/* Research Pipeline Note */}
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 text-[11px] text-slate-400">
                <Info size={15} className="mt-0.5 shrink-0 text-cyan-400" />
                <p>
                  In our research framework, indexing produces a bifurcated representation: an inverted sparse index for exact regulatory token lookups and dense high-dimensional vectors for semantic intent mapping.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#11162A] text-xs text-slate-500">
              Select a processing job to inspect log telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
