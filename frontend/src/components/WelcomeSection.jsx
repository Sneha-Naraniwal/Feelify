import { useUser } from "@clerk/clerk-react";
import { ZapIcon, ArrowRightIcon, HistoryIcon, TrophyIcon } from "lucide-react";
import { Link } from "react-router";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">

      {/* ── Mesh gradient layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] bg-violet-600/25 rounded-full blur-[90px]" />
        <div className="absolute top-10 right-[35%] w-[300px] h-[300px] bg-rose-500/15 rounded-full blur-[80px]" />
      </div>

      {/* ── Noise texture ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Subtle grid ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 px-10 py-9 flex items-center justify-between gap-8">

        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
              <span className="size-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Interview Platform
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-2">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400">
              {user?.firstName || "there"}
            </span>
          </h1>

          <p className="text-slate-400 text-sm font-medium mb-7 max-w-md">
            Host or join a live coding session, review your history, and track your ranking.
          </p>

          {/* Quick links */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/history"
              className="flex items-center gap-2 px-4 py-2 bg-white/8 hover:bg-white/14 border border-white/10 hover:border-white/20 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white transition-all duration-200"
            >
              <HistoryIcon size={12} /> Session History
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-400/50 rounded-xl text-[11px] font-bold text-indigo-300 hover:text-indigo-200 transition-all duration-200"
            >
              <TrophyIcon size={12} /> Leaderboard
            </Link>
          </div>
        </div>

        {/* Right — Create Session CTA */}
        <div className="shrink-0">
          <button
            onClick={onCreateSession}
            className="group relative flex items-center gap-5 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 px-2 py-2 pr-8 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-xl backdrop-blur-sm overflow-hidden"
          >
            {/* Shimmer */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent group-hover:left-full transition-all duration-700 rounded-full" />

            <div className="size-14 bg-gradient-to-br from-indigo-500 via-violet-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:shadow-indigo-500/60 transition-shadow">
              <ZapIcon className="size-6 text-white fill-white" strokeWidth={2.5} />
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-300 transition-colors">New</span>
              <span className="text-lg font-bold text-white flex items-center gap-3">
                Create Session
                <ArrowRightIcon className="size-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

export default WelcomeSection;