import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions, useMyRank, useJoinByInviteCode } from "../hooks/useSessions";

// 1. IMPORT YOUR PROBLEMS DATA
import { PROBLEMS } from "../data/problems"; 

import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import AcademicTopics from "../components/AcademicTopics";
import WelcomeSection from "../components/WelcomeSection"; 
import { ActivityIcon, ShieldCheckIcon, ZapIcon, CopyIcon, CheckIcon, TicketIcon, ArrowRightIcon, LoaderIcon } from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [createdInviteCode, setCreatedInviteCode] = useState(null); // show after creation
  const [copiedCode, setCopiedCode] = useState(false);
  const [joinCode, setJoinCode] = useState(""); // for joining by code

  const createSessionMutation = useCreateSession();
  const joinByCodeMutation = useJoinByInviteCode();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: rankData, isLoading: loadingRank } = useMyRank();

  if (!isLoaded) return null;

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  // 2. CALCULATE TOTAL PROBLEMS COUNT
  const totalProblemsCount = Object.keys(PROBLEMS).length;

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase() },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          setCreatedInviteCode(data.session.inviteCode);
          // Don't auto-navigate — show the invite code first
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
    <div className="relative flex min-h-screen font-sans selection:bg-pink-500/30">
      
      {/* 🌸 ROSY BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-rose-100" />
        
        <div className="absolute top-[-10%] left-[-10%] size-[800px] rounded-full bg-pink-300/40 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-5%] size-[600px] rounded-full bg-rose-300/35 blur-[100px] [animation-delay:2s] animate-pulse" />
        <div className="absolute top-[20%] right-[10%] size-[500px] rounded-full bg-amber-200/30 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[20%] size-[400px] rounded-full bg-pink-400/25 blur-[100px] animate-pulse [animation-delay:4s]" />
        <div className="absolute top-[60%] left-[40%] size-[450px] rounded-full bg-rose-400/20 blur-[100px] animate-pulse [animation-delay:0.5s]" />
        
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      </div>

      <Navbar />

      <main className="flex-1 ml-64 p-12 transition-all duration-300 relative z-10">
        
        <section className="mb-12">
          <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
        </section>

        {/* 3. UPDATED STATS SECTION WITH DYNAMIC DATA */}
        <section className="mb-12">
          <StatsCards
            activeSessionsCount={activeSessions.length}
            recentSessionsCount={recentSessions.length}
            problemsCount={totalProblemsCount}
            globalRank={loadingRank ? "..." : `#${rankData?.rank || "--"}`}
          />
        </section>

        {/* ─── INVITE CODE BANNER (shown after creating a session) ─── */}
        {createdInviteCode && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-[2.5rem] p-8 flex items-center justify-between shadow-lg shadow-emerald-100/50">
              <div className="flex items-center gap-6">
                <div className="size-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
                  <TicketIcon className="text-white size-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em] mb-1">Session Created! Share This Invite Code</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black tracking-[0.3em] text-emerald-800 font-mono">{createdInviteCode}</span>
                    <button
                      onClick={() => handleCopyCode(createdInviteCode)}
                      className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all"
                    >
                      {copiedCode ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  // Find the session with this invite code from active sessions
                  const s = activeSessions.find((s) => s.inviteCode === createdInviteCode);
                  if (s) navigate(`/session/${s._id}`);
                  setCreatedInviteCode(null);
                }}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
              >
                Go to Session <ArrowRightIcon size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ─── JOIN BY INVITE CODE ─── */}
        <section className="mb-12">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
                <TicketIcon className="text-white size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Join Session</h2>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">Enter invite code to join</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
                placeholder="Enter 6-digit code (e.g. A1B2C3)"
                maxLength={6}
                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-mono font-bold tracking-[0.3em] text-slate-900 placeholder:text-slate-300 placeholder:tracking-widest placeholder:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all uppercase"
              />
              <button
                onClick={handleJoinByCode}
                disabled={joinByCodeMutation.isPending || !joinCode.trim()}
                className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                  !joinCode.trim()
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95"
                }`}
              >
                {joinByCodeMutation.isPending ? (
                  <LoaderIcon size={16} className="animate-spin" />
                ) : (
                  <ArrowRightIcon size={16} />
                )}
                Join
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-700/80">Live Activity</h2>
              </div>
              <ActiveSessions
                sessions={activeSessions}
                isLoading={loadingActiveSessions}
                isUserInSession={isUserInSession}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <ActivityIcon size={14} className="text-rose-500/70" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-700/80">System Monitor</h2>
              </div>
              
              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-rose-200/50 shadow-[0_8px_30px_rgba(190,18,60,0.08)] flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <ShieldCheckIcon size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Systems Active</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Global node synchronization complete. Optimized for {user?.firstName || 'User'}'s workspace.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-rose-400/70 tracking-tighter">
                      <span>Latency</span>
                      <span className="text-slate-800 font-mono">18ms</span>
                    </div>
                    <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 w-[12%]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-rose-400/70 tracking-tighter">
                      <span>Efficiency</span>
                      <span className="text-slate-800 font-mono">99%</span>
                    </div>
                    <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-rose-100/50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <ZapIcon size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Pro Environment</span>
                   </div>
                   <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-2 bg-rose-400/80 rounded-full" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-700/80">Mastery Modules</h2>
            </div>
            <AcademicTopics />
          </section>

          <section className="pt-12 border-t border-rose-100/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-2 border-2 border-rose-400/60 rounded-full" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-700/80">Recent Logs</h2>
            </div>
            <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
          </section>

        </div>
      </main>

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