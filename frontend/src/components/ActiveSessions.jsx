import React, { useState } from "react";
import { ArrowRightIcon, Code2Icon, UsersIcon, LoaderIcon, ZapIcon, CopyIcon, CheckIcon, TicketIcon } from "lucide-react";
import { Link } from "react-router";

function ActiveSessions({ sessions = [], isLoading, isUserInSession }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
            <ZapIcon className="text-white size-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Sessions</h2>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">Invite Only</p>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2 shadow-lg shadow-black/10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest">{sessions.length} Active</span>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <LoaderIcon className="animate-spin text-slate-300 size-8" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syncing...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
            <TicketIcon size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active sessions</p>
            <p className="text-slate-300 text-[10px] mt-1">Create a session and share the invite code</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session._id} 
              className="group relative bg-white/50 hover:bg-white p-5 rounded-[1.5rem] border border-transparent hover:border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Code2Icon className="text-white size-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-md font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {session.problem}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                        {session.difficulty}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-tighter">
                        <UsersIcon size={12} />
                        <span>{session.participant ? "Full" : "1/2 Open"}</span>
                      </div>
                      {/* Invite Code Badge */}
                      {session.inviteCode && (
                        <button
                          onClick={(e) => { e.preventDefault(); handleCopy(session.inviteCode, session._id); }}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-100 hover:bg-emerald-100 transition-all"
                        >
                          <TicketIcon size={10} />
                          {session.inviteCode}
                          {copiedId === session._id ? <CheckIcon size={10} /> : <CopyIcon size={10} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <Link 
                  to={`/session/${session._id}`}
                  className="bg-black text-white px-6 py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.15em] transition-all hover:bg-slate-800 shadow-md flex items-center gap-2"
                >
                  {isUserInSession(session) ? "Resume" : "Enter"}
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;