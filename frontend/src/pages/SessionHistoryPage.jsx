import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import {
  IconClockHour4, IconUser, IconCircleCheck, IconAlertTriangle,
  IconMessageCircle, IconStar, IconChevronDown, IconChevronUp,
  IconBolt, IconShieldBolt,
} from "@tabler/icons-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startedAt, endedAt) {
  if (!startedAt || !endedAt) return null;
  const ms   = new Date(endedAt) - new Date(startedAt);
  if (ms <= 0) return null;
  const totalMin = Math.floor(ms / 60000);
  const secs     = Math.floor((ms % 60000) / 1000);
  if (totalMin >= 60) {
    const hrs  = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs}h ${mins}m`;
  }
  if (totalMin > 0) return `${totalMin}m ${secs}s`;
  return `${secs}s`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const DIFF_COLORS = {
  easy:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard:   "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const ALERT_LABELS = { tab_switch: "Tab Switch", split_screen: "Split Screen", paste: "Paste" };
const ALERT_COLORS = { tab_switch: "text-amber-600", split_screen: "text-rose-500", paste: "text-indigo-500" };

function StarDisplay({ value, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <IconStar key={i} size={14} stroke={i < value ? 0 : 1.5}
          className={i < value ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"}
        />
      ))}
    </div>
  );
}

function CompletionBar({ pct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#6366f1" }}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Session Card ──────────────────────────────────────────────────────────────

function SessionCard({ session, isHost }) {
  const [expanded, setExpanded] = useState(false);
  const other = isHost ? session.participant : session.host;
  const duration = formatDuration(session.startedAt, session.endedAt);

  return (
    <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
      {/* Card Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-4">
          {other?.profileImage ? (
            <img src={other.profileImage} alt="" className="size-11 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="size-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
              <IconUser size={18} stroke={1.5} className="text-slate-500" />
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-black text-white">
              {isHost ? "Participant" : "Host"}: <span className="text-indigo-400">{other?.name || "—"}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(session.endedAt || session.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {duration && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <IconClockHour4 size={13} stroke={1.5} /> {duration}
            </div>
          )}
          {isHost && (
            <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              session.isSuccessfulSession
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/5 text-slate-500 border-white/10"
            }`}>
              {session.isSuccessfulSession ? "Successful" : "Incomplete"}
            </div>
          )}
          {isHost && session.cheatingAlerts?.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
              <IconShieldBolt size={13} stroke={1.5} /> {session.cheatingAlerts.length}
            </div>
          )}
          {expanded ? <IconChevronUp size={16} stroke={2} className="text-slate-500" /> : <IconChevronDown size={16} stroke={2} className="text-slate-500" />}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/8 px-6 py-5 space-y-5 bg-white/3">

          {/* Questions */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Questions</h4>
            <div className="space-y-3">
              {(session.questionProgress || session.problems?.map((p) => ({ title: p, difficulty: session.difficulty, solved: false, completionPct: 0 }))).map((q, i) => (
                <div key={i} className="flex items-center gap-3">
                  <IconCircleCheck
                    size={16}
                    stroke={1.5}
                    className={q.solved ? "text-emerald-400 fill-emerald-400/20" : "text-white/15"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-300 truncate">{q.title}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${DIFF_COLORS[q.difficulty] || DIFF_COLORS.easy}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <CompletionBar pct={q.completionPct || 0} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 w-12 text-right">+{q.earnedScore ?? 0}pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cheating Alerts (host only) */}
          {isHost && session.cheatingAlerts?.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <IconAlertTriangle size={12} stroke={1.5} className="text-amber-500" /> Integrity Alerts ({session.cheatingAlerts.length})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                {session.cheatingAlerts.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px]">
                    <span className={`font-bold ${ALERT_COLORS[a.type] || "text-slate-500"}`}>
                      {ALERT_LABELS[a.type] || a.type}
                    </span>
                    <span className="text-slate-300">—</span>
                    <span className="text-slate-400">{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isHost && session.participantRating?.submittedAt && (
              <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Rating of Participant</h4>

                {session.questionMarks?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Question Marks (70%)</p>
                    <div className="space-y-2">
                      {session.questionMarks.map((qm, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[60%]">{qm.title}</span>
                          <div className="flex items-center gap-2">
                            <StarDisplay value={qm.mark} max={10} />
                            <span className="text-[10px] font-black text-slate-500">{qm.mark}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Feedback Ratings (30%)</p>
                  {[
                    { label: "Communication",   val: session.participantRating.communication },
                    { label: "Code Quality",    val: session.participantRating.codeQuality },
                    { label: "Professionalism", val: session.participantRating.professionalism },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-500 font-medium">{r.label}</span>
                      <StarDisplay value={r.val} />
                    </div>
                  ))}
                </div>

                {session.participantRating.comment && (
                  <p className="text-[11px] text-slate-500 italic border-t border-white/8 pt-2">
                    "{session.participantRating.comment}"
                  </p>
                )}
              </div>
            )}

            {session.hostRating?.submittedAt && (
              <div className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl p-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                  {isHost ? "Participant's Rating of You" : "Your Rating of Host"}
                </h4>
                <div className="flex items-center gap-3">
                  <StarDisplay value={session.hostRating.overall} />
                  <span className="text-sm font-black text-indigo-400">{session.hostRating.overall}/5</span>
                </div>
                {session.hostRating.comment && (
                  <p className="text-[11px] text-slate-500 italic mt-2">"{session.hostRating.comment}"</p>
                )}
              </div>
            )}
          </div>

          {/* Chat History */}
          {session.chatHistory?.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                <IconMessageCircle size={12} stroke={1.5} /> Chat History ({session.chatHistory.length} messages)
              </h4>
              <div className="bg-white/4 border border-white/8 rounded-xl p-4 max-h-52 overflow-y-auto space-y-2 no-scrollbar">
                {session.chatHistory.map((msg, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[11px] font-bold text-indigo-400 shrink-0 min-w-[80px]">{msg.userName}</span>
                    <span className="text-[11px] text-slate-500 break-all">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SessionHistoryPage() {
  const [tab, setTab] = useState("hosted");

  const { data: hostedData, isLoading: loadingHosted } = useQuery({
    queryKey: ["hostedHistory"],
    queryFn: sessionApi.getHostedHistory,
    staleTime: 30000,
  });

  const { data: participatedData, isLoading: loadingParticipated } = useQuery({
    queryKey: ["participatedHistory"],
    queryFn: sessionApi.getParticipatedHistory,
    staleTime: 30000,
  });

  const hostedSessions      = hostedData?.sessions || [];
  const participatedSessions = participatedData?.sessions || [];

  const sessions = tab === "hosted" ? hostedSessions : participatedSessions;
  const loading  = tab === "hosted" ? loadingHosted : loadingParticipated;

  return (
    <div className="min-h-screen relative font-sans bg-slate-950">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] size-[500px] rounded-full bg-indigo-600/6 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] size-[400px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 bg-violet-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Records</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Session History</h1>
          <p className="text-slate-500 font-medium mt-1">Your complete record of hosted and participated sessions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-7 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/8 w-fit">
          {[
            { id: "hosted",       label: "Hosted",       count: hostedSessions.length },
            { id: "participated", label: "Participated", count: participatedSessions.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === t.id
                  ? "bg-white/12 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  tab === t.id ? "bg-white/15 text-white" : "bg-white/5 text-slate-500"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="size-10 border-2 border-white/10 border-t-violet-400 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-500">Loading history...</p>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-24">
            <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/8">
              <IconClockHour4 size={26} stroke={1} className="text-slate-600" />
            </div>
            <h3 className="text-lg font-black text-slate-400 mb-1">No sessions yet</h3>
            <p className="text-slate-600 font-medium text-sm">
              {tab === "hosted" ? "Sessions you host will appear here." : "Sessions you join will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <SessionCard key={s._id} session={s} isHost={tab === "hosted"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
