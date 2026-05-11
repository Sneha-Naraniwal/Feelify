import { formatDistanceToNow } from "date-fns";
import { IconClockHour4, IconChevronRight, IconUser, IconBolt, IconShield } from "@tabler/icons-react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";

const DIFF_COLORS = {
  easy:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  hard:   "bg-rose-500/10   text-rose-400   border-rose-500/20",
  mixed:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

function RecentSessions({ sessions = [], isLoading }) {
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/8 animate-pulse h-44" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/8">
          <IconClockHour4 size={24} stroke={1} className="text-slate-600" />
        </div>
        <p className="text-sm font-bold text-slate-500">No recent sessions</p>
        <p className="text-[11px] text-slate-600 mt-1">Sessions you host or join will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.slice(0, 3).map((session) => {
        const iAmHost = session.host?.clerkId === user?.id;
        const other   = iAmHost ? session.participant : session.host;
        const role    = iAmHost ? "Hosted" : "Participated";

        const titles = session.problems?.length
          ? session.problems
          : session.problem
          ? [session.problem]
          : ["—"];

        let duration = null;
        if (session.startedAt && session.endedAt) {
          const ms   = new Date(session.endedAt) - new Date(session.startedAt);
          const mins = Math.floor(ms / 60000);
          const secs = Math.floor((ms % 60000) / 1000);
          duration = `${mins}m ${secs}s`;
        }

        return (
          <Link
            key={session._id}
            to="/history"
            className="group relative bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 overflow-hidden block"
          >
            {/* Role badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                iAmHost
                  ? "bg-white/10 text-slate-300 border-white/10"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              }`}>
                {role}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                {formatDistanceToNow(new Date(session.endedAt || session.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Problem(s) */}
            <h3 className="text-sm font-black text-white mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
              {titles[0]}
            </h3>
            {titles.length > 1 && (
              <p className="text-[10px] text-slate-600 font-medium mb-2">
                +{titles.length - 1} more problem{titles.length > 2 ? "s" : ""}
              </p>
            )}

            {/* Difficulty */}
            <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest mb-4 ${
              DIFF_COLORS[session.difficulty] || DIFF_COLORS.easy
            }`}>
              {session.difficulty}
            </span>

            {/* Footer */}
            <div className="pt-3 border-t border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {other?.profileImage ? (
                  <img src={other.profileImage} alt="" className="size-6 rounded-lg object-cover" />
                ) : (
                  <div className="size-6 rounded-lg bg-white/8 flex items-center justify-center">
                    <IconUser size={12} stroke={1.5} className="text-slate-500" />
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
                  {other?.name || (iAmHost ? "No participant" : "—")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {duration && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-600">
                    <IconClockHour4 size={11} stroke={1.5} /> {duration}
                  </div>
                )}
                <div className="size-6 bg-white/8 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 text-slate-500 transition-all">
                  <IconChevronRight size={12} stroke={2} />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default RecentSessions;