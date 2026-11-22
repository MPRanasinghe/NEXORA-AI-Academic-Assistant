"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Search,
  FileText,
  Trash2,
  Eye,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  useAdminDocuments,
  AcademicDocument,
} from "@/lib/rag-admin-storage";
import {
  AcademicDocumentListItem,
  AuthApiError,
  getAcademicDocuments,
  uploadAcademicDocument,
  UploadedAcademicDocument,
} from "@/lib/auth-api";

type KnowledgeBaseDocument = Omit<
  AcademicDocument,
  "category" | "chunkCount" | "tokenCount" | "fileSize"
> & {
  category: string;
  chunkCount: number | null;
  tokenCount: number | null;
  fileSize: string;
  isBackendDocument: boolean;
};

function mapBackendDocument(
  document: AcademicDocumentListItem,
  uploadDetails?: { fileSize: string; chunkCount: number },
): KnowledgeBaseDocument {
  const uploadedAt = new Date(document.uploaded_at);
  const status =
    document.status === "processed"
      ? "Indexed"
      : document.status === "ingestion_failed"
        ? "Failed"
        : document.status === "uploaded"
          ? "Uploaded"
          : "Processing";

  return {
    id: `backend-${document.id}`,
    title: document.filename.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
    filename: document.filename,
    fileType: "PDF",
    fileSize: uploadDetails?.fileSize ?? "Stored",
    category: "Not specified",
    status,
    uploadedAt: Number.isNaN(uploadedAt.getTime())
      ? document.uploaded_at
      : uploadedAt.toLocaleString(),
    chunkCount: uploadDetails?.chunkCount ?? null,
    tokenCount: null,
    description: "Uploaded and indexed by the NEXORA backend.",
    metadata: {
      faculty: "Not provided",
      department: "Not provided",
      academicYear: "Not provided",
      version: "Not provided",
      author: "Not provided",
    },
    isBackendDocument: true,
  };
}

function mapLocalDocument(document: AcademicDocument): KnowledgeBaseDocument {
  return {
    ...document,
    isBackendDocument: false,
  };
}

export default function KnowledgeBasePage() {
  const { documents: localDocuments, removeDocument } = useAdminDocuments();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] =
    useState<KnowledgeBaseDocument | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [backendDocuments, setBackendDocuments] = useState<
    KnowledgeBaseDocument[]
  >([]);
  const [documentLoadError, setDocumentLoadError] = useState("");
  const [uploadNotice, setUploadNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  useEffect(() => {
    let active = true;
    getAcademicDocuments()
      .then((items) => {
        if (active) {
          setBackendDocuments(items.map((item) => mapBackendDocument(item)));
          setDocumentLoadError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setDocumentLoadError(
            error instanceof AuthApiError
              ? error.message
              : "Unable to load documents from the backend.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const documents = useMemo(
    () => [
      ...backendDocuments,
      ...localDocuments.map((document) => mapLocalDocument(document)),
    ],
    [backendDocuments, localDocuments],
  );

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

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0 || uploadingRef.current) return;
    if (files.length > 1) {
      setUploadNotice({
        type: "error",
        message: "Upload one PDF at a time.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const file = files[0];
    if (
      !file.name.toLowerCase().endsWith(".pdf") ||
      (file.type && file.type !== "application/pdf")
    ) {
      setUploadNotice({
        type: "error",
        message: "Only PDF files are allowed.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    uploadingRef.current = true;
    setIsUploading(true);
    setUploadNotice(null);

    try {
      const result: UploadedAcademicDocument =
        await uploadAcademicDocument(file);
      const fileSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const uploadedListItem: AcademicDocumentListItem = {
        id: result.document_id,
        filename: result.filename,
        uploaded_at: new Date().toISOString(),
        status: result.status,
      };

      setBackendDocuments((current) => [
        mapBackendDocument(uploadedListItem, {
          fileSize,
          chunkCount: result.ingestion.chunk_count,
        }),
        ...current.filter((document) => document.id !== `backend-${result.document_id}`),
      ]);
      setUploadNotice({
        type: "success",
        message: `${result.message} ${result.ingestion.chunk_count} chunks indexed across ${result.extraction.page_count} pages.`,
      });
      setIsUploadModalOpen(false);

      try {
        const items = await getAcademicDocuments();
        setBackendDocuments(
          items.map((item) =>
            item.id === result.document_id
              ? mapBackendDocument(item, {
                  fileSize,
                  chunkCount: result.ingestion.chunk_count,
                })
              : mapBackendDocument(item),
          ),
        );
        setDocumentLoadError("");
      } catch (error) {
        setDocumentLoadError(
          `Upload succeeded, but the document list could not be refreshed: ${
            error instanceof AuthApiError
              ? error.message
              : "Please refresh the page."
          }`,
        );
      }
    } catch (error) {
      setUploadNotice({
        type: "error",
        message:
          error instanceof AuthApiError
            ? error.message
            : "The PDF could not be uploaded. Please try again.",
      });
    } finally {
      uploadingRef.current = false;
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
            onClick={() => {
              setUploadNotice(null);
              setIsUploadModalOpen(true);
            }}
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
          <strong>Connected document storage:</strong> PDF files are uploaded to the NEXORA backend and indexed for academic retrieval. The backend currently provides filename and ingestion status; additional document metadata is not available here.
        </p>
      </div>

      {documentLoadError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-xs text-amber-100/80"
        >
          {documentLoadError}
        </div>
      )}
      {uploadNotice && !isUploadModalOpen && (
        <div
          role={uploadNotice.type === "error" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-xs ${
            uploadNotice.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-100/80"
              : "border-red-500/20 bg-red-500/[0.05] text-red-100/80"
          }`}
        >
          {uploadNotice.message}
        </div>
      )}

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
                      <p className="font-medium text-white">
                        {doc.chunkCount === null
                          ? "— chunks"
                          : `${doc.chunkCount} chunks`}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {doc.tokenCount === null
                          ? "Token count unavailable"
                          : `~${doc.tokenCount.toLocaleString()} tokens`}
                      </p>
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
                      {!doc.isBackendDocument && (
                        <button
                          onClick={() => setDeleteConfirmId(doc.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Delete document"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
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
          onClick={() => !isUploading && setIsUploadModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Upload Academic PDF
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  The backend will extract the text and index the document for academic retrieval.
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mt-5 space-y-4">
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
                  void handleFiles(e.dataTransfer.files);
                }}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  dragOver
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-white/[0.1] bg-[#080B18]/60 hover:border-violet-500/30 hover:bg-[#080B18]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => void handleFiles(e.target.files)}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                  <Upload size={24} />
                </div>
                <p className="mt-3 text-xs font-semibold text-white">
                  Click to select a PDF or drag and drop
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  PDF files only
                </p>
              </div>

              {isUploading && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 text-xs text-violet-200"
                >
                  <RefreshCw size={14} className="animate-spin" />
                  Uploading PDF and indexing it on the backend…
                </div>
              )}
              {uploadNotice && (
                <div
                  role={uploadNotice.type === "error" ? "alert" : "status"}
                  className={`rounded-xl border px-4 py-3 text-xs ${
                    uploadNotice.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-100/80"
                      : "border-red-500/20 bg-red-500/[0.05] text-red-100/80"
                  }`}
                >
                  {uploadNotice.message}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
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
