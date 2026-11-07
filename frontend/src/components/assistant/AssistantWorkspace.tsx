"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AssistantSidebar from "@/components/assistant/AssistantSidebar";
import {
  AssistantWorkspaceContext,
  type AssistantConversation,
  type AssistantMessage,
  type AssistantProfile,
  type AssistantSource,
  type MessageAttachment,
} from "@/components/assistant/assistant-workspace-context";

export const DEMO_ASSISTANT_PROFILE: AssistantProfile = {
  name: "Methmi Ranasinghe",
  role: "Student Account",
  initials: "MR",
};

const initialConversation: AssistantConversation = {
  id: "nexora-welcome",
  title: "Getting started with NEXORA",
  messages: [],
};

const demoSources: AssistantSource[] = [
  {
    title: "Introduction to Artificial Intelligence",
    category: "Lecture Notes",
    relevance: 94,
  },
  {
    title: "Fundamentals of Machine Learning",
    category: "Academic Resource",
    relevance: 88,
  },
];

function createId() {
  return crypto.randomUUID();
}

function createDemoResponse(question: string, hasAttachments: boolean) {
  const topic = question || "the material you shared";

  return {
    content: `Here is an academic explanation of "${topic}".\n\nThis is a demonstration response from the NEXORA AI Academic Assistant. ${
      hasAttachments
        ? "Your selected attachments are shown in this conversation, but demo mode does not upload or analyze their contents. "
        : ""
    }Once connected, the FastAPI service can coordinate Gemini responses with retrieved university learning resources.\n\nThe connected assistant will provide context-aware explanations, relevant learning materials, and evidence-backed answers with citations.`,
    sources: demoSources,
    confidence: 92,
  };
}

export function AssistantWorkspace({
  children,
  profile,
}: {
  children: ReactNode;
  profile: AssistantProfile;
}) {
  const [conversations, setConversations] = useState<
    AssistantConversation[]
  >([initialConversation]);
  const [activeConversationId, setActiveConversationId] =
    useState(initialConversation.id);
  const [isSending, setIsSending] = useState(false);
  const [explainabilityOpen, setExplainabilityOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sendingRef = useRef(false);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(
    () => () => {
      if (responseTimerRef.current !== null) {
        clearTimeout(responseTimerRef.current);
      }
    },
    [],
  );

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const createNewConversation = useCallback(() => {
    const conversation: AssistantConversation = {
      id: createId(),
      title: "New conversation",
      messages: [],
    };
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setMobileSidebarOpen(false);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setMobileSidebarOpen(false);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      const remaining = conversations.filter(
        (conversation) => conversation.id !== id,
      );
      if (remaining.length === 0) {
        const freshConversation: AssistantConversation = {
          id: createId(),
          title: "New conversation",
          messages: [],
        };
        setConversations([freshConversation]);
        setActiveConversationId(freshConversation.id);
        return;
      }

      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    },
    [activeConversationId, conversations],
  );

  const sendMessage = useCallback(
    async (content: string, attachments: MessageAttachment[]) => {
      const question = content.trim();
      const conversationId = activeConversationId;
      if (
        sendingRef.current ||
        (!question && attachments.length === 0) ||
        !conversations.some(
          (conversation) => conversation.id === conversationId,
        )
      ) {
        return false;
      }

      sendingRef.current = true;
      setIsSending(true);

      const userMessage: AssistantMessage = {
        id: createId(),
        role: "user",
        content: question,
        createdAt: Date.now(),
        attachments,
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                title:
                  conversation.title === "New conversation" ||
                  conversation.title === "Getting started with NEXORA"
                    ? (question || attachments[0]?.name || "Shared materials")
                        .slice(0, 40)
                    : conversation.title,
                messages: [...conversation.messages, userMessage],
              }
            : conversation,
        ),
      );

      await new Promise<void>((resolve) => {
        responseTimerRef.current = setTimeout(resolve, 650);
      });

      const response = createDemoResponse(question, attachments.length > 0);
      const assistantMessage: AssistantMessage = {
        id: createId(),
        role: "assistant",
        content: response.content,
        createdAt: Date.now(),
        sources: response.sources,
        confidence: response.confidence,
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
              }
            : conversation,
        ),
      );
      responseTimerRef.current = null;
      sendingRef.current = false;
      setIsSending(false);
      return true;
    },
    [activeConversationId, conversations],
  );

  const value = useMemo(
    () => ({
      conversations,
      activeConversation,
      activeConversationId,
      isSending,
      explainabilityOpen,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      setExplainabilityOpen,
      createNewConversation,
      selectConversation,
      deleteConversation,
      sendMessage,
    }),
    [
      conversations,
      activeConversation,
      activeConversationId,
      isSending,
      explainabilityOpen,
      mobileSidebarOpen,
      createNewConversation,
      selectConversation,
      deleteConversation,
      sendMessage,
    ],
  );

  return (
    <AssistantWorkspaceContext.Provider value={value}>
      <div className="flex h-dvh min-h-[520px] overflow-hidden bg-[#080B18] text-slate-100">
        <AssistantSidebar profile={profile} />
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Dismiss assistant navigation overlay"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </AssistantWorkspaceContext.Provider>
  );
}
