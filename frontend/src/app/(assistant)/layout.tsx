import {
  AssistantWorkspace,
  DEMO_ASSISTANT_PROFILE,
} from "@/components/assistant/AssistantWorkspace";

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AssistantWorkspace profile={DEMO_ASSISTANT_PROFILE}>
      {children}
    </AssistantWorkspace>
  );
}
