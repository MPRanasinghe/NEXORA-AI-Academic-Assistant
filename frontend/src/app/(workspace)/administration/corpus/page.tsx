"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Search,
  Filter,
  FileText,
  Binary,
  Code2,
  ChevronRight,
  Info,
  Hash,
  Eye,
  BookOpen,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  useAdminDocuments,
  getStoredChunks,
  DocumentChunk,
} from "@/lib/rag-admin-storage";

export default function CorpusExplorerPage() {
  const { documents } = useAdminDocuments();
  const allChunks = useMemo(() => getStoredChunks(), []);

  const [search, setSearch] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string>("All");
  const [activeChunk, setActiveChunk] = useState<DocumentChunk | null>(allChunks[0] || null);

  const filteredChunks = useMemo(() => {
    return allChunks.filter((chunk) => {
      const matchSearch =
        chunk.text.toLowerCase().includes(search.toLowerCase()) ||
        chunk.section.toLowerCase().includes(search.toLowerCase()) ||
        chunk.id.toLowerCase().includes(search.toLowerCase());

      const matchDoc =
        selectedDocId === "All" || chunk.documentId === selectedDocId;

      return matchSearch && matchDoc;
    });
  }, [allChunks, search, selectedDocId]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Corpus & Vector Chunk Explorer"
        subtitle="Deconstruct the underlying academic corpus into 512-token partitions, term-frequency distributions, and dense latent representations"
        badge="Foundational Mathematics"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Corpus Explorer" },
        ]}
      />

      {/* Mathematical Explainability Callout */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-[#11162A] to-cyan-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-500/20 p-2 text-violet-300">
            <Hash size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Demystifying the Black Box: Term-Document Matrix
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Each academic regulation is parsed into discrete vector representations. Below, inspect the exact Term Frequency (TF) bag-of-words histograms alongside 768-dimensional dense vector embeddings that power hybrid similarity calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Document Selector */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chunk text, regulatory clauses, terms, or chunk IDs..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Source Document:</span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="max-w-[280px] rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Ingested Documents</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split: Chunks List vs Chunk Mathematical Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Chunks List (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredChunks.length} partitioned chunks</span>
            <span>Click chunk to inspect math</span>
          </div>

          <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
            {filteredChunks.map((chunk) => {
              const isSelected = activeChunk?.id === chunk.id;

              return (
                <div
                  key={chunk.id}
                  onClick={() => setActiveChunk(chunk)}
                  className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                      : "border-white/[0.06] bg-[#11162A] hover:border-white/[0.12] hover:bg-[#141A30]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-violet-300">
                      {chunk.id}
                    </span>
                    <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">
                      {chunk.tokenCount} tokens
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-white">
                    {chunk.section}
                  </p>

                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-400">
                    {chunk.text}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[200px]">{chunk.documentTitle}</span>
                    <span className="text-violet-400 group-hover:underline">Inspect →</span>
                  </div>
                </div>
              );
            })}

            {filteredChunks.length === 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-[#11162A] py-12 text-center text-xs text-slate-500">
                No chunks matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Chunk Details & Mathematical Inspector (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {activeChunk ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-300">
                    {activeChunk.id} · Index Partition #{activeChunk.chunkIndex}
                  </span>
                  <h3 className="mt-2.5 text-lg font-bold text-white">
                    {activeChunk.section}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Source: {activeChunk.documentTitle}
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                    {activeChunk.tokenCount} Tokens
                  </span>
                </div>
              </div>

              {/* Verbatim Chunk Text */}
              <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs leading-relaxed text-slate-200">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Verbatim Partition Content
                </p>
                {activeChunk.text}
              </div>

              {/* Term Frequency Matrix Display */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Sparse Term-Frequency Histogram (tf(t, d))
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Frequency of salient tokens within this 512-token partition
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(activeChunk.termFrequencies).map(([term, count]) => (
                    <div
                      key={term}
                      className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs"
                    >
                      <span className="font-mono text-violet-300">{term}</span>
                      <span className="rounded-full bg-violet-400/20 px-1.5 py-0.2 text-[10px] font-bold text-violet-200">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dense Embedding Vector Representation */}
              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Dense Embedding Latent Vector Representation
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      768-dimensional normalized unit vector preview: text-embedding-3-small
                    </p>
                  </div>
                  <span className="font-mono text-xs text-cyan-400">
                    ||d|| = {activeChunk.magnitude.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#080B18] p-3.5 font-mono text-xs text-cyan-300">
                  <span className="text-slate-500">[ </span>
                  {activeChunk.denseEmbeddingPreview.map((v, i) => (
                    <span key={i} className="mr-2">
                      {v.toFixed(3)}
                      {i < activeChunk.denseEmbeddingPreview.length - 1 ? "," : ""}
                    </span>
                  ))}
                  <span className="text-slate-500">... +760 dimensions ]</span>
                </div>
              </div>

              {/* Research VSM Context Note */}
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 text-[11px] text-slate-400">
                <Info size={15} className="mt-0.5 shrink-0 text-violet-400" />
                <p>
                  In the Vector Space Model (Salton et al.), this chunk is positioned as an orthogonal axis in hyper-dimensional space. During retrieval, the dot product between the query vector and this document vector measures angular affinity.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#11162A] text-xs text-slate-500">
              Select a chunk from the list to inspect mathematical properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
