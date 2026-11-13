"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
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

const ASSISTANT_STORAGE_PREFIX = "nexora-assistant-conversations";
const ASSISTANT_STORAGE_EVENT = "nexora-assistant-conversations-changed";
const EMPTY_WORKSPACE_SNAPSHOT = "";

const initialConversation: AssistantConversation = {
  id: "nexora-welcome",
  title: "Getting started with NEXORA",
  messages: [],
};

type AssistantWorkspaceData = {
  conversations: AssistantConversation[];
  activeConversationId: string;
};

const initialWorkspaceData: AssistantWorkspaceData = {
  conversations: [initialConversation],
  activeConversationId: initialConversation.id,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAssistantMessage(value: unknown): AssistantMessage | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    (value.role !== "user" && value.role !== "assistant") ||
    typeof value.content !== "string"
  ) {
    return null;
  }

  const message: AssistantMessage = {
    id: value.id,
    role: value.role,
    content: value.content,
  };
  if ("createdAt" in value) {
    if (!Number.isFinite(value.createdAt)) return null;
    message.createdAt = Number(value.createdAt);
  }
  if ("attachments" in value) {
    if (!Array.isArray(value.attachments)) return null;
    const attachments: MessageAttachment[] = [];
    for (const attachment of value.attachments) {
      if (
        !isRecord(attachment) ||
        typeof attachment.id !== "string" ||
        typeof attachment.name !== "string" ||
        !Number.isFinite(attachment.size) ||
        typeof attachment.type !== "string" ||
        (attachment.kind !== "file" && attachment.kind !== "image")
      ) {
        return null;
      }
      attachments.push({
        id: attachment.id,
        name: attachment.name,
        size: Number(attachment.size),
        type: attachment.type,
        kind: attachment.kind,
      });
    }
    message.attachments = attachments;
  }
  if ("sources" in value) {
    if (!Array.isArray(value.sources)) return null;
    const sources: AssistantSource[] = [];
    for (const source of value.sources) {
      if (
        !isRecord(source) ||
        typeof source.title !== "string" ||
        typeof source.category !== "string" ||
        !Number.isFinite(source.relevance)
      ) {
        return null;
      }
      sources.push({
        title: source.title,
        category: source.category,
        relevance: Number(source.relevance),
      });
    }
    message.sources = sources;
  }
  if ("confidence" in value) {
    if (!Number.isFinite(value.confidence)) return null;
    message.confidence = Number(value.confidence);
  }
  return message;
}

function parseSavedConversations(value: unknown): {
  conversations: AssistantConversation[];
  activeConversationId: string;
} | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("conversations" in value) ||
    !Array.isArray(value.conversations) ||
    !("activeConversationId" in value) ||
    typeof value.activeConversationId !== "string"
  ) {
    return null;
  }

  const conversations: AssistantConversation[] = [];
  for (const conversation of value.conversations) {
    if (
      !isRecord(conversation) ||
      typeof conversation.id !== "string" ||
      typeof conversation.title !== "string" ||
      !Array.isArray(conversation.messages)
    ) {
      return null;
    }

    const messages: AssistantMessage[] = [];
    for (const message of conversation.messages) {
      const parsedMessage = parseAssistantMessage(message);
      if (!parsedMessage) return null;
      messages.push(parsedMessage);
    }
    conversations.push({
      id: conversation.id,
      title: conversation.title,
      messages,
    });
  }

  if (conversations.length === 0) return null;
  return {
    conversations,
    activeConversationId: conversations.some(
      (conversation) => conversation.id === value.activeConversationId,
    )
      ? value.activeConversationId
      : conversations[0].id,
  };
}

function getAssistantSnapshot(storageKey: string) {
  if (typeof window === "undefined") return EMPTY_WORKSPACE_SNAPSHOT;
  try {
    return window.localStorage.getItem(storageKey) ?? EMPTY_WORKSPACE_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read assistant conversations:", error);
    return EMPTY_WORKSPACE_SNAPSHOT;
  }
}

function subscribeToAssistantStorage(storageKey: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(ASSISTANT_STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ASSISTANT_STORAGE_EVENT, callback);
  };
}

