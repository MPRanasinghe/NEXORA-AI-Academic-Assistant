"use client";

import Image from "next/image";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  ImagePlus,
  Menu,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  type AssistantMessage,
  type MessageAttachment,
  useAssistantWorkspace,
} from "@/components/assistant/assistant-workspace-context";

type SelectedAttachment = MessageAttachment & {
  file: File;
  previewUrl?: string;
};

type RecognitionResult = {
  isFinal: boolean;
  0: { transcript: string };
};

type RecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const suggestedQuestions = [
  "Explain the concept of machine learning",
  "How does a database management system work?",
  "Help me understand research methodology",
  "Summarize the fundamentals of artificial intelligence",
];

const documentExtensions = new Set(["pdf", "docx", "pptx", "txt"]);
const imageExtensions = new Set(["png", "jpg", "jpeg", "webp"]);
const EMPTY_MESSAGES: AssistantMessage[] = [];

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function getAttachmentKind(file: File): MessageAttachment["kind"] | null {
  const extension = getFileExtension(file);
  if (imageExtensions.has(extension)) return "image";
  if (documentExtensions.has(extension)) {
    return "file";
  }
  return null;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function AssistantMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dimensions = {
    sm: "h-8 w-8 rounded-lg text-sm",
    md: "h-10 w-10 rounded-xl text-lg",
    lg: "h-14 w-14 rounded-2xl text-2xl",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-white shadow-lg shadow-violet-500/20 ${dimensions[size]}`}
      aria-hidden="true"
    >
      N
    </div>
  );
}

function NeuralNetwork() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 112"
      className="h-[88px] w-[280px] sm:h-[104px] sm:w-[340px]"
      fill="none"
    >
      <defs>
        <linearGradient id="neural-line" x1="20" y1="20" x2="340" y2="94">
          <stop stopColor="#8B5CF6" stopOpacity=".08" />
          <stop offset=".5" stopColor="#A78BFA" stopOpacity=".36" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id="neural-node">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity=".2" />
        </radialGradient>
        <filter id="neural-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="url(#neural-line)" strokeWidth="1">
        <path d="M24 55 88 25 145 48 204 20 267 44 336 22" />
        <path d="M24 55 83 88 145 48 207 88 267 44 332 82" />
        <path d="M88 25 83 88M145 48 204 20M145 48 207 88M267 44 332 82M204 20 267 44" />
        <path d="M24 55 145 48 267 44 336 22M83 88 207 88 332 82" opacity=".55" />
      </g>
      <g filter="url(#neural-glow)">
        <circle cx="24" cy="55" r="3" fill="#A78BFA" />
        <circle cx="88" cy="25" r="2.5" fill="#A78BFA" />
        <circle cx="83" cy="88" r="2.5" fill="#8B5CF6" />
        <circle cx="145" cy="48" r="4" fill="url(#neural-node)" />
        <circle cx="204" cy="20" r="2.5" fill="#A78BFA" />
        <circle cx="207" cy="88" r="2.5" fill="#22D3EE" />
        <circle cx="267" cy="44" r="4" fill="url(#neural-node)" />
        <circle cx="332" cy="82" r="2.5" fill="#22D3EE" />
        <circle cx="336" cy="22" r="2.5" fill="#22D3EE" />
      </g>
    </svg>
  );
}

export default function AssistantPage() {
  const {
    activeConversation,
    isSending,
    explainabilityOpen,
    setExplainabilityOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sendMessage,
  } = useAssistantWorkspace();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<SelectedAttachment[]>([]);
  const [sourceCollapse, setSourceCollapse] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [fileNotice, setFileNotice] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const dragDepthRef = useRef(0);
  const messages = activeConversation?.messages ?? EMPTY_MESSAGES;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > 176 ? "auto" : "hidden";
  }, [input]);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    },
    [],
  );

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const removed = current.find((attachment) => attachment.id === id);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrlsRef.current.delete(removed.previewUrl);
      }
      return current.filter((attachment) => attachment.id !== id);
    });
  };

  const addFiles = (files: FileList | File[]) => {
    if (isSending) return;
    const accepted: SelectedAttachment[] = [];
    let rejectedCount = 0;

    Array.from(files).forEach((file) => {
      const kind = getAttachmentKind(file);
      if (!kind) {
        rejectedCount += 1;
        return;
      }
      const id = crypto.randomUUID();
      const previewUrl =
        kind === "image" ? URL.createObjectURL(file) : undefined;
      if (previewUrl) previewUrlsRef.current.add(previewUrl);
      accepted.push({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        kind,
        file,
        previewUrl,
      });
    });

    if (accepted.length > 0) {
      setAttachments((current) => [...current, ...accepted]);
    }
    setFileNotice(
      rejectedCount > 0
        ? `${rejectedCount} unsupported file${rejectedCount === 1 ? "" : "s"} skipped. Choose PDF, DOCX, PPTX, TXT, PNG, JPG, JPEG, or WEBP.`
        : "",
    );
  };

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.currentTarget.files) addFiles(event.currentTarget.files);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleSend = async () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    const attachmentMetadata: MessageAttachment[] = attachments.map(
      (attachment) => ({
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        kind: attachment.kind,
      }),
    );
    const sent = await sendMessage(input, attachmentMetadata);
    if (!sent) return;

    attachments.forEach((attachment) => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
        previewUrlsRef.current.delete(attachment.previewUrl);
      }
    });
    setAttachments([]);
    setInput("");
    setFileNotice("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSending) void handleSend();
  };

  const startOrStopVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNotice(
        "Voice input is not supported in this browser. You can type your question instead.",
      );
      return;
    }

    setVoiceNotice("");
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcripts: string[] = [];
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) transcripts.push(result[0].transcript.trim());
      }
      if (transcripts.length > 0) {
        setInput((current) =>
          [current.trim(), transcripts.join(" ")].filter(Boolean).join(" "),
        );
      }
    };
    recognition.onerror = () => {
      setVoiceNotice("Voice input stopped. You can try again or type instead.");
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceNotice(
        "Voice input could not start. Check microphone permission or type your question instead.",
      );
    }
  };

  const toggleSources = (messageId: string) => {
    setSourceCollapse((current) =>
      current.includes(messageId)
        ? current.filter((id) => id !== messageId)
        : [...current, messageId],
    );
  };

  const onDragEnter = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDragging(false);
    }
  };

  return (
    <>
      <header className="z-10 flex min-h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#080B18]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label={
              mobileSidebarOpen
                ? "Close conversation navigation"
                : "Open conversation navigation"
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            {mobileSidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <AssistantMark size="sm" />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {activeConversation?.title ?? "NEXORA Academic Assistant"}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-medium text-amber-200/80">
                Demo mode · responses and retrieval data are illustrative
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExplainabilityOpen(!explainabilityOpen)}
          aria-pressed={explainabilityOpen}
          className={`ml-2 flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
            explainabilityOpen
              ? "border-violet-400/30 bg-violet-500/10 text-violet-200"
              : "border-white/[0.08] text-slate-400 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <ShieldCheck size={15} />
          <span className="hidden sm:inline">Explainability</span>
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <section
          className="flex-1 overflow-y-auto"
          aria-label="Conversation messages"
        >
          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            {messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center py-4 text-center">
                <NeuralNetwork />
                <h2 className="mt-3 text-xl font-medium tracking-tight text-slate-100 sm:text-2xl">
                  What can I help you learn today?
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                  Ask about academic subjects, coursework, or university resources.
                </p>
                <div className="mt-6 flex w-full max-w-3xl flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => {
                        setInput(question);
                        textareaRef.current?.focus();
                      }}
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-left text-[11px] leading-4 text-slate-400 transition hover:border-violet-400/25 hover:bg-violet-500/[0.05] hover:text-slate-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-7 pb-4">
                {messages.map((message) => (
                  <MessageView
                    key={message.id}
                    message={message}
                    explainabilityOpen={explainabilityOpen}
                    sourcesCollapsed={sourceCollapse.includes(message.id)}
                    onToggleSources={() => toggleSources(message.id)}
                  />
                ))}
                {isSending && (
                  <div className="flex items-start gap-3">
                    <AssistantMark size="sm" />
                    <div className="rounded-2xl border border-white/[0.07] bg-[#11162A] px-4 py-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                        NEXORA is preparing a demo response…
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <div className="sticky bottom-0 z-10 shrink-0 bg-gradient-to-t from-[#080B18] via-[#080B18]/98 to-[#080B18]/80 px-3 pb-3 pt-2 sm:px-6 sm:pb-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onDragEnter={onDragEnter}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={onDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-[26px] border bg-[#171923] px-3 py-2 shadow-lg shadow-black/10 transition focus-within:border-violet-400/30 sm:px-4 ${
                isDragging
                  ? "border-cyan-300/50 bg-cyan-400/[0.04]"
                  : "border-white/[0.09]"
              }`}
            >
              {isDragging && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300/50 bg-[#0D1225]/90 text-sm font-medium text-cyan-200">
                  Drop documents or images to attach
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                disabled={isSending}
                placeholder="Ask an academic question or drop files here…"
                aria-label="Write a message"
                rows={1}
                className="block max-h-44 min-h-[28px] w-full resize-none overflow-y-hidden bg-transparent px-1 py-1.5 text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              />

              {attachments.length > 0 && (
                <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto px-1 pb-2 pt-1">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex max-w-full items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] p-1.5"
                    >
                      {attachment.previewUrl ? (
                        <Image
                          src={attachment.previewUrl}
                          alt={`Preview of ${attachment.name}`}
                          width={30}
                          height={30}
                          unoptimized
                          className="h-[30px] w-[30px] rounded-md object-cover"
                        />
                      ) : (
                        <FileText
                          size={15}
                          className="mx-1 shrink-0 text-cyan-300"
                        />
                      )}
                      <span className="min-w-0">
                        <span className="block max-w-[140px] truncate text-[10px] font-medium text-slate-200">
                          {attachment.name}
                        </span>
                        <span className="block text-[9px] text-slate-500">
                          {formatFileSize(attachment.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        aria-label={`Remove ${attachment.name}`}
                        className="rounded-md p-1 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fileNotice && (
                <p role="status" className="px-2 pb-2 text-[10px] text-amber-200/80">
                  {fileNotice}
                </p>
              )}
              {voiceNotice && (
                <p role="status" className="px-2 pb-2 text-[10px] text-slate-400">
                  {voiceNotice}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-1 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.docx,.pptx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                    multiple
                    onChange={handleFileInput}
                    className="sr-only"
                    tabIndex={-1}
                    aria-label="Choose documents"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleFileInput}
                    className="sr-only"
                    tabIndex={-1}
                    aria-label="Choose images"
                  />
                  <button
                    type="button"
                    onClick={() => documentInputRef.current?.click()}
                    disabled={isSending}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200 disabled:opacity-40"
                  >
                    <Paperclip size={14} />
                    Files
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isSending}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200 disabled:opacity-40"
                  >
                    <ImagePlus size={14} />
                    Images
                  </button>
                  <button
                    type="button"
                    onClick={startOrStopVoiceInput}
                    disabled={isSending}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[10px] font-medium transition disabled:opacity-40 ${
                      isListening
                        ? "bg-red-400/10 text-red-200"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                        Stop listening
                      </>
                    ) : (
                      <>
                        <Mic size={14} />
                        Voice
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isListening && (
                    <span className="hidden text-[10px] text-red-200/80 sm:inline">
                      Listening…
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={
                      isSending ||
                      (!input.trim() && attachments.length === 0)
                    }
                    aria-label="Send message"
                    title="Send message"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/15 transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[9px] text-slate-600">
              <ShieldCheck size={12} className="text-cyan-400/70" />
              <span>
                Demo mode: file contents are not uploaded or analyzed; only
                attachment details are saved with local conversation history.
              </span>
              <span className="hidden sm:inline">·</span>
              <span>Enter to send · Shift+Enter for a new line</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageView({
  message,
  explainabilityOpen,
  sourcesCollapsed,
  onToggleSources,
}: {
  message: AssistantMessage;
  explainabilityOpen: boolean;
  sourcesCollapsed: boolean;
  onToggleSources: () => void;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <article className="space-y-2.5">
      <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
        <div
          className={`min-w-0 w-full ${
            isAssistant ? "max-w-3xl" : "max-w-[min(82%,40rem)]"
          }`}
        >
          {isAssistant && (
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <span className="text-violet-300/80">NEXORA</span>
              {message.createdAt !== undefined && (
                <time dateTime={new Date(message.createdAt).toISOString()}>
                  {formatTime(message.createdAt)}
                </time>
              )}
            </div>
          )}
          <div
            className={`text-sm leading-7 ${
              isAssistant
                ? "text-slate-300"
                : "rounded-[22px] bg-[#252633] px-4 py-2.5 text-left text-slate-100"
            }`}
          >
            {message.content && (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            {message.attachments && message.attachments.length > 0 && (
              <div
                className={`mt-3 flex flex-wrap gap-2 ${
                  message.content ? "border-t border-white/[0.07] pt-3" : ""
                }`}
              >
                {message.attachments.map((attachment) => (
                  <span
                    key={attachment.id}
                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-black/10 px-2.5 py-2 text-left text-[10px] text-slate-300"
                  >
                    {attachment.kind === "image" ? (
                      <ImagePlus size={14} className="shrink-0 text-cyan-300" />
                    ) : (
                      <FileText size={14} className="shrink-0 text-cyan-300" />
                    )}
                    <span className="max-w-[180px] truncate">{attachment.name}</span>
                    <span className="shrink-0 text-slate-500">
                      {formatFileSize(attachment.size)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAssistant && message.sources && message.sources.length > 0 && (
        <div className="max-w-3xl">
          <button
            type="button"
            onClick={onToggleSources}
            aria-expanded={!sourcesCollapsed}
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px] font-medium text-cyan-200/75 transition hover:bg-white/[0.04]"
          >
            <BookOpen size={13} />
            {message.sources.length} demo academic sources
            {sourcesCollapsed ? (
              <ChevronRight size={13} />
            ) : (
              <ChevronDown size={13} />
            )}
          </button>
          {!sourcesCollapsed && (
            <div className="mt-1.5 space-y-1.5">
              {message.sources.map((source) => (
                <div
                  key={source.title}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2"
                >
                  <FileText size={14} className="shrink-0 text-cyan-300" />
                  <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-300">
                    {source.title}
                  </span>
                  <span className="hidden text-[9px] text-slate-500 sm:inline">
                    {source.category}
                  </span>
                  <span className="shrink-0 text-[9px] text-cyan-200/80">
                    {source.relevance}% demo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAssistant &&
        message.confidence !== undefined &&
        explainabilityOpen && (
          <div className="max-w-3xl rounded-lg border border-violet-500/10 bg-violet-500/[0.025] px-3 py-2.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-violet-200">
              <ShieldCheck size={14} />
              Retrieval explainability · Demo data
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <div>
                <p className="text-[10px] text-slate-500">
                  Retrieval confidence
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {message.confidence}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Retrieval method</p>
                <p className="mt-0.5 text-xs font-medium text-slate-300">
                  Hybrid retrieval
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Evidence</p>
                <p className="mt-0.5 text-xs font-medium text-slate-300">
                  Sample academic sources
                </p>
              </div>
            </div>
            <p className="mt-2 text-[9px] leading-4 text-slate-500">
              Illustrative metadata only. Real confidence scores and evidence
              explanations require the retrieval backend.
            </p>
          </div>
        )}
    </article>
  );
}
