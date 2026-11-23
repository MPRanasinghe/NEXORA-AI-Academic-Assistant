"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  Eye,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  AuthApiError,
  getAdminUsers,
  type AdminUser,
} from "@/lib/auth-api";

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [inspectUser, setInspectUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await getAdminUsers());
    } catch (caughtError) {
      setUsers([]);
      setError(
        caughtError instanceof AuthApiError
          ? caughtError.message
          : "Unable to load registered users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search);
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

      {/* Database Security Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4 text-xs text-blue-200/80">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-400" />
        <p className="leading-relaxed">
          <strong>Registered accounts:</strong> This directory displays authenticated database users. Password credentials are not included or exposed.
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
            placeholder="Search registered users by name, email, or ID..."
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

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-500/20"
          >
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">User Identity & Email</th>
                <th className="px-6 py-4 font-semibold">Assigned Role</th>
                <th className="px-6 py-4 font-semibold">User ID</th>
                <th className="px-6 py-4 font-semibold">Account Created</th>
                <th className="px-6 py-4 text-right font-semibold">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading registered users...
                  </td>
                </tr>
              )}
              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    {users.length === 0
                      ? "No registered users found."
                      : "No users match the current filters."}
                  </td>
                </tr>
              )}
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
                        <p className="font-semibold text-white">{user.full_name}</p>
                        <p className="font-mono text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleBadge}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
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
                <h3 className="mt-2 text-lg font-bold text-white">{inspectUser.full_name}</h3>
                <p className="text-xs text-slate-400">{inspectUser.email}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Account created {new Date(inspectUser.created_at).toLocaleString()}
                </p>
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
                Account Information
              </h4>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#080B18] px-3.5 py-2.5 text-xs text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Role: {inspectUser.role.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#080B18] px-3.5 py-2.5 text-xs text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>User ID: #{inspectUser.id}</span>
                </div>
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
