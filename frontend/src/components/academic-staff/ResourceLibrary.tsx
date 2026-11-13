"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FolderGit2,
  Filter,
  BookOpen,
  Eye,
  X,
  Info,
} from "lucide-react";
import { StaffCourseResource } from "@/lib/academic-staff-types";

interface ResourceLibraryProps {
  resources: StaffCourseResource[];
}

export default function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [previewResource, setPreviewResource] =
    useState<StaffCourseResource | null>(null);

  // Extract unique course codes
  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();
    resources.forEach((r) => map.set(r.courseCode, r.courseCode));
    return ["All", ...Array.from(map.keys())];
  }, [resources]);

  // Extract unique resource types
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => set.add(r.type));
    return ["All", ...Array.from(set)];
  }, [resources]);

  // Filtered list
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        res.title.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        res.courseCode.toLowerCase().includes(query) ||
        res.courseTitle.toLowerCase().includes(query);

      const matchesCourse =
        selectedCourse === "All" || res.courseCode === selectedCourse;
      const matchesType = selectedType === "All" || res.type === selectedType;

      return matchesSearch && matchesCourse && matchesType;
    });
  }, [resources, searchTerm, selectedCourse, selectedType]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCourse("All");
    setSelectedType("All");
  };

  return (
    <div className="space-y-6">
      {/* Read-only repository notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 text-xs text-cyan-200/90">
        <Info size={16} className="mt-0.5 shrink-0 text-cyan-400" />
        <p className="leading-relaxed">
          <strong>Curated Teaching Resources:</strong> This library provides a centralized,
          read-only view of course instructional assets, lecture slides, and laboratory exercise
          sheets across your assigned modules. In this phase, file uploads are restricted to
          approved curriculum management pipelines.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources by title, keyword, or course code..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-400">
            <BookOpen size={13} className="text-cyan-400" />
            <span className="hidden sm:inline">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {courseOptions.map((c) => (
                <option key={c} value={c} className="bg-[#0D1225] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-400">
            <Filter size={13} className="text-violet-400" />
            <span className="hidden sm:inline">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t} className="bg-[#0D1225] text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCourse !== "All" || selectedType !== "All") && (
            <button
              onClick={handleResetFilters}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredResources.length}</strong> of{" "}
          {resources.length} teaching resources
        </span>
        <span className="text-[11px] text-slate-500">
          Click Preview to view document contents
        </span>
      </div>

      {/* Grid of Resources */}
      {filteredResources.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#11162A]/50 p-8 text-center">
          <FolderGit2 size={36} className="text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No Resources Found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            No teaching materials match your active search or filter filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-violet-600/20 border border-violet-500/30 px-4 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition duration-200 hover:border-cyan-500/30 hover:bg-[#131933]"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                    {res.courseCode}
                  </span>
                  <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    {res.type}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-white transition group-hover:text-cyan-300 line-clamp-2">
                  {res.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {res.description}
                </p>
              </div>

              {/* Footer info and preview button */}
              <div className="mt-5 border-t border-white/[0.06] pt-3.5 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500 font-mono">
                  <span>{res.fileSize}</span>
                  <span className="mx-1.5">•</span>
                  <span>{res.dateAdded}</span>
                </div>

                <button
                  onClick={() => setPreviewResource(res)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-cyan-500/10 hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Preview Modal */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0D1225] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                    {previewResource.type}
                  </span>
                  <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-violet-300">
                    {previewResource.courseCode}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-white">
                  {previewResource.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {previewResource.courseTitle}
                </p>
              </div>

              <button
                onClick={() => setPreviewResource(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-5 max-h-[350px] overflow-y-auto rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {previewResource.previewContent ||
                `File Name: ${previewResource.fileName || "N/A"}\nFile Size: ${previewResource.fileSize}\nDate Added: ${previewResource.dateAdded}\n\n[Demonstration preview of course teaching resource content for ${previewResource.courseCode}]`}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
              <span className="text-[11px] text-slate-500">
                Read-only instructional preview · NEXORA Academic Services
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="rounded-xl bg-white/[0.06] px-4 py-2 font-medium text-white hover:bg-white/[0.1]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
