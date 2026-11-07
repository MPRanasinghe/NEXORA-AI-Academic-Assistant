"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Database,
  Upload,
  Search,
  Filter,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info,
  X,
  RefreshCw,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  useAdminDocuments,
  AcademicDocument,
  DocumentCategory,
  DocumentStatus,
} from "@/lib/rag-admin-storage";

export default function KnowledgeBasePage() {
  const { documents, addDocument, removeDocument, updateDocumentStatus } =
    useAdminDocuments();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] = useState<AcademicDocument | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Upload modal & simulation states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>("Academic Regulations");
  const [uploadFaculty, setUploadFaculty] = useState("Academic Affairs");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.filename.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase());

      const matchCat =
        selectedCategory === "All" || doc.category === selectedCategory;

      const matchStatus =
        selectedStatus === "All" || doc.status === selectedStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [documents, search, selectedCategory, selectedStatus]);

  // Handle file selection and simulated ingest
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split(".").pop()?.toUpperCase();
    const validExtensions = ["PDF", "TXT", "DOCX", "MD"];

    const fileType = (
      validExtensions.includes(extension || "") ? extension : "PDF"
    ) as AcademicDocument["fileType"];

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setUploadProgress(15);

    const newDocId = `doc-${Date.now().toString().slice(-4)}`;
    const newDoc: AcademicDocument = {
      id: newDocId,
      title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      filename: file.name,
      fileType,
      fileSize: sizeFormatted,
      category: uploadCategory,
      status: "Processing",
      uploadedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      chunkCount: Math.max(6, Math.floor(file.size / 60000)),
      tokenCount: Math.max(3000, Math.floor(file.size / 100)),
      description: `Uploaded academic repository document under ${uploadCategory}. Ingested for vector representation.`,
      metadata: {
        faculty: uploadFaculty,
        department: "Undergraduate Studies",
        academicYear: "2025/2026",
        version: "v1.0",
        author: "Academic Administrator",
      },
    };

    // Simulate multi-stage ingestion progress
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev < 90) return prev + 25;
        clearInterval(timer);
        addDocument(newDoc);
        setTimeout(() => {
          updateDocumentStatus(newDocId, "Indexed");
        }, 1200);
        setUploadProgress(null);
        setIsUploadModalOpen(false);
        return null;
      });
    }, 400);
  };

  const handleDelete = (id: string) => {
    removeDocument(id);
    setDeleteConfirmId(null);
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="Knowledge Base Repository"
        subtitle="Manage, inspect, and ingest university regulations, course catalogs, and academic policies for Vector Space representation"
        badge="Corpus Infrastructure"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "Knowledge Base" },
        ]}
        actions={
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            <Upload size={15} />
            <span>Upload Academic Document</span>
          </button>
        }
      />

      {/* Honest Architecture & Storage Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs text-amber-200/80">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="leading-relaxed">
          <strong>Demonstration Storage Architecture:</strong> In this frontend prototype, document metadata and representative vector records are persisted safely in the browser&apos;s <code className="rounded bg-black/40 px-1 py-0.5 text-amber-300">localStorage</code>. When connected to the future FastAPI backend, files will stream to an S3/MinIO bucket and trigger asynchronous PyPDF/Unstructured chunking pipelines.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search academic documents, regulations, policies..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              <option value="All">All Categories</option>
              <option value="Academic Regulations">Academic Regulations</option>
              <option value="Curriculum & Syllabi">Curriculum & Syllabi</option>
              <option value="Degree Requirements">Degree Requirements</option>
              <option value="Examination & Grading">Examination & Grading</option>
              <option value="Student Policies">Student Policies</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              <option value="All">All Statuses</option>
              <option value="Indexed">Indexed</option>
              <option value="Processing">Processing</option>
              <option value="Uploaded">Uploaded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Document Title & Filename</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Chunks & Tokens</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Uploaded</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{doc.title}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {doc.filename} · {doc.fileSize} · {doc.fileType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[11px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div>
                      <p className="font-medium text-white">{doc.chunkCount} chunks</p>
                      <p className="text-[11px] text-slate-500">~{doc.tokenCount.toLocaleString()} tokens</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                    {doc.uploadedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                        title="View details & metadata"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete document"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No academic documents matching your search or filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Details Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-300">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
                  <p className="font-mono text-xs text-slate-400">{selectedDoc.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-300">
              {selectedDoc.description}
            </p>

            {/* Metadata Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Category</span>
                <p className="mt-1 font-semibold text-slate-200 text-xs">{selectedDoc.category}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Status</span>
                <div className="mt-1"><StatusBadge status={selectedDoc.status} /></div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Vector Chunks</span>
                <p className="mt-1 font-semibold text-slate-200 text-xs">{selectedDoc.chunkCount} partitions</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Faculty/Division</span>
                <p className="mt-1 font-semibold text-slate-200 text-xs">{selectedDoc.metadata.faculty}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Academic Year</span>
                <p className="mt-1 font-semibold text-slate-200 text-xs">{selectedDoc.metadata.academicYear}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500">Version</span>
                <p className="mt-1 font-semibold text-slate-200 text-xs">{selectedDoc.metadata.version}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-xl bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.1] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#11162A] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-white">Delete Document Record?</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Are you sure you want to remove this academic document from the demonstration index? Associated chunks and term frequency indexes will be unlinked.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Academic Document Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => !uploadProgress && setIsUploadModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Upload Academic Policy Document</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Select PDF, TXT, DOCX, or Markdown files for demonstration text extraction and chunking
                </p>
              </div>
              {!uploadProgress && (
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Policy Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                  disabled={uploadProgress !== null}
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                >
                  <option value="Academic Regulations">Academic Regulations</option>
                  <option value="Curriculum & Syllabi">Curriculum & Syllabi</option>
                  <option value="Degree Requirements">Degree Requirements</option>
                  <option value="Examination & Grading">Examination & Grading</option>
                  <option value="Student Policies">Student Policies</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Faculty / Governing Body</label>
                <input
                  type="text"
                  value={uploadFaculty}
                  onChange={(e) => setUploadFaculty(e.target.value)}
                  disabled={uploadProgress !== null}
                  placeholder="e.g. Faculty of Computing, Senate Affairs"
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#080B18] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => !uploadProgress && fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  dragOver
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-white/[0.1] bg-[#080B18]/60 hover:border-violet-500/30 hover:bg-[#080B18]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,.docx,.md"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                  <Upload size={24} />
                </div>
                <p className="mt-3 text-xs font-semibold text-white">
                  Click to select academic document or drag and drop
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Supports PDF, DOCX, TXT, MD up to 25MB
                </p>
              </div>

              {/* Upload Progress Simulation */}
              {uploadProgress !== null && (
                <div className="space-y-2 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-violet-300">
                      Processing: Chunking & Sparse Indexing...
                    </span>
                    <span className="text-white font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={uploadProgress !== null}
                className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
