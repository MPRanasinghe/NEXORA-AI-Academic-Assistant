"use client";

import {
  ChevronDown,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  type AssistantProfile,
  useAssistantWorkspace,
} from "@/components/assistant/assistant-workspace-context";

export default function AssistantSidebar({
  profile,
}: {
  profile: AssistantProfile;
}) {
  const {
    conversations,
    activeConversationId,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    createNewConversation,
    selectConversation,
    deleteConversation,
  } = useAssistantWorkspace();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const matchingConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-dvh flex-col border-r border-white/[0.08] bg-[#0D1225] shadow-2xl shadow-black/20 transition-all duration-300 lg:static lg:z-auto lg:shadow-none ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${
        collapsed
          ? "w-[76px]"
          : "w-[min(86vw,304px)] lg:w-[292px]"
      }`}
      aria-label="Assistant conversations"
    >
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-white/[0.07] ${
          collapsed ? "justify-center px-3" : "justify-between px-5"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
            <span className="text-xl font-black text-white">N</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-[0.12em] text-white">
                NEXORA
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Academic AI workspace
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close assistant sidebar"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:inline-flex"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="shrink-0 p-3">
        <button
          type="button"
          onClick={createNewConversation}
          title={collapsed ? "New conversation" : undefined}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/10 transition hover:from-violet-500 hover:to-violet-400 ${
            collapsed ? "px-0" : ""
          }`}
        >
          <Plus size={18} />
          {!collapsed && "New conversation"}
        </button>
      </div>

      {!collapsed && (
        <div className="shrink-0 px-3 pb-3">
          <label className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 focus-within:border-violet-500/40">
            <Search size={15} className="shrink-0 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        {!collapsed && (
          <p className="shrink-0 px-5 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recent conversations
          </p>
        )}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {matchingConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center rounded-xl transition ${
                activeConversationId === conversation.id
                  ? "bg-violet-500/10 text-violet-200 ring-1 ring-inset ring-violet-400/10"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <button
                type="button"
                onClick={() => selectConversation(conversation.id)}
                title={collapsed ? conversation.title : undefined}
                aria-current={
                  activeConversationId === conversation.id ? "page" : undefined
                }
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate text-xs font-medium">
                    {conversation.title}
                  </span>
                )}
              </button>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => deleteConversation(conversation.id)}
                  aria-label={`Delete ${conversation.title}`}
                  title="Delete conversation"
                  className="mr-1 rounded-lg p-2 text-slate-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-300 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {matchingConversations.length === 0 && !collapsed && (
            <p className="px-3 py-4 text-xs leading-5 text-slate-500">
              No conversations match your search.
            </p>
          )}
        </nav>
      </div>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-2 px-2 text-[10px] text-slate-500">
            <ShieldCheck size={14} className="shrink-0 text-cyan-400" />
            <span>Demo academic assistant</span>
          </div>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            aria-label="Open account profile and settings"
            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.05] ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-gradient-to-br from-violet-400/25 to-cyan-400/15 text-xs font-semibold text-violet-100">
              {profile.initials}
            </span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-100">
                    {profile.name}
                  </span>
                  <span className="mt-1 block truncate text-[10px] text-slate-500">
                    {profile.role}
                  </span>
                </span>
                <ChevronDown size={15} className="shrink-0 text-slate-500" />
              </>
            )}
          </button>
          {profileOpen && (
            <div
              className={`absolute bottom-full z-50 mb-2 rounded-xl border border-white/[0.09] bg-[#151B31] p-2 shadow-xl ${
                collapsed ? "left-0 w-56" : "inset-x-0"
              }`}
            >
              <div className="px-3 py-2">
                <p className="truncate text-xs font-semibold text-white">
                  {profile.name}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {profile.role}
                </p>
              </div>
              <div className="my-1 border-t border-white/[0.07]" />
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/[0.05]"
              >
                <Settings size={14} />
                Profile &amp; settings
              </button>
              <p className="px-3 pb-1 pt-2 text-[10px] leading-4 text-slate-500">
                Account settings will be provided by your university sign-in.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
