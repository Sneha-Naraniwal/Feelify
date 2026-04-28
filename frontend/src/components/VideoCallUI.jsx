import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <div className="size-20 bg-white rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center mb-6">
          <Loader2Icon className="size-8 animate-spin text-indigo-600" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Establishing Connection</p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4 p-4 bg-slate-50 relative str-video no-scrollbar">
      {/* MAIN VIDEO AREA */}
      <div className="flex-1 flex flex-col gap-4">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2 border border-emerald-100">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Live</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <UsersIcon size={14} />
              <span className="text-xs font-bold uppercase tracking-tight">
                {participantCount} {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-300 mr-4">
              <ShieldCheckIcon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isChatOpen 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <MessageSquareIcon size={14} />
                Chat
              </button>
            )}
          </div>
        </div>

        {/* SPEAKER VIEW - The "Cinematic" look */}
        <div className="flex-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          <SpeakerLayout />
          
          {/* CUSTOM FLOATING CONTROLS */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
             <div className="bg-white/10 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                <CallControls onLeave={() => navigate("/dashboard")} />
             </div>
          </div>
        </div>
      </div>

      {/* MODERN CHAT SIDEBAR */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 overflow-hidden bg-white border border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isChatOpen ? "w-96 opacity-100" : "w-0 opacity-0 invisible"
          }`}
        >
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Session Chat</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time messaging</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="size-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden premium-chat-styles">
            <Chat client={chatClient} theme="str-chat__theme-light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <div className="p-4 bg-white border-t border-slate-50">
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