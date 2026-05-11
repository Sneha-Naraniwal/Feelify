import { useNavigate, Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions, useMyRank, useJoinByInviteCode } from "../hooks/useSessions";
import { motion } from "framer-motion";

// 1. IMPORT YOUR PROBLEMS DATA
import { PROBLEMS } from "../data/problems";

import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import AcademicTopics from "../components/AcademicTopics";
import WelcomeSection from "../components/WelcomeSection";
import { CopyIcon, CheckIcon, TicketIcon, ArrowRightIcon, LoaderIcon, ChevronRightIcon, ShareIcon } from "lucide-react";

// Stagger container for dashboard sections
const sectionContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};
const sectionItem = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problems: [], difficulty: "" });
  const [createdInviteCode, setCreatedInviteCode] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const createSessionMutation = useCreateSession();
  const joinByCodeMutation = useJoinByInviteCode();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: rankData, isLoading: loadingRank } = useMyRank();

  if (!isLoaded) return null;

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const totalProblemsCount = Object.keys(PROBLEMS).length;

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const handleCreateRoom = () => {
    if (!roomConfig.problems || roomConfig.problems.length === 0) return;
    createSessionMutation.mutate(
      { problems: roomConfig.problems, difficulty: roomConfig.difficulty || "mixed" },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          setCreatedInviteCode(data.session.inviteCode);
        },
      }
    );
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinByCode = () => {
    if (!joinCode.trim()) return;
    joinByCodeMutation.mutate(joinCode.trim(), {
      onSuccess: (data) => {
        setJoinCode("");
        navigate(`/session/${data.session._id}`);
      },
    });
  };

  return (
    <div className="relative flex min-h-screen font-sans bg-slate-950">

      {/* Animated ambient mesh orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] size-[700px] rounded-full bg-indigo-600/8 blur-[140px] animate-orb-drift" />
        <div className="absolute bottom-[0%] right-[-5%] size-[600px] rounded-full bg-violet-600/8 blur-[120px] animate-orb-drift-reverse" />
        <div className="absolute top-[40%] right-[20%] size-[400px] rounded-full bg-rose-600/5 blur-[100px] animate-orb-drift-slow" />
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      <Navbar />

      <motion.main
        variants={sectionContainer}
        initial="hidden"
        animate="show"
        className="flex-1 ml-64 p-10 transition-all duration-300 relative z-10"
      >
        
        {/* HERO */}
        <motion.section variants={sectionItem} className="mb-12">
          <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
        </motion.section>

        {/* STATS */}
        <motion.section variants={sectionItem} className="mb-12">
          <StatsCards
            activeSessionsCount={activeSessions.length}
            sessionsHosted={loadingRank ? null : (rankData?.stats?.sessionsHosted ?? 0)}
            recentSessionsCount={recentSessions.length}
            participantRank={loadingRank ? null : rankData?.participantRank}
            hostRank={loadingRank ? null : rankData?.hostRank}
            avgHostRating={loadingRank ? 0 : (rankData?.stats?.avgHostRating || 0)}
          />
        </motion.section>

        {/* INVITE CODE BANNER */}
        {createdInviteCode && (
          <motion.section
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="size-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 animate-float">
                  <TicketIcon className="text-white size-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em] mb-1">Session Created — Share This Code</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-3xl font-black tracking-[0.3em] text-white font-mono">{createdInviteCode}</span>
                    <button onClick={() => handleCopyCode(createdInviteCode)} className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition-all border border-emerald-500/20">
                      {copiedCode ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                    </button>
                    <button
                      onClick={async () => {
                        const shareText = `Join my Feelify interview session!\nCode: ${createdInviteCode}`;
                        if (navigator.share) {
                          try { await navigator.share({ title: "Feelify Session Invite", text: shareText }); } catch (e) {}
                        } else { await navigator.clipboard.writeText(shareText); }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold transition-all shadow-md shadow-emerald-500/20"
                    >
                      <ShareIcon size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const s = activeSessions.find((s) => s.inviteCode === createdInviteCode);
                  if (s) navigate(`/session/${s._id}`);
                  setCreatedInviteCode(null);
                }}
                className="bg-emerald-500 text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 hover:scale-[1.02] active:scale-95"
              >
                Go to Session <ArrowRightIcon size={15} />
              </button>
            </div>
          </motion.section>
        )}

        {/* JOIN BY INVITE CODE */}
        <motion.section variants={sectionItem} className="mb-10">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden scan-line-overlay">
            <div className="absolute -top-10 -right-10 size-48 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4 px-6 py-4">
              <div className="size-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 animate-glow-pulse">
                <TicketIcon className="text-white size-5" />
              </div>
              <div className="shrink-0">
                <p className="text-sm font-black text-white">Join Session</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Enter invite code</p>
              </div>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
                placeholder="A1B2C3"
                maxLength={6}
                className="flex-1 mx-4 px-5 py-3 bg-white/6 border border-white/10 rounded-xl text-xl font-mono font-black tracking-[0.4em] text-white placeholder:text-slate-600 placeholder:tracking-widest placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all uppercase text-center"
              />
              <button
                onClick={handleJoinByCode}
                disabled={joinByCodeMutation.isPending || !joinCode.trim()}
                className={`shrink-0 px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  !joinCode.trim()
                    ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/8"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95"
                }`}
              >
                {joinByCodeMutation.isPending ? <LoaderIcon size={15} className="animate-spin" /> : <ArrowRightIcon size={15} />}
                Join
              </button>
            </div>
          </div>
        </motion.section>

        <div className="space-y-12">

          {/* LIVE ACTIVITY */}
          <motion.div variants={sectionItem}>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Live Activity</h2>
            </div>
            <ActiveSessions sessions={activeSessions} isLoading={loadingActiveSessions} isUserInSession={isUserInSession} />
          </motion.div>

          {/* MASTERY MODULES */}
          <motion.section variants={sectionItem}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-1.5 bg-violet-400/60 rounded-full" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Mastery Modules</h2>
            </div>
            <AcademicTopics />
          </motion.section>

          {/* RECENT LOGS */}
          <motion.section variants={sectionItem} className="pt-10 border-t border-white/8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="size-1.5 border border-slate-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Recent Logs</h2>
              </div>
              <Link to="/history" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-colors group">
                View All <ChevronRightIcon size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
          </motion.section>

        </div>
      </motion.main>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </div>
  );
}

export default DashboardPage;