import { SignInButton } from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  ChevronRightIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: <VideoIcon size={24} />,
    title: "HD Video Calls",
    desc: "Crystal-clear video and audio powered by Stream — built for real-time collaboration.",
    color: "from-rose-500 to-pink-600",
    light: "bg-rose-50",
    text: "text-rose-600",
    shadow: "shadow-rose-200",
  },
  {
    icon: <Code2Icon size={24} />,
    title: "Live Code Editor",
    desc: "Monaco editor with syntax highlighting, multi-language support, and instant execution.",
    color: "from-indigo-500 to-violet-600",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    shadow: "shadow-indigo-200",
  },
  {
    icon: <MessageSquareIcon size={24} />,
    title: "In-Session Chat",
    desc: "Real-time text chat alongside your video — share links, hints, and feedback instantly.",
    color: "from-emerald-400 to-teal-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    shadow: "shadow-emerald-200",
  },
  {
    icon: <UsersIcon size={24} />,
    title: "1-on-1 Rooms",
    desc: "Private collaborative sessions — host or join, with problem selection and difficulty tuning.",
    color: "from-amber-400 to-orange-500",
    light: "bg-amber-50",
    text: "text-amber-600",
    shadow: "shadow-amber-200",
  },
  {
    icon: <ShieldCheckIcon size={24} />,
    title: "Secure & Private",
    desc: "End-to-end encrypted video, authenticated sessions, and zero data leakage.",
    color: "from-slate-600 to-slate-800",
    light: "bg-slate-50",
    text: "text-slate-600",
    shadow: "shadow-slate-200",
  },
  {
    icon: <ZapIcon size={24} />,
    title: "Academic Prep",
    desc: "Curated question banks for OS, DBMS, OOPs, Networks, and DSA — all in one place.",
    color: "from-violet-500 to-purple-700",
    light: "bg-violet-50",
    text: "text-violet-600",
    shadow: "shadow-violet-200",
  },
];

const STATS = [
  { value: "5+", label: "Problems Ready" },
  { value: "3", label: "Languages" },
  { value: "HD", label: "Video Quality" },
  { value: "∞", label: "Sessions" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden selection:bg-pink-500/20">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-slate-50" />
        <div className="absolute top-[-15%] left-[-10%] size-[700px] rounded-full bg-pink-200/50 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] size-[600px] rounded-full bg-rose-200/40 blur-[110px]" />
        <div className="absolute top-[30%] right-[15%] size-[400px] rounded-full bg-indigo-100/30 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-2.5 bg-black rounded-full" />
            <span className="font-black text-xl tracking-tighter text-black uppercase">FEELIFY</span>
            <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">
              Code Together
            </span>
          </div>

          <SignInButton mode="modal">
            <button className="group flex items-center gap-2.5 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
              Get Started
              <ArrowRightIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full px-5 py-2 shadow-sm mb-10">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600">
              Real-time Collaboration
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-slate-900">
            Code Together,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500">
              Grow Together
            </span>
          </h1>

          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            The collaborative coding platform built for technical interviews and pair programming.
            Live video, shared editor, real-time chat — all in one room.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <SignInButton mode="modal">
              <button className="group relative flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ZapIcon size={18} className="fill-current relative z-10" />
                <span className="relative z-10">Start Coding Free</span>
                <ArrowRightIcon size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>

            <SignInButton mode="modal">
              <button className="flex items-center gap-2 bg-white/80 hover:bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:shadow-md hover:scale-105">
                <VideoIcon size={18} className="text-rose-500" />
                See it in action
              </button>
            </SignInButton>
          </div>

          {/* Stats Row */}
          <div className="inline-flex items-center gap-0 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`px-8 py-5 text-center ${i < STATS.length - 1 ? "border-r border-slate-100" : ""}`}>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="size-2 bg-rose-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Platform Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything you need
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
              to ace the interview
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto">
            Powerful tools designed to make collaborative coding sessions seamless and productive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className={`size-14 ${f.light} ${f.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg ${f.shadow}`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-slate-900 rounded-[3rem] p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 size-[400px] rounded-full bg-rose-500/20 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-indigo-500/20 blur-[100px] translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8">
              <SparklesIcon size={14} className="text-rose-300" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">Free to get started</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to start coding
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">together?</span>
            </h2>
            <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto">
              Join Feelify and transform the way you practice and collaborate on code.
            </p>
            <SignInButton mode="modal">
              <button className="group inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-base hover:bg-rose-50 transition-all hover:scale-105 shadow-2xl shadow-black/30">
                <ZapIcon size={18} className="text-rose-500 fill-rose-500" />
                Get Started — It&apos;s Free
                <ChevronRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-rose-100/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-2 bg-black rounded-full" />
            <span className="font-black text-sm tracking-tighter text-black uppercase">FEELIFY</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Feelify. Built for developers, by developers.
          </p>
        </div>
      </footer>

    </div>
  );
}