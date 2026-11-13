
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Search,
  Bell,
  UserRound,
} from "lucide-react";
import type { UserRole } from "@/lib/demo-user";
import { ROLE_META } from "@/lib/demo-user";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assistant": "AI Assistant",
  "/learning": "Learning",
  "/courses": "My Courses",
  "/quizzes": "Quizzes",
  "/quiz-management": "Quiz Management",
  "/notes": "Notes",
  "/academic": "Academic Progress",
  "/administration": "Explainable RAG Overview",
  "/administration/knowledge-base": "Knowledge Base Management",
  "/administration/corpus": "Corpus & Mathematical Explorer",
  "/administration/document-processing": "Document Processing Pipeline",
  "/administration/retrieval": "Retrieval Explorer & Ranking",
  "/administration/explainability": "Mathematical Explainability",
  "/administration/agent-monitor": "Agent Execution Monitor",
  "/administration/evaluation": "RAG Evaluation Center",
  "/administration/dataset": "Ground Truth Dataset",
  "/administration/analytics": "Research Analytics & Telemetry",
  "/administration/configuration": "Model & Retrieval Configuration",
  "/administration/settings": "System Settings",
  "/administration/users": "User & Access Management",
  "/settings": "Settings",
};

interface WorkspaceHeaderProps {
  role?: UserRole;
}

export default function WorkspaceHeader({ role }: WorkspaceHeaderProps) {
  const pathname = usePathname();

  const currentTitle =
    (pathname.startsWith("/courses/")
      ? pathname.endsWith("/materials")
        ? "Course Materials"
        : "Course Details"
      : pageTitles[pathname]) ??
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(`${path}/`)
    )?.[1] ??
    "Workspace";

  const roleMeta = role ? ROLE_META[role] : null;

  // Role pill colours
  const rolePillClass: Record<UserRole, string> = {
    student: "border-violet-400/20 bg-violet-500/10 text-violet-300",
    academic_staff: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
    administrator: "border-blue-400/20 bg-blue-500/10 text-blue-300",
  };

  return (
    <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-white/[0.08] bg-[#080B18]/80 px-5 backdrop-blur-2xl sm:px-8">
      {/* Branding and Page Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-bold tracking-[0.15em] text-white sm:text-base"
        >
          NEXORA
        </Link>

        <ChevronRight
          size={16}
          className="text-slate-600"
        />

        <h1 className="text-sm font-semibold text-violet-300 sm:text-base">
          {currentTitle}
        </h1>

        {/* Role badge */}
        {roleMeta && role && (
          <span
            className={`hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex ${rolePillClass[role]}`}
          >
            {roleMeta.label}
          </span>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <button
          aria-label="Search"
          title="Search"
          onClick={() => alert("Search functionality coming soon.")}
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          title="Notifications"
          onClick={() => alert("Notifications coming soon.")}
          className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-[#080B18]" />
        </button>

        {/* User Profile */}
        <button
          aria-label="User profile"
          title="User profile"
          onClick={() => alert("User profile coming soon.")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-300 transition hover:border-violet-400/30"
        >
          <UserRound size={19} />
        </button>
      </div>
    </header>
  );
}
