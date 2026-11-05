"use client";
import NeuralBackground from "@/components/landing/NeuralBackground";
import Image from "next/image";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  Menu,
  Sparkles,
  FileText,
  ClipboardCheck,
  ChartNoAxesCombined,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Study Assistant",
    description: "Get intelligent answers grounded in your academic materials.",
    color: "violet",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description: "Transform lecture materials into structured study notes.",
    color: "cyan",
  },
  {
    icon: ClipboardCheck,
    title: "Interactive Quizzes",
    description: "Practice, test your knowledge, and understand explanations.",
    color: "violet",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Learning Insights",
    description: "Explore your learning progress and identify improvement areas.",
    color: "cyan",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080B18] text-white">
      {/* Ambient background */}
      {/* Animated neural network background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B18]/30 via-transparent to-[#080B18]" />
      </div>

      {/* Navigation */}
      <header className="relative z-20 mx-auto max-w-[1440px] px-5 pt-5 sm:px-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0D1225]/80 px-5 py-4 backdrop-blur-2xl sm:px-7">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <span className="text-xl font-black text-white">N</span>
            </div>
            <span className="text-xl font-bold tracking-[0.18em]">NEXORA</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <a href="#home" className="text-white transition hover:text-violet-300">Home</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#students" className="transition hover:text-white">For Students</a>
            <a href="#staff" className="transition hover:text-white">For Staff</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              Login
            </Link>
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.03]"
            >
              Get Started
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 p-2 sm:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-[#11162A] p-5 sm:hidden">
            <div className="flex flex-col gap-4 text-sm text-slate-300">
              <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#students" onClick={() => setMenuOpen(false)}>For Students</a>
              <a href="#staff" onClick={() => setMenuOpen(false)}>For Staff</a>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="font-semibold text-violet-300">Get Started →</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative z-10 mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            
            AI-Powered Academic Assistant
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            Your Intelligent
            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Learning Companion
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Learn smarter, research confidently, and excel academically.
            NEXORA brings intelligent learning assistance and trusted
            academic guidance into one seamless experience.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-4 font-semibold shadow-xl shadow-violet-600/20 transition hover:scale-[1.03]"
            >
              
              Get Started
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-white/[0.06]"
            >
              <BookOpen size={18} />
              Explore NEXORA
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#080B18] bg-violet-500/30"><GraduationCap size={15} /></span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#080B18] bg-cyan-500/30"><BrainCircuit size={15} /></span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#080B18] bg-blue-500/30"><BookOpen size={15} /></span>
            </div>
            Designed for students, lecturers & academic teams
          </div>
        </motion.div>

        {/* Neural visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex min-h-[380px] items-center justify-center lg:min-h-[520px]"
        >
          <div className="absolute h-[320px] w-[320px] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute h-[260px] w-[260px] rounded-full bg-cyan-500/15 blur-[100px]" />

          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-64 w-64 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-[#11162A]/60 to-cyan-400/10 shadow-[0_0_100px_rgba(139,92,246,0.15)] sm:h-80 sm:w-80"
          >
            <div className="absolute inset-5 rounded-full border border-cyan-400/15" />
            <div className="absolute inset-10 rounded-full border border-violet-400/20" />
            <div className="absolute inset-16 rounded-full border border-cyan-400/15" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <span className="absolute left-1/2 top-0 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_#22D3EE]" />
              <span className="absolute bottom-8 left-5 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_20px_#8B5CF6]" />
              <span className="absolute bottom-10 right-5 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_#22D3EE]" />
            </motion.div>

            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-violet-300/30 bg-gradient-to-br from-violet-500/25 to-cyan-500/20 shadow-[0_0_60px_rgba(139,92,246,0.3)] backdrop-blur-xl sm:h-36 sm:w-36">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_60px_rgba(139,92,246,0.35)]">
                <span className="text-7xl font-black text-white">N</span>
              </div>
            </div>

            
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 sm:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-300">The NEXORA experience</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to <span className="text-slate-400">learn better.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">One intelligent platform for academic learning, resources, and student support.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isCyan = feature.color === "cyan";

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition hover:border-violet-400/30 hover:shadow-[0_15px_50px_rgba(139,92,246,0.08)]"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${isCyan ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300" : "border-violet-400/20 bg-violet-400/10 text-violet-300"}`}>
                  <Icon size={23} />
                </div>
                <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{feature.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Explore feature</span>
                  <ArrowRight size={16} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="about" className="relative z-10 mx-5 mb-20 overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 via-[#11162A] to-cyan-500/10 px-6 py-16 text-center sm:mx-8 sm:px-12">
        <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="relative">
          
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your academic journey, <span className="text-violet-300">reimagined.</span></h2>
          <p className="mx-auto mt-5 max-w-xl text-slate-400">Discover a smarter way to learn, explore knowledge, and move forward with confidence.</p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-4 font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.03]">
            Start Your Journey <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold tracking-widest text-slate-300">
            <span className="text-violet-400">N</span> NEXORA
          </div>
          <p>Intelligent academic assistance, powered by AI.</p>
          <p>© 2026 NEXORA.</p>
        </div>
      </footer>
    </main>
  );
}
