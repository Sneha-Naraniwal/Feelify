import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef, Component, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { sessionApi } from "../api/sessions";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, PhoneOffIcon, ShieldCheckIcon, ChevronLeftIcon, EyeOffIcon, TimerIcon, EyeIcon, BanIcon, ClockIcon, HandIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import HostControlBar from "../components/HostControlBar";
import WaitingRoom from "../components/WaitingRoom";
import useStreamClient from "../hooks/useStreamClient";
import { useCodeSync, useRunRequest } from "../hooks/useCodeSync";
import { useProctoring } from "../hooks/useProctoring";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import RateParticipantModal from "../components/RateParticipantModal";
import RateHostModal from "../components/RateHostModal";
import toast from "react-hot-toast";

// ── Session timer constants (outside component — stable references) ─────────
const SESSION_LIMIT_MS = 60 * 60 * 1000; // 60 minutes
const WARNING_AT_MS    = 58 * 60 * 1000; // warn at 58 minutes

// Error boundary to catch Stream SDK crashes
class StreamErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Stream component crashed (caught):", error.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center p-8 text-center">
          <div>
            <PhoneOffIcon className="size-12 text-rose-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-900">Session Ended</h2>
            <p className="text-sm text-slate-500 mt-1">Redirecting to dashboard...</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [participantRequests, setParticipantRequests] = useState([]);

  // Rating modal state (shown after session ends)
  const [showRateParticipant, setShowRateParticipant] = useState(false);
  const [showRateHost, setShowRateHost]               = useState(false);
  const [endedSessionId, setEndedSessionId]           = useState(null);
  const [endedSession, setEndedSession]               = useState(null);
  // Prevents the auto-redirect from firing before the participant sees the rating modal
  const ratingShownRef = useRef(false);

  // Track question progress locally+-.
  0

  
  const [questionProgress, setQuestionProgress] = useState([]);
  const cheatingAlertsRef = useRef([]);

  // ── Session Timer state ───────────────────────────────────────────────────
  const [timeElapsedMs, setTimeElapsedMs] = useState(0);
  const warningFiredRef    = useRef(false);
  const autoEndFiredRef    = useRef(false);
  // Stable ref so the timer effect never needs endSession in its deps
  const endSessionRef      = useRef(null);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  // Stream video/chat
  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session, loadingSession, isHost, isParticipant
  );

  // Code sync (participant sends, host receives)
  const { participantCode, participantLanguage, sendCodeSync } = useCodeSync(channel, isHost, isParticipant);

  // Run request/approval
  const { pendingRunRequest, runApproved, requestRun, respondToRun } = useRunRequest(channel, isHost, isParticipant);

  // Proctoring (participant monitored, host sees alerts)
  const { alerts } = useProctoring(channel, isParticipant);

  // Accumulate cheating alerts into ref for end-session payload
  useEffect(() => {
    if (alerts.length > 0) {
      cheatingAlertsRef.current = alerts.map((a) => ({ type: a.type, timestamp: a.timestamp }));
    }
  }, [alerts]);

  // Multi-problem support
  const problems = session?.problems || (session?.problem ? [session.problem] : []);
  const currentProblemIndex = session?.currentProblemIndex || 0;
  const currentProblemTitle = problems[currentProblemIndex] || problems[0];
  const problemData = currentProblemTitle
    ? Object.values(PROBLEMS).find((p) => p.title === currentProblemTitle)
    : null;

  // Initialise questionProgress when session loads
  useEffect(() => {
    if (!session || questionProgress.length > 0) return;
    const qp = (session.questionProgress?.length > 0
      ? session.questionProgress
      : problems.map((title) => ({ title, difficulty: session.difficulty === "mixed" ? "medium" : session.difficulty, solved: false, completionPct: 0 }))
    );
    setQuestionProgress(qp);
  }, [session]);

  // Mark current problem as solved when tests pass
  const markCurrentSolved = (pct = 100) => {
    setQuestionProgress((prev) => prev.map((q, i) =>
      i === currentProblemIndex ? { ...q, solved: pct >= 80, completionPct: pct } : q
    ));
  };

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Auto-join for participant (existing flow)
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Unified session-end handler — must run as ONE effect to avoid ordering races
  useEffect(() => {
    if (session?.status !== "completed") return;
    if (ratingShownRef.current) return; // already handled

    ratingShownRef.current = true;

    if (isParticipant) {
      // Participant: show rate-host modal
      setEndedSessionId(id);
      setShowRateHost(true);
    } else if (!isHost) {
      // Neither host nor participant (rare edge case) — just redirect
      navigate("/dashboard");
    }
    // Host case: handled inside handleEndSession (on mutation success)
  }, [session?.status, isParticipant, isHost, id, navigate]);

  // Reset code when problem changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage, currentProblemIndex]);

  // Host: mark as joined when entering session page
  useEffect(() => {
    if (isHost && session && !session.hostJoined) {
      sessionApi.setHostJoined(id).catch(() => {});
    }
  }, [isHost, session, id]);

  // Participant: poll for hostJoined status
  useEffect(() => {
    if (!isParticipant || !session || session.hostJoined) return;
    const interval = setInterval(() => refetch(), 3000);
    return () => clearInterval(interval);
  }, [isParticipant, session, refetch]);

  // Participant: sync code changes to host
  useEffect(() => {
    if (isParticipant && channel) {
      sendCodeSync(code, selectedLanguage);
    }
  }, [code, selectedLanguage, isParticipant, channel, sendCodeSync]);

  // Participant: handle run approval/denial
  useEffect(() => {
    if (!runApproved || !isParticipant) return;

    if (runApproved.approved) {
      toast.success("Host approved code execution!");
      setWaitingForApproval(false);
      // Actually run the code
      (async () => {
        setIsRunning(true);
        setOutput(null);
        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);
      })();
    } else {
      toast.error("Host denied code execution");
      setWaitingForApproval(false);
    }
  }, [runApproved]);

  // Poll for problem index changes (participant sees host navigation)
  useEffect(() => {
    if (!isParticipant || !session) return;
    const interval = setInterval(() => refetch(), 2000);
    return () => clearInterval(interval);
  }, [isParticipant, session, refetch]);

  // HOST: Listen for participant mic/camera requests & question reveal events
  useEffect(() => {
    if (!channel) return;

    const handler = (event) => {
      // Host hears participant requests
      if (event.type === "participant_request" && isHost) {
        setParticipantRequests((prev) => [
          { id: Date.now(), requestType: event.requestType },
          ...prev,
        ].slice(0, 10));
        toast(`Participant requests ${event.requestType === "mic" ? "microphone" : "camera"} toggle`, {
          icon: <HandIcon size={14} className="text-indigo-400" />,
        });
      }
      // Participant hears question reveal toggle
      if (event.type === "question_reveal" && isParticipant) {
        setQuestionRevealed(event.revealed);
      }
    };

    channel.on(handler);
    return () => channel.off(handler);
  }, [channel, isHost, isParticipant]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  // Participant: request to run (needs host approval)
  const handleParticipantRun = () => {
    if (waitingForApproval) return;
    setWaitingForApproval(true);
    requestRun(code, selectedLanguage);
    toast("Run request sent t11o host...", {
      icon: <ClockIcon size={14} className="text-amber-400" />,
    });
  };

  // Host: run their own code freely
  const handleHostRun = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  // Host: navigate problems
  const handleSetProblem = async (index) => {
    try {
      await sessionApi.setProblemIndex(id, index);
      refetch();
    } catch (err) {
      toast.error("Failed to change problem");
    }
  };

  // Host: approve/deny run
  const handleApproveRun = (requestId) => {
    respondToRun(true, requestId);
    toast.success("Run approved");
  };
  const handleDenyRun = (requestId) => {
    respondToRun(false, requestId);
    toast("Run denied", { icon: <BanIcon size={14} className="text-rose-400" /> });
  };

  // Host: toggle question visibility for participant
  const handleToggleReveal = () => {
    const newState = !questionRevealed;
    setQuestionRevealed(newState);
    if (channel) {
      try {
        channel.sendEvent({ type: "question_reveal", revealed: newState });
      } catch (err) {
        console.warn("Reveal event failed:", err.message);
      }
    }
    toast(newState ? "Question revealed to participant" : "Question hidden from participant", {
      icon: newState
        ? <EyeIcon size={14} className="text-emerald-400" />
        : <EyeOffIcon size={14} className="text-slate-400" />,
    });
  };

  // Host: dismiss a participant request
  const handleDismissRequest = (reqId) => {
    setParticipantRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  // Host: approve participant mic/camera request → send grant event
  const handleApproveMediaRequest = (mediaType) => {
    if (!channel) return;
    try {
      channel.sendEvent({
        type: "media_grant",
        mediaType, // "mic" or "camera"
      });
      toast.success(`${mediaType === "mic" ? "Microphone" : "Camera"} toggle granted to participant`);
    } catch (err) {
      console.warn("Media grant event failed:", err.message);
    }
  };

  const handleEndSession = useCallback((skipConfirm = false) => {
    setShowEndConfirm(false);
    setIsEnding(true);
    endSessionMutation.mutate(
      { id, questionProgress, cheatingAlerts: cheatingAlertsRef.current },
      {
        onSuccess: (data) => {
          const s = data?.session;
          ratingShownRef.current = true;
          setEndedSessionId(id);
          setEndedSession(s);
          setIsEnding(false);
          if (s?.participant) {
            setShowRateParticipant(true);
          } else {
            navigate("/history");
          }
        },
        onError: () => {
          setIsEnding(false);
          navigate("/dashboard");
        },
      }
    );
  }, [id, questionProgress, navigate]); // ← endSessionMutation intentionally excluded (via ref)

  // Keep ref in sync so the timer can call handleEndSession without stale closure
  useEffect(() => { endSessionRef.current = handleEndSession; }, [handleEndSession]);

  // ── Session Timer Effect ──────────────────────────────────────
  useEffect(() => {
    if (!session?.startedAt || session?.status === "completed") return;

    const startTime = new Date(session.startedAt).getTime();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      setTimeElapsedMs(elapsed);

      // 58-min warning — host only
      if (isHost && !warningFiredRef.current && elapsed >= WARNING_AT_MS) {
        warningFiredRef.current = true;
        toast(
          () => (
            <div className="flex flex-col gap-1">
              <span className="font-black text-sm">2 minutes remaining</span>
              <span className="text-xs text-slate-500">Session will auto-end at 60 minutes.</span>
            </div>
          ),
          { duration: 10000, icon: <TimerIcon size={14} className="text-amber-400" /> }
        );
      }

      // 60-min auto-end — host only, once
      if (isHost && !autoEndFiredRef.current && elapsed >= SESSION_LIMIT_MS) {
        autoEndFiredRef.current = true;
        toast.error("Session time limit reached. Ending session automatically.", { duration: 5000 });
        endSessionRef.current?.(true); // call via ref — no stale closure risk
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session?.startedAt, session?.status, isHost]); // ← no handleEndSession in deps

  // After host rates (or skips), navigate to history
  const handleRateParticipantDone = () => {
    setShowRateParticipant(false);
    navigate("/history");
  };

  // (participant rating effect merged into unified session-end handler above)

  const handleRateHostDone = () => {
    setShowRateHost(false);
    navigate("/history");
  };

  // ═══ RENDER STATES ═══

  if (isEnding) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="size-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ending Session...</p>
      </div>
    );
  }

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="size-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  // WAITING ROOM: participant waits for host
  if (isParticipant && session && !session.hostJoined) {
    return <WaitingRoom session={session} />;
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">

      {/* RATING MODALS — shown after session ends */}
      {showRateParticipant && endedSessionId && (
        <RateParticipantModal
          sessionId={endedSessionId}
          participantName={endedSession?.participant?.name || "Participant"}
          problems={endedSession?.problems || problems}
          onSubmit={handleRateParticipantDone}
          onSkip={handleRateParticipantDone}
        />
      )}
      {showRateHost && endedSessionId && (
        <RateHostModal
          sessionId={endedSessionId}
          hostName={session?.host?.name || "Host"}
          onSubmit={handleRateHostDone}
          onSkip={handleRateHostDone}
        />
      )}

      {/* SESSION HEADER */}
      <header className="h-14 border-b border-white/8 flex items-center justify-between px-5 bg-slate-900/95 backdrop-blur-sm shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 hover:bg-white/8 rounded-lg transition-colors text-slate-500 hover:text-slate-200">
            <ChevronLeftIcon size={18} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white uppercase tracking-tight">{currentProblemTitle}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isHost ? "Host" : "Participant"} · {session?.host?.name}
              </span>
              <span className="size-1 bg-white/15 rounded-full" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{session?.difficulty}</span>
              {problems.length > 1 && (
                <>
                  <span className="size-1 bg-white/15 rounded-full" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Q{currentProblemIndex + 1}/{problems.length}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">

          {/* SESSION COUNTDOWN TIMER */}
          {session?.status === "active" && (() => {
            const remaining = Math.max(0, SESSION_LIMIT_MS - timeElapsedMs);
            const totalSec  = Math.ceil(remaining / 1000);
            const mins      = Math.floor(totalSec / 60);
            const secs      = totalSec % 60;
            const display   = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            const isUrgent  = remaining <= 2 * 60 * 1000;
            const isWarning = remaining <= 5 * 60 * 1000;
            return (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-black text-sm transition-all ${
                isUrgent
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-400 animate-pulse"
                  : isWarning
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}>
                <TimerIcon size={12} />
                {display}
              </div>
            );
          })()}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/8">
            <ShieldCheckIcon className="size-3 text-emerald-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isHost ? "Host View" : "Proctored"}
            </span>
          </div>

          {isHost && (
            showEndConfirm ? (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-1.5">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">End session?</span>
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-200 px-2 py-1 rounded-md hover:bg-white/8 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEndSession(true)}
                  disabled={endSessionMutation.isPending}
                  className="bg-rose-500 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors flex items-center gap-1.5"
                >
                  <PhoneOffIcon size={11} />
                  Confirm
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEndConfirm(true)}
                disabled={endSessionMutation.isPending}
                className="bg-rose-500/10 text-rose-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-2 border border-rose-500/20"
              >
                <PhoneOffIcon size={13} /> End Session
              </button>
            )
          )}
        </div>
      </header>

      {/* HOST CONTROL BAR (only for host, only if multi-problem or for proctoring) */}
      {isHost && (
        <HostControlBar
          currentIndex={currentProblemIndex}
          totalProblems={problems.length}
          onSetProblem={handleSetProblem}
          pendingRunRequest={pendingRunRequest}
          onApproveRun={handleApproveRun}
          onDenyRun={handleDenyRun}
          alerts={alerts}
          questionRevealed={questionRevealed}
          onToggleReveal={handleToggleReveal}
          participantRequests={participantRequests}
          onDismissRequest={handleDismissRequest}
          onApproveMediaRequest={handleApproveMediaRequest}
        />
      )}

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* LEFT SIDE: PROBLEM & EDITOR */}
          <Panel defaultSize={50} minSize={35}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESCRIPTION */}
              <Panel defaultSize={30} minSize={15}>
                <div className="h-full overflow-y-auto bg-[#0f1117] border-b border-white/6 p-6 no-scrollbar relative">
                  {/* Blur overlay for participant when question is hidden */}
                  {isParticipant && !questionRevealed && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1117]/90 backdrop-blur-md">
                      <div className="text-center">
                        <EyeOffIcon className="size-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-500">Question Hidden</p>
                        <p className="text-xs text-slate-600 mt-1">Waiting for host to reveal the question...</p>
                      </div>
                    </div>
                  )}
                  <div className={`${isParticipant ? "no-select" : ""} ${isParticipant && !questionRevealed ? "question-blur" : ""}`}>
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4">Objective</h2>
                    <div className="text-slate-400 font-medium leading-relaxed text-sm space-y-3">
                      <p>{problemData?.description?.text}</p>
                      {problemData?.description?.notes?.map((note, idx) => (
                        <p key={idx} className="text-slate-500 text-sm italic">Note: {note}</p>
                      ))}
                    </div>

                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mt-8 mb-4">Constraints</h2>
                    <div className="flex flex-wrap gap-2">
                      {problemData?.constraints?.map((c, i) => (
                        <code key={i} className="bg-white/5 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-white/8">{c}</code>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-[1px] bg-white/6 hover:bg-indigo-500/40 transition-colors" />

              {/* EDITOR & OUTPUT */}
              <Panel defaultSize={70}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={75}>
                    {isHost ? (
                      /* HOST: Split view — participant code (read-only) on top */
                      <PanelGroup direction="horizontal">
                        <Panel defaultSize={50}>
                          <CodeEditorPanel
                            selectedLanguage={participantLanguage}
                            code={participantCode}
                            isRunning={false}
                            readOnly={true}
                            label="Participant's Code"
                            showRunButton={false}
                          />
                        </Panel>
                        <PanelResizeHandle className="w-[1.5px] bg-slate-700 hover:bg-indigo-400 transition-colors" />
                        <Panel defaultSize={50}>
                          <CodeEditorPanel
                            selectedLanguage={selectedLanguage}
                            code={code}
                            isRunning={isRunning}
                            onLanguageChange={handleLanguageChange}
                            onCodeChange={setCode}
                            onRunCode={handleHostRun}
                            label="Scratchpad"
                          />
                        </Panel>
                      </PanelGroup>
                    ) : (
                      /* PARTICIPANT: Their editor with request-to-run */
                      <div className="h-full relative">
                        {!questionRevealed && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1e1e1e]/90 backdrop-blur-sm">
                            <div className="text-center">
                              <EyeOffIcon className="size-10 text-zinc-500 mx-auto mb-3" />
                              <p className="text-sm font-bold text-zinc-400">Editor Locked</p>
                              <p className="text-xs text-zinc-500 mt-1">Host will reveal the question soon...</p>
                            </div>
                          </div>
                        )}
                        <CodeEditorPanel
                          selectedLanguage={selectedLanguage}
                          code={code}
                          isRunning={waitingForApproval || isRunning}
                          onLanguageChange={handleLanguageChange}
                          onCodeChange={questionRevealed ? setCode : undefined}
                          onRunCode={handleParticipantRun}
                          runButtonLabel={waitingForApproval ? "Awaiting Approval" : "Request Run"}
                          label="Your Code"
                          readOnly={!questionRevealed}
                          showRunButton={questionRevealed}
                          blockClipboard={true}
                        />
                      </div>
                    )}
                  </Panel>
                  <PanelResizeHandle className="h-[1px] bg-white/6 hover:bg-indigo-500/40 transition-colors" />
                  <Panel defaultSize={25}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-white/6 hover:bg-indigo-500/40 transition-colors" />

          {/* RIGHT SIDE: VIDEO & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-slate-950">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                   <div className="text-center">
                     <div className="size-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest text-slate-600">Initializing Media...</p>
                   </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center p-8 text-center">
                   <div>
                     <PhoneOffIcon className="size-12 text-rose-400/40 mx-auto mb-4" />
                     <h2 className="text-lg font-bold text-white">Media Error</h2>
                     <p className="text-sm text-slate-500 mt-1">Check your camera/mic permissions.</p>
                   </div>
                </div>
              ) : (
                <StreamErrorBoundary>
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} isHost={isHost} />
                    </StreamCall>
                  </StreamVideo>
                </StreamErrorBoundary>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;