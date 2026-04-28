import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, Component } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, ShieldCheckIcon, ChevronLeftIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import toast from "react-hot-toast";

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

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session, loadingSession, isHost, isParticipant
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  useEffect(() => {
    if (session?.status === "completed") {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("End this session for everyone?")) {
      // Set ending state FIRST to unmount Stream components before they crash
      setIsEnding(true);

      endSessionMutation.mutate(id, {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: () => {
          // Even if API fails, redirect
          navigate("/dashboard");
        },
        onSettled: () => {
          // Ultimate fallback — always navigate after mutation completes
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        },
      });
    }
  };

  // Show ending screen — Stream components are unmounted to prevent crashes
  if (isEnding) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2Icon className="animate-spin text-indigo-600 size-10" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ending Session...</p>
      </div>
    );
  }

  if (loadingSession) return <div className="h-screen flex items-center justify-center bg-white"><Loader2Icon className="animate-spin text-indigo-600 size-10" /></div>;

  return (
    /* NOTICE: No <Navbar /> here. We use a custom local header instead. */
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      
      {/* SESSION HEADER */}
      <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
            <ChevronLeftIcon size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">{session?.problem}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Host: {session?.host?.name}</span>
              <span className="size-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{session?.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <ShieldCheckIcon className="size-3 text-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Session</span>
          </div>

          {isHost && (
            <button
              onClick={handleEndSession}
              disabled={endSessionMutation.isPending}
              className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2 border border-rose-100"
            >
              <PhoneOffIcon size={14} /> End Session
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* LEFT SIDE: PROBLEM & EDITOR */}
          <Panel defaultSize={50} minSize={35}>
            <PanelGroup direction="vertical">
              {/* COMPACT PROBLEM DESCRIPTION */}
              <Panel defaultSize={40} minSize={20}>
                <div className="h-full overflow-y-auto bg-white border-b border-slate-100 p-8 no-scrollbar">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Objective</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 font-medium leading-relaxed">{problemData?.description?.text}</p>
                    {problemData?.description?.notes?.map((note, idx) => (
                      <p key={idx} className="text-slate-400 text-sm italic mt-4">Note: {note}</p>
                    ))}
                  </div>

                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-10 mb-6">Constraints</h2>
                  <div className="flex flex-wrap gap-2">
                    {problemData?.constraints?.map((c, i) => (
                      <code key={i} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100">{c}</code>
                    ))}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-[1.5px] bg-slate-100 hover:bg-indigo-400 transition-colors" />

              {/* EDITOR & OUTPUT */}
              <Panel defaultSize={60}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={75}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-[1.5px] bg-slate-100 hover:bg-indigo-400 transition-colors" />
                  <Panel defaultSize={25}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-[1.5px] bg-slate-100 hover:bg-indigo-400 transition-colors" />

          {/* RIGHT SIDE: VIDEO & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-slate-50">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                   <div className="text-center">
                     <Loader2Icon className="size-10 animate-spin text-indigo-600 mx-auto mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400">Initializing Media...</p>
                   </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center p-8 text-center">
                   <div>
                     <PhoneOffIcon className="size-12 text-rose-300 mx-auto mb-4" />
                     <h2 className="text-lg font-bold text-slate-900">Media Error</h2>
                     <p className="text-sm text-slate-500 mt-1">Check your camera/mic permissions.</p>
                   </div>
                </div>
              ) : (
                <StreamErrorBoundary>
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
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