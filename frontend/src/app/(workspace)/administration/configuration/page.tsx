"use client";

import React, { useState } from "react";
import {
  Sliders,
  Cpu,
  Layers,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  useAdminConfig,
  ModelConfiguration,
  DEFAULT_MODEL_CONFIG,
} from "@/lib/rag-admin-storage";

export default function ModelConfigurationPage() {
  const { config, saveConfig, resetConfig } = useAdminConfig();

  const [formData, setFormData] = useState<ModelConfiguration>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    resetConfig();
    setFormData(DEFAULT_MODEL_CONFIG);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Model & Retrieval Configuration"
        subtitle="Calibrate dense embedding dimensions, sublinear TF-IDF parameters, hybrid alpha blending, and autonomous agent loops"
        badge="Engine Hyperparameters"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Model Configuration" },
        ]}
      />

      {/* Save Success Notice */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300">
          <CheckCircle2 size={16} />
          <span>Configuration saved successfully and persisted in local browser telemetry storage.</span>
        </div>
      )}

      {/* Honest Prototype Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs text-amber-200/80">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="leading-relaxed">
          <strong>Demonstration Parameter Tuning:</strong> Changes made here dynamically govern the frontend retrieval simulator (e.g. Hybrid Alpha weighting on the Retrieval Explorer and Explainability pages). When connected to the future FastAPI backend, these settings will be dispatched to the vector database and embedding inference workers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Embedding & Partitioning */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-300">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dense Embedding & Document Partitioning</h3>
              <p className="text-xs text-slate-400">Dense representation model and recursive chunking windows</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Embedding Model</label>
              <select
                value={formData.embeddingModel}
                onChange={(e) => setFormData({ ...formData, embeddingModel: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              >
                <option value="text-embedding-3-small">text-embedding-3-small (Default)</option>
                <option value="text-embedding-3-large">text-embedding-3-large</option>
                <option value="bge-large-en-v1.5">bge-large-en-v1.5 (Open Source)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Embedding Dimensions</label>
              <input
                type="number"
                disabled
                value={formData.embeddingDimensions}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18]/50 px-3.5 py-2.5 text-xs text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-500">Fixed for selected model</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Chunk Size (Tokens)</label>
              <input
                type="number"
                value={formData.chunkSize}
                onChange={(e) => setFormData({ ...formData, chunkSize: parseInt(e.target.value) || 512 })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Chunk Overlap (Tokens)</label>
              <input
                type="number"
                value={formData.chunkOverlap}
                onChange={(e) => setFormData({ ...formData, chunkOverlap: parseInt(e.target.value) || 64 })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hybrid Retrieval & Alpha Fusion */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-300">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hybrid Retrieval & Alpha Weighting</h3>
              <p className="text-xs text-slate-400">Balance foundational keyword precision with dense semantic recall</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-300">Sparse Algorithm</label>
              <select
                value={formData.sparseAlgorithm}
                onChange={(e) => setFormData({ ...formData, sparseAlgorithm: e.target.value as ModelConfiguration["sparseAlgorithm"] })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              >
                <option value="TF-IDF (Sublinear TF)">TF-IDF (Sublinear 1+ln(TF))</option>
                <option value="BM25">BM25 (k1=1.5, b=0.75)</option>
                <option value="Standard TF-IDF">Standard Frequency TF-IDF</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Dense Metric</label>
              <select
                value={formData.denseMetric}
                onChange={(e) => setFormData({ ...formData, denseMetric: e.target.value as ModelConfiguration["denseMetric"] })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              >
                <option value="Cosine Similarity">Cosine Similarity (Normalized)</option>
                <option value="Dot Product">Dot Product</option>
                <option value="Euclidean Distance">Euclidean Distance (L2)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span>Hybrid Balance (α)</span>
                <span className="font-mono text-cyan-400">
                  {formData.hybridAlpha.toFixed(2)} / {(1 - formData.hybridAlpha).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.hybridAlpha}
                onChange={(e) => setFormData({ ...formData, hybridAlpha: parseFloat(e.target.value) })}
                className="mt-3.5 w-full accent-cyan-400"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>0% Dense</span>
                <span>50/50</span>
                <span>100% Sparse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Agentic Reasoning & Generation */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agentic Loop & Generation Parameters</h3>
              <p className="text-xs text-slate-400">Iteration limits, evidence sufficiency cutoffs, and LLM temperature</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Max Agent Iterations</label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.agentMaxIterations}
                onChange={(e) => setFormData({ ...formData, agentMaxIterations: parseInt(e.target.value) || 4 })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Sufficiency Cutoff (θ)</label>
              <input
                type="number"
                min="0.5"
                max="0.99"
                step="0.05"
                value={formData.agentSufficiencyThreshold}
                onChange={(e) => setFormData({ ...formData, agentSufficiencyThreshold: parseFloat(e.target.value) || 0.85 })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Generation Model</label>
              <select
                value={formData.generationModel}
                onChange={(e) => setFormData({ ...formData, generationModel: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Default)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="llama-3-70b">Llama 3 70B (Local Inference)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Temperature (0.0 = Deterministic)</label>
              <input
                type="number"
                min="0.0"
                max="1.0"
                step="0.05"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0.2 })}
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
          >
            <RotateCcw size={14} />
            <span>Restore Defaults</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500"
          >
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
