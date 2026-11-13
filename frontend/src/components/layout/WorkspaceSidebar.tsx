"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  NotebookPen,
  GraduationCap,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronRight,
  Database,
  Layers,
  Cpu,
  SearchCode,
  Binary,
  Activity,
  CheckCircle2,
  BookOpenCheck,
  LineChart,
  Sliders,
  Users,
} from "lucide-react";

import type { UserRole } from "@/lib/demo-user";
import { ROLE_META } from "@/lib/demo-user";
import { useDemoAuth } from "@/lib/demo-auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType | null;
  section?: string;
}

interface WorkspaceSidebarProps {
  role?: UserRole;
}

export default function WorkspaceSidebar({
  role = "student",
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useDemoAuth();

  const dashboardNavigation: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "AI Assistant",
      href: "/assistant",
      icon: null,
    },
  ];

  const roleNavigation: Record<UserRole, NavItem[]> = {
    student: [
      ...dashboardNavigation,
      {
        label: "Learning",
        href: "/learning",
        icon: BookOpen,
      },
      {
        label: "Courses",
        href: "/courses",
        icon: BookOpenCheck,
      },
      {
        label: "Quiz Center",
        href: "/quizzes",
        icon: ClipboardList,
      },
      {
        label: "Notes",
        href: "/notes",
        icon: NotebookPen,
      },
      {
        label: "Academic Progress",
        href: "/academic",
        icon: GraduationCap,
      },
    ],
    academic_staff: [
      ...dashboardNavigation,
      {
        label: "Quiz Management",
        href: "/quiz-management",
        icon: ClipboardList,
      },
      {
        label: "Academic Services",
        href: "/academic",
        icon: GraduationCap,
      },
    ],
    administrator: [
      // MAIN
      {
        section: "MAIN",
        label: "Overview",
        href: "/administration",
        icon: LayoutDashboard,
      },
      {
        section: "MAIN",
        label: "AI Research Assistant",
        href: "/assistant",
        icon: null,
      },
      // KNOWLEDGE INFRASTRUCTURE
      {
        section: "KNOWLEDGE INFRASTRUCTURE",
        label: "Knowledge Base",
        href: "/administration/knowledge-base",
        icon: Database,
      },
      {
        section: "KNOWLEDGE INFRASTRUCTURE",
        label: "Corpus Explorer",
        href: "/administration/corpus",
        icon: Layers,
      },
      {
        section: "KNOWLEDGE INFRASTRUCTURE",
        label: "Document Processing",
        href: "/administration/document-processing",
        icon: Cpu,
      },
      // INTELLIGENCE
      {
        section: "INTELLIGENCE",
        label: "Retrieval Explorer",
        href: "/administration/retrieval",
        icon: SearchCode,
      },
      {
        section: "INTELLIGENCE",
        label: "Explainability",
        href: "/administration/explainability",
        icon: Binary,
      },
      {
        section: "INTELLIGENCE",
        label: "Agent Monitor",
        href: "/administration/agent-monitor",
        icon: Activity,
      },
      // EVALUATION
      {
        section: "EVALUATION",
        label: "Evaluation Center",
        href: "/administration/evaluation",
        icon: CheckCircle2,
      },
      {
        section: "EVALUATION",
        label: "Ground Truth Dataset",
        href: "/administration/dataset",
        icon: BookOpenCheck,
      },
      {
        section: "EVALUATION",
        label: "Analytics & Reports",
        href: "/administration/analytics",
        icon: LineChart,
      },
      // SYSTEM
      {
        section: "SYSTEM",
        label: "Model Configuration",
        href: "/administration/configuration",
        icon: Sliders,
      },
      {
        section: "SYSTEM",
        label: "System Settings",
        href: "/administration/settings",
        icon: Settings,
      },
      {
        section: "SYSTEM",
        label: "User & Access Management",
        href: "/administration/users",
        icon: Users,
      },
    ],
  };

  const navigation = roleNavigation[role];
  const roleMeta = ROLE_META[role];

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/administration") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Role accent colours
  const roleAccents: Record<UserRole, { dot: string; label: string }> = {
    student: { dot: "bg-violet-400", label: "text-violet-300" },
    academic_staff: { dot: "bg-cyan-400", label: "text-cyan-300" },
    administrator: { dot: "bg-blue-400", label: "text-blue-300" },
  };
  const accent = roleAccents[role];

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-white/[0.08] bg-[#0D1225] transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      {/* Branding */}
      <div
        className={`flex h-[84px] items-center border-b border-white/[0.08] ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        <Link href={role === "administrator" ? "/administration" : "/dashboard"} className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <span className="text-xl font-black text-white">N</span>
            </div>

            {!collapsed && (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold tracking-wide text-white">
                  NEXORA
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Collapse Button */}
      <div
        className={`flex py-3 ${
          collapsed ? "justify-center" : "justify-end px-4"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Role badge (expanded only) */}
      {!collapsed && (
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
          <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${accent.label}`}>
            {roleMeta.label}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {!collapsed && role !== "administrator" && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
        )}

        {navigation.map((item, index) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const isAssistant = item.href === "/assistant";

          // Section header if in administrator mode
          const showSection =
            role === "administrator" &&
            item.section &&
            (index === 0 || navigation[index - 1]?.section !== item.section);

          return (
            <div key={item.href}>
              {showSection && !collapsed && (
                <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.section}
                </p>
              )}

              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.15)]"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {/* AI Assistant NEXORA Icon */}
                {isAssistant ? (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
                    <span className="text-[11px] font-black leading-none text-white">
                      N
                    </span>
                  </div>
                ) : (
                  Icon && (
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        active
                          ? "text-violet-400"
                          : "group-hover:text-cyan-300"
                      }`}
                    />
                  )
                )}

                {!collapsed && (
                  <>
                    <span className="flex-1 text-xs font-medium">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={14}
                        className="text-violet-400"
                      />
                    )}
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 border-t border-white/[0.08] p-3">
        <Link
          href={role === "administrator" ? "/administration/settings" : "/settings"}
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 transition hover:bg-white/[0.05] hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings size={18} className="shrink-0" />

          {!collapsed && (
            <span className="text-xs font-medium">Settings</span>
          )}
        </Link>

        <button
          title={collapsed ? "Sign out" : undefined}
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />

          {!collapsed && (
            <span className="text-xs font-medium">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
