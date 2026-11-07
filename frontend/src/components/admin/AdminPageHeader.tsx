"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, RefreshCw, Sparkles, BookOpen } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs?: Breadcrumb[];
  lastUpdated?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  badge = "Explainable Agentic RAG",
  breadcrumbs = [{ label: "Administration", href: "/administration" }],
  lastUpdated,
  onRefresh,
  isRefreshing = false,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#11162A]/90 via-[#0D1225] to-[#171D35]/80 p-6 backdrop-blur-xl sm:p-8">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-48 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight size={12} className="text-slate-600" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition hover:text-violet-300 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-300 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Research Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Sparkles size={13} className="text-violet-400" />
            <span>{badge}</span>
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            <span className="text-[11px] text-cyan-300">Higher Education Domain</span>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Actions & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <div className="hidden text-right text-xs text-slate-500 xl:block">
              <p>System Status: Active</p>
              <p className="mt-0.5">Updated: {lastUpdated}</p>
            </div>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin text-cyan-400" : "text-slate-400"}
              />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          )}

          {actions}
        </div>
      </div>
    </div>
  );
}
