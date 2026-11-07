
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";
import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import { DEMO_ROLE } from "@/lib/demo-user";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#080B18] text-slate-100">
      {/* Sidebar */}
      <WorkspaceSidebar role={DEMO_ROLE} />

      {/* Main Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
