"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Lock,
  Eye,
  Info,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { UserRole } from "@/lib/demo-user";

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  faculty: string;
  status: "Active" | "Restricted";
  lastActive: string;
  permissions: string[];
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "usr-admin-01",
    name: "Dr. Elena Vance (Lead Researcher)",
    email: "admin.rag@university.edu",
    role: "administrator",
    faculty: "Office of the Academic Registrar & AI Research Lab",
    status: "Active",
    lastActive: "Now",
    permissions: [
      "Explainable RAG telemetry inspection",
      "Corpus chunk indexing and deletion",
      "Empirical evaluation benchmark execution",
      "Ground-truth dataset curation",
      "Hyperparameter configuration",
    ],
  },
  {
    id: "usr-staff-01",
    name: "Prof. David Karunaratne",
    email: "staff.computing@university.edu",
    role: "academic_staff",
    faculty: "Faculty of Computing & Information Technology",
    status: "Active",
    lastActive: "12 mins ago",
    permissions: [
      "Quiz management & creation",
      "Course regulation document submission",
      "Student learning insights view",
    ],
  },
  {
    id: "usr-student-01",
    name: "Methmi S. (Undergraduate Researcher)",
    email: "student@university.edu",
    role: "student",
    faculty: "BSc (Hons) Software Engineering",
    status: "Active",
    lastActive: "25 mins ago",
    permissions: [
      "Interactive Academic Assistant queries",
      "Quiz Center assessment attempts",
      "Learning resource library access",
      "Personal study notes management",
    ],
  },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [inspectUser, setInspectUser] = useState<DemoAccount | null>(null);

  const filteredUsers = DEMO_ACCOUNTS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.faculty.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      selectedRole === "All" || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* Header */}
      <AdminPageHeader
        title="User & Role Access Management"
        subtitle="Inspect role-based security boundaries across Student, Academic Staff, and Administrator research partitions"
        badge="Access Control"
        breadcrumbs={[
          { label: "Administration", href: "/administration" },
          { label: "User & Access Management" },
        ]}
      />

      {/* Demo Security Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4 text-xs text-blue-200/80">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-400" />
        <p className="leading-relaxed">
          <strong>Three-Role Role-Based Access Control (RBAC):</strong> The NEXORA platform enforces strict boundary guards: Students are confined to the Learning &amp; Quiz Center, Academic Staff manage assessments and curriculum files, while Administrators oversee the Explainable RAG engine and telemetry. Real credentials and OAuth2 / SAML single sign-on will connect via the future backend.
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
            placeholder="Search demo accounts by name, email, or department..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Role Filter:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Roles</option>
            <option value="administrator">Administrator</option>
            <option value="academic_staff">Academic Staff</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">User Identity & Email</th>
                <th className="px-6 py-4 font-semibold">Assigned Role</th>
                <th className="px-6 py-4 font-semibold">Faculty / Department</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Active</th>
                <th className="px-6 py-4 text-right font-semibold">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => {
                const roleBadge =
                  user.role === "administrator"
                    ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
                    : user.role === "academic_staff"
                    ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                    : "border-violet-400/20 bg-violet-500/10 text-violet-300";

                return (
                  <tr key={user.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="font-mono text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleBadge}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{user.faculty}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        ● {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectUser(user)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Eye size={13} />
                        <span>Inspect Access</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspect Modal */}
      {inspectUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setInspectUser(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 font-mono text-xs text-blue-300">
                  {inspectUser.id}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">{inspectUser.name}</h3>
                <p className="text-xs text-slate-400">{inspectUser.email} · {inspectUser.faculty}</p>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="rounded-lg p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Authorized Platform Capabilities
              </h4>
              <div className="mt-3 space-y-2">
                {inspectUser.permissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#080B18] px-3.5 py-2.5 text-xs text-slate-300"
                  >
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectUser(null)}
                className="rounded-xl bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.1] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
