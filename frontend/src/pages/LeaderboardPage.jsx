import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import { useMyRank } from "../hooks/useSessions";
import {
  IconTrophy, IconStar, IconBolt, IconUser, IconCode, IconShieldCheck,
} from "@tabler/icons-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarDisplay({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <IconStar key={i} size={11} stroke={i <= Math.round(value) ? 0 : 1.5}
          className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"}
        />
      ))}
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-sm font-black text-amber-500">#1</span>;
  if (rank === 2) return <span className="text-sm font-black text-slate-400">#2</span>;
  if (rank === 3) return <span className="text-sm font-black text-amber-700">#3</span>;
  return <span className="text-sm font-black text-slate-400">#{rank}</span>;
}

// ─── Row Components ────────────────────────────────────────────────────────────

function ParticipantRow({ user, rank, isMe }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
      isMe ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-white/5"
    }`}>
      <div className="w-10 flex justify-center shrink-0">
        <RankBadge rank={rank} />
      </div>

      {user.profileImage ? (
        <img src={user.profileImage} alt="" className="size-10 rounded-xl object-cover border border-white/10 shrink-0" />
      ) : (
        <div className="size-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
          <IconUser size={16} stroke={1.5} className="text-slate-500" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-black truncate ${isMe ? "text-indigo-300" : "text-white"}`}>
          {user.name} {isMe && <span className="text-[10px] font-bold text-indigo-400">(You)</span>}
        </p>
        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
          {user.sessionsParticipated ?? 0} sessions participated · {user.ratedSessionsCount ?? 0} rated
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-black text-indigo-400">{user.participantScore ?? 0}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">pts</p>
      </div>
    </div>
  );
}

function HostRow({ user, rank, isMe }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
      isMe ? "bg-violet-500/10 border border-violet-500/20" : "hover:bg-white/5"
    }`}>
      <div className="w-10 flex justify-center shrink-0">
        <RankBadge rank={rank} />
      </div>

      {user.profileImage ? (
        <img src={user.profileImage} alt="" className="size-10 rounded-xl object-cover border border-white/10 shrink-0" />
      ) : (
        <div className="size-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
          <UserIcon size={16} className="text-slate-500" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-black truncate ${isMe ? "text-violet-300" : "text-white"}`}>
          {user.name} {isMe && <span className="text-[10px] font-bold text-violet-400">(You)</span>}
        </p>
        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
          {user.successfulSessionsHosted ?? 0} successful sessions · <StarDisplay value={user.avgHostRating ?? 0} />
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-black text-violet-400">{user.hostScore ?? 0}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">pts</p>
      </div>
    </div>
  );
}


// ─── My Stats Mini Card ────────────────────────────────────────────────────────

function StatPill({ icon, label, value, color }) {
  return (
    <div className={`bg-white/4 rounded-xl p-4 border flex items-center gap-3 ${color}`}>
      <div className={`size-8 rounded-lg flex items-center justify-center bg-white/8`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState("participant");

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: sessionApi.getLeaderboard,
    staleTime: 60000,
  });

  const { data: rankData } = useMyRank();

  const participantBoard  = leaderboardData?.participantBoard || [];
  const hostBoard         = leaderboardData?.hostBoard || [];
  const myStats           = rankData?.stats;
  const myParticipantRank = rankData?.participantRank;
  const myHostRank        = rankData?.hostRank;

  return (
    <div className="min-h-screen relative font-sans bg-slate-950">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] size-[500px] rounded-full bg-indigo-600/6 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[400px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 bg-indigo-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Rankings</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Leaderboard</h1>
          <p className="text-slate-500 font-medium mt-1">Merit-based rankings. Only real performance counts.</p>
        </div>

        {/* My rank summary */}
        {myStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatPill icon={<IconBolt size={15} stroke={1.5} className="text-indigo-400" />}
              label="Participant Rank" value={`#${myParticipantRank ?? "N/A"}`} color="bg-indigo-500/10 border-indigo-500/20" />
            <StatPill icon={<IconShieldCheck size={15} stroke={1.5} className="text-violet-400" />}
              label="Host Rank" value={`#${myHostRank ?? "N/A"}`} color="bg-violet-500/10 border-violet-500/20" />
            <StatPill icon={<IconCode size={15} stroke={1.5} className="text-emerald-400" />}
              label="Sessions Rated" value={myStats.ratedSessionsCount ?? 0} color="bg-emerald-500/10 border-emerald-500/20" />
            <StatPill icon={<IconStar size={15} stroke={1.5} className="text-amber-400" />}
              label="Avg Host Rating" value={myStats.avgHostRating > 0 ? myStats.avgHostRating.toFixed(1) : "None"} color="bg-amber-500/10 border-amber-500/20" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/8 w-fit">
          {[
            { id: "participant", label: "Participant Board" },
            { id: "host",        label: "Host Board" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === t.id
                  ? "bg-white/12 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Score explanation */}
        <div className="bg-white/4 border border-white/8 rounded-xl px-5 py-3 mb-5 text-[11px] text-slate-500 font-medium leading-relaxed">
          {tab === "participant"
            ? "Participant score: 70% host question marks + 30% host feedback ratings, averaged across all rated sessions."
            : "Host score: 20 pts per successful session (participant joined and stayed 20+ min), plus up to 16 pts from participant ratings."}
        </div>

        {/* Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white/4 backdrop-blur-sm rounded-2xl border border-white/8 overflow-hidden">
            <div className="divide-y divide-white/5">
              {(tab === "participant" ? participantBoard : hostBoard).length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-medium">No data yet. Complete sessions to appear here.</div>
              ) : tab === "participant" ? (
                participantBoard.map((u, i) => (
                  <ParticipantRow key={u._id} user={u} rank={i + 1} isMe={u._id === rankData?.userId} />
                ))
              ) : (
                hostBoard.map((u, i) => (
                  <HostRow key={u._id} user={u} rank={i + 1} isMe={u._id === rankData?.userId} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
