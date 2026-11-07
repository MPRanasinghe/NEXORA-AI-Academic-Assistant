"use client";

import React, { useState } from "react";
import {
  Settings,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Database,
  ShieldCheck,
  Info,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  resetAllAdminData,
  STORAGE_KEYS,
} from "@/lib/rag-admin-storage";

export default function SystemSettingsPage() {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    resetAllAdminData();
    setResetConfirmOpen(false);
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleExportFullBackup = () => {
    const backup: Record<string, unknown> = {};
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        const val = localStorage.getItem(key);
        if (val) backup[key] = JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    });

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexora_rag_full_system_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="System Settings & Telemetry Management"
        subtitle="Manage demonstration persistence, export full RAG telemetry state, and configure platform observability"
        badge="Platform Operations"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "System Settings" },
        ]}
      />

      {resetSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300">
          <CheckCircle2 size={16} />
          <span>Demonstration database reset to default research regulations. Reloading system...</span>
        </div>
      )}

      {/* Demo Mode Badge */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#11162A] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Operational Mode: Frontend Research Demonstrator</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Operating with in-memory linear algebra simulation and browser local state persistence
              </p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
            DEMO MODE ACTIVE
          </span>
        </div>
      </div>

      {/* Data Management Operations */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
        <h3 className="text-base font-bold text-white">Telemetry & Data Backup Operations</h3>
        <p className="mt-1 text-xs text-slate-400">
          Export full research state (documents, ground truth queries, evaluation runs, hyperparameter profiles) or restore initial seed state
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={handleExportFullBackup}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-violet-500"
          >
            <Download size={15} />
            <span>Export Complete Research Snapshot (JSON)</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-semibold text-red-300 hover:bg-red-500/20"
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data to Factory Defaults</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setResetConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#11162A] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-white">Confirm Factory Reset</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              This will clear all uploaded documents, custom ground-truth Q&A entries, and evaluation run records from localStorage, resetting the system to the initial academic research seed dataset.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
