import { Loader2Icon, ShieldCheckIcon, UsersIcon, ClockIcon } from "lucide-react";

export default function WaitingRoom({ session }) {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Animated spinner */}
        <div className="relative mb-10">
          <div className="size-28 mx-auto rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
            <div className="size-20 rounded-full border-4 border-t-indigo-400 border-r-indigo-400 border-b-transparent border-l-transparent animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ClockIcon className="size-8 text-indigo-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-3">
          Waiting for Host
        </h1>
        <p className="text-indigo-300/70 text-sm font-medium mb-10">
          The host hasn't joined the session yet. You'll be connected automatically once they arrive.
        </p>

        {/* Session info cards */}
        <div className="space-y-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4">
            <ShieldCheckIcon size={18} className="text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session</p>
              <p className="text-white font-bold text-sm">
                {session?.problems?.length || 1} Problem{(session?.problems?.length || 1) > 1 ? "s" : ""} · {session?.difficulty}
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4">
            <UsersIcon size={18} className="text-indigo-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Host</p>
              <p className="text-white font-bold text-sm">{session?.host?.name || "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Pulsing status */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-[0.2em]">
            Waiting...
          </span>
        </div>
      </div>
    </div>
  );
}
