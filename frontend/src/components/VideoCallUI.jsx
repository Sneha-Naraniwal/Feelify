import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, ShieldCheckIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import toast from "react-hot-toast";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel, isHost = true }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useMicrophoneState, useCameraState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCamMuted } = useCameraState();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // PARTICIPANT: Request mic/camera toggle from host
  const handleParticipantRequest = (type) => {
    if (!channel) return;
    try {
      channel.sendEvent({
        type: "participant_request",
        requestType: type,
      });
      toast.success(`Requested host to ${type === "mic" ? "toggle your microphone" : "toggle your camera"}`);
    } catch (err) {
      console.warn("Request failed:", err.message);
    }
  };

  // Keep refs to the latest mic/cam state so the grant handler never goes stale
  const isMicMutedRef = useRef(isMicMuted);
  const isCamMutedRef = useRef(isCamMuted);
  const microphoneRef = useRef(microphone);
  const cameraRef     = useRef(camera);
  useEffect(() => { isMicMutedRef.current = isMicMuted; }, [isMicMuted]);
  useEffect(() => { isCamMutedRef.current = isCamMuted; }, [isCamMuted]);
  useEffect(() => { microphoneRef.current = microphone; }, [microphone]);
  useEffect(() => { cameraRef.current     = camera;     }, [camera]);

  // PARTICIPANT: Listen for host approval to toggle own mic/camera
  useEffect(() => {
    if (!channel || isHost) return;

    const handler = (event) => {
      if (event.type !== "media_grant") return;
      if (event.mediaType === "mic") {
        if (isMicMutedRef.current) {
          microphoneRef.current.enable();
          toast.success("Host enabled your microphone");
        } else {
          microphoneRef.current.disable();
          toast("Host muted your microphone", { icon: <MicOffIcon size={14} className="text-rose-400" /> });
        }
      }
      if (event.mediaType === "camera") {
        if (isCamMutedRef.current) {
          cameraRef.current.enable();
          toast.success("Host enabled your camera");
        } else {
          cameraRef.current.disable();
          toast("Host turned off your camera", { icon: <VideoOffIcon size={14} className="text-rose-400" /> });
        }
      }
    };

    channel.on(handler);
    return () => channel.off(handler);
  // Only re-register if channel or role changes — NOT on every mic/cam toggle
  }, [channel, isHost]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-950">
        <div className="size-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin mb-5" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Establishing Connection</p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 p-3 bg-slate-950 relative str-video no-scrollbar">
      {/* MAIN VIDEO AREA */}
      <div className="flex-1 flex flex-col gap-3">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-white/8">
          <div className="flex items-center gap-4">
            <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center gap-2 border border-emerald-500/20">
              <div className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Live</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <UsersIcon size={13} />
              <span className="text-xs font-bold uppercase tracking-tight">
                {participantCount} {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-600 mr-2">
              <ShieldCheckIcon size={13} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isHost ? "Host Controls" : "Proctored"}
              </span>
            </div>
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  isChatOpen
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/6 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                }`}
              >
                <MessageSquareIcon size={13} />
                Chat
              </button>
            )}
          </div>
        </div>

        {/* SPEAKER VIEW */}
        <div className="flex-1 bg-zinc-900 rounded-2xl overflow-hidden relative shadow-2xl">
          <SpeakerLayout />

          {/* CONTROLS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            {isHost ? (
              <div className="bg-white/10 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                <CallControls onLeave={() => navigate("/dashboard")} />
              </div>
            ) : (
              <div className="bg-slate-900/90 backdrop-blur-xl px-4 py-2.5 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-3">
                <button
                  onClick={() => handleParticipantRequest("mic")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider ${
                    isMicMuted
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/25 hover:bg-rose-500/25"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25"
                  }`}
                >
                  {isMicMuted ? <MicOffIcon size={13} /> : <MicIcon size={13} />}
                  {isMicMuted ? "Request Unmute" : "Request Mute"}
                </button>
                <button
                  onClick={() => handleParticipantRequest("camera")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider ${
                    isCamMuted
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/25 hover:bg-rose-500/25"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25"
                  }`}
                >
                  {isCamMuted ? <VideoOffIcon size={13} /> : <VideoIcon size={13} />}
                  {isCamMuted ? "Request Camera On" : "Request Camera Off"}
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <ShieldCheckIcon size={11} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Proctored</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHAT SIDEBAR */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-slate-900 border border-white/8 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 invisible"
          }`}
        >
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">Session Chat</h3>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Real-time messaging</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="size-8 bg-white/6 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <XIcon size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden premium-chat-styles">
            <Chat client={chatClient} theme="str-chat__theme-dark">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <div className="p-3 bg-slate-900/80 border-t border-white/8">
                    <MessageInput grow />
                  </div>
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;