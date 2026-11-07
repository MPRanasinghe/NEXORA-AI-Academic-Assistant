"use client";

import { createContext, useContext } from "react";

export type AssistantProfile = {
  name: string;
  role: string;
  initials: string;
};

export type AssistantSource = {
  title: string;
  category: string;
  relevance: number;
};

export type MessageAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  kind: "file" | "image";
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
  attachments?: MessageAttachment[];
  sources?: AssistantSource[];
  confidence?: number;
};

export type AssistantConversation = {
  id: string;
  title: string;
  messages: AssistantMessage[];
};

export type AssistantWorkspaceContextValue = {
  conversations: AssistantConversation[];
  activeConversation: AssistantConversation | undefined;
  activeConversationId: string;
  isSending: boolean;
  explainabilityOpen: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  setExplainabilityOpen: (open: boolean) => void;
  createNewConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (
    content: string,
    attachments: MessageAttachment[],
  ) => Promise<boolean>;
};

export const AssistantWorkspaceContext =
  createContext<AssistantWorkspaceContextValue | null>(null);

export function useAssistantWorkspace() {
  const context = useContext(AssistantWorkspaceContext);
  if (!context) {
    throw new Error(
      "useAssistantWorkspace must be used inside AssistantWorkspace.",
    );
  }
  return context;
}
