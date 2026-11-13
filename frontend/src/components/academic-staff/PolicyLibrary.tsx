"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ScrollText,
  Filter,
  Calendar,
  ShieldCheck,
  Eye,
  X,
} from "lucide-react";
import { AcademicPolicy, PolicyCategory } from "@/lib/academic-staff-types";

interface PolicyLibraryProps {
  policies: AcademicPolicy[];
}

export default function PolicyLibrary({ policies }: PolicyLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePolicy, setActivePolicy] = useState<AcademicPolicy | null>(null);

  const categories: (PolicyCategory | "All")[] = [
    "All",
    "Examination Regulations",
    "Assessment Guidelines",
    "Attendance",
    "Degree Requirements",
    "Academic Procedures",
  ];

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesCategory =
        selectedCategory === "All" || policy.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const inTitle = policy.title.toLowerCase().includes(query);
      const inCode = policy.code.toLowerCase().includes(query);
      const inDesc = policy.description.toLowerCase().includes(query);
      const inClauses = policy.clauses.some(
        (c) =>
          c.heading.toLowerCase().includes(query) ||
          c.content.toLowerCase().includes(query) ||
          c.clauseNumber.includes(query)
      );

      return inTitle || inCode || inDesc || inClauses;
    });
  }, [policies, searchTerm, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-6">
      {/* Illustrative Notice & Guardrail Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 text-xs text-emerald-200/90">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" />
        <p className="leading-relaxed">
          <strong>Academic Regulations Reference:</strong> This read-only portal provides
          instructors with immediate access to Senate Academic Regulations, invigilation guidelines,
          attendance requirements, and assessment criteria. These illustrative policies reflect
          standard university guidelines and are synchronized with academic administration
          standards.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search regulations by code, title, or clause keyword..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 transition focus:border-emerald-400/50 focus:outline-none"
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

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-400">
            <Filter size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer max-w-[190px] truncate"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0D1225] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory !== "All") && (
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
          Showing <strong className="text-white">{filteredPolicies.length}</strong> of{" "}
          {policies.length} academic policy documents
        </span>
        <span className="text-[11px] text-slate-500">
          Click Read Policy to inspect full clauses
        </span>
      </div>

      {/* Policy Cards Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#11162A]/50 p-8 text-center">
          <ScrollText size={36} className="text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No Policy Documents Found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            No academic policies match your search term or category filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition duration-200 hover:border-emerald-500/30 hover:bg-[#121A30]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center text-emerald-300 shrink-0 min-w-[74px]">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      Reg Code
                    </span>
                    <span className="block text-sm font-bold font-mono text-white mt-0.5">
                      {policy.code}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white transition group-hover:text-emerald-300">
                        {policy.title}
                      </h3>
                      <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                        {policy.category}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400 max-w-3xl line-clamp-2">
                      {policy.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-500" />
                        Effective: <strong className="text-slate-300">{policy.effectiveSemester}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Last Revised: <strong className="text-slate-300">{policy.lastUpdated}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Contains: <strong className="text-emerald-400">{policy.clauses.length} Key Clauses</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t border-white/[0.06] pt-3 lg:border-t-0 lg:pt-0">
                  <button
                    onClick={() => setActivePolicy(policy)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-emerald-500/10 hover:border-emerald-400/30 hover:text-emerald-300 w-full sm:w-auto justify-center"
                  >
                    <Eye size={14} />
                    <span>Read Policy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Policy Clauses Detail Modal */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/[0.12] bg-[#0D1225] p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
                    {activePolicy.code}
                  </span>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-slate-300">
                    {activePolicy.category}
                  </span>
                  <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-slate-400">
                    Effective {activePolicy.effectiveSemester}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-white sm:text-xl">
                  {activePolicy.title}
                </h2>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {activePolicy.description}
                </p>
              </div>

              <button
                onClick={() => setActivePolicy(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Clauses List */}
            <div className="my-6 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {activePolicy.clauses.map((clause) => (
                <div
                  key={clause.clauseNumber}
                  className="rounded-2xl border border-white/[0.06] bg-[#080B18] p-4 text-xs"
                >
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] border border-emerald-500/20">
                      Clause {clause.clauseNumber}
                    </span>
                    <h4>{clause.heading}</h4>
                  </div>
                  <p className="mt-2 text-slate-300 leading-relaxed text-[13px]">
                    {clause.content}
                  </p>
                </div>
              ))}

              {/* Applicable Roles */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#080B18]/50 p-4 text-xs">
                <span className="font-semibold text-slate-400">
                  Applicable Institutional Roles:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activePolicy.applicableRoles.map((role) => (
                    <span
                      key={role}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
              <span className="text-[11px] text-slate-500">
                Official Senate Policy Guideline · University Academic Affairs
              </span>
              <button
                onClick={() => setActivePolicy(null)}
                className="rounded-xl bg-white/[0.08] px-5 py-2 font-semibold text-white transition hover:bg-white/[0.14]"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
