import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080B18] px-4 py-12 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#11162A] p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <KeyRound size={22} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Password support</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Password recovery is not available in this frontend demo because there
          is no authentication backend or email service connected.
        </p>
        <div className="mt-5 flex gap-3 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4 text-xs leading-5 text-amber-100/75">
          <ShieldCheck size={17} className="mt-0.5 shrink-0" />
          <p>
            In a connected deployment, contact your university help desk or use
            its official password recovery service.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