function useAssistantWorkspaceData(storageKey: string) {
  const snapshot = useSyncExternalStore(
    (callback) => subscribeToAssistantStorage(storageKey, callback),
    () => getAssistantSnapshot(storageKey),
    () => EMPTY_WORKSPACE_SNAPSHOT,
  );
  return useMemo(() => {
    if (!snapshot) return initialWorkspaceData;
    try {
      return (
        parseSavedConversations(JSON.parse(snapshot)) ?? initialWorkspaceData
      );
    } catch (error) {
      console.error("Failed to parse assistant conversations:", error);
      return initialWorkspaceData;
    }
  }, [snapshot]);
}

function createDemoResponse(question: string, hasAttachments: boolean) {
  const topic = question || "the material you shared";

  return {
    content: `Here is an academic explanation of "${topic}".\n\nThis is a demonstration response from the NEXORA AI Academic Assistant. ${
      hasAttachments
        ? "Your selected attachments are shown in this conversation, but demo mode does not upload or analyze their contents. "
        : ""
    }The displayed source cards are illustrative examples, not retrieved or verified university references. Once connected, the FastAPI service can coordinate Gemini responses with retrieved learning resources and evidence-backed citations.`,
    sources: demoSources,
    confidence: 92,
  };
}

export function AssistantWorkspace({
  children,
  profile,
  storageId,
  settingsHref,
}: {
  children: ReactNode;
  profile: AssistantProfile;
  storageId: string;
  settingsHref: string;
}) {
  const storageKey = `${ASSISTANT_STORAGE_PREFIX}:${encodeURIComponent(storageId)}`;
  const { conversations, activeConversationId } =
    useAssistantWorkspaceData(storageKey);
  const [isSending, setIsSending] = useState(false);
  const [explainabilityOpen, setExplainabilityOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
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

  const updateWorkspace = useCallback(
    (
      update: (
        current: AssistantWorkspaceData,
      ) => AssistantWorkspaceData,
    ) => {
      try {
        const raw = getAssistantSnapshot(storageKey);
        const current = raw
          ? parseSavedConversations(JSON.parse(raw)) ?? initialWorkspaceData
          : initialWorkspaceData;
        const next = update(current);
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        window.dispatchEvent(new Event(ASSISTANT_STORAGE_EVENT));
        setStorageError("");
        return true;
      } catch (error) {
        console.error("Failed to save assistant conversations:", error);
        setStorageError(
          "Assistant conversations could not be saved in this browser.",
        );
        return false;
      }
    },
    [storageKey],
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
    if (
      updateWorkspace((current) => ({
        conversations: [conversation, ...current.conversations],
        activeConversationId: conversation.id,
      }))
    ) {
      setMobileSidebarOpen(false);
    }
  }, [updateWorkspace]);

  const selectConversation = useCallback(
    (id: string) => {
      if (
        updateWorkspace((current) => ({
          ...current,
          activeConversationId: id,
        }))
      ) {
        setMobileSidebarOpen(false);
      }
    },
    [updateWorkspace],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      updateWorkspace((current) => {
        const remaining = current.conversations.filter(
          (conversation) => conversation.id !== id,
        );
        if (remaining.length === 0) {
          const freshConversation: AssistantConversation = {
            id: createId(),
            title: "New conversation",
            messages: [],
          };
          return {
            conversations: [freshConversation],
            activeConversationId: freshConversation.id,
          };
        }
        return {
          conversations: remaining,
          activeConversationId:
            current.activeConversationId === id
              ? remaining[0].id
              : current.activeConversationId,
        };
      });
    },
    [updateWorkspace],
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

      const messageSaved = updateWorkspace((current) => ({
        ...current,
        conversations: current.conversations.map((conversation) =>
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
      }));
      if (!messageSaved) {
        sendingRef.current = false;
        setIsSending(false);
        return false;
      }

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

      updateWorkspace((current) => ({
        ...current,
        conversations: current.conversations.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
              }
            : conversation,
        ),
      }));
      responseTimerRef.current = null;
      sendingRef.current = false;
      setIsSending(false);
      return true;
    },
    [activeConversationId, conversations, updateWorkspace],
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
        <AssistantSidebar profile={profile} settingsHref={settingsHref} />
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Dismiss assistant navigation overlay"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <main className="flex min-w-0 flex-1 flex-col">
          {storageError && (
            <p
              role="alert"
              className="border-b border-amber-500/20 bg-amber-500/[0.05] px-4 py-2 text-xs text-amber-100/80"
            >
              {storageError}
            </p>
          )}
          {children}
        </main>
      </div>
    </AssistantWorkspaceContext.Provider>
  );
}
