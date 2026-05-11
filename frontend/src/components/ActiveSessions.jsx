import React, { useState } from "react";
import { IconArrowRight, IconCode, IconUsers, IconLoader, IconBolt, IconCopy, IconCheck, IconTicket } from "@tabler/icons-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const listItem = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function ActiveSessions({ sessions = [], isLoading, isUserInSession }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/8 border border-white/10 rounded-xl flex items-center justify-center">
            <IconBolt stroke={1.5} className="text-indigo-400 size-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">My Sessions</h2>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Invite Only</p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">{sessions.length} Active</span>
        </motion.div>
      </div>

      {/* SESSIONS LIST */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-14 flex flex-col items-center gap-3"
          >
            <IconLoader stroke={1.5} className="animate-spin text-slate-600 size-7" />
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Syncing...</span>
          </motion.div>
        ) : sessions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-12 text-center border border-dashed border-white/8 rounded-xl bg-white/3"
          >
            <IconTicket size={30} stroke={1.5} className="mx-auto text-slate-700 mb-3 animate-float" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active sessions</p>
            <p className="text-slate-600 text-[10px] mt-1">Create a session and share the invite code</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {sessions.map((session) => (
              <motion.div
                key={session._id}
                variants={listItem}
                whileHover={{ x: 3, transition: { duration: 0.2 } }}
                className="group relative bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 p-4 rounded-xl transition-all duration-300 shimmer-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                      <IconCode stroke={1.5} className="text-indigo-400 size-5" />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                        {session.problems?.length > 1
                          ? `${session.problems[0]} +${session.problems.length - 1} more`
                          : session.problems?.[0] || session.problem}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-500/20">
                          {session.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500 font-bold text-[9px] uppercase tracking-tighter">
                          <IconUsers size={11} stroke={1.5} />
                          <span>{session.participant ? "Full" : "1/2 Open"}</span>
                        </div>
                        {session.inviteCode && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleCopy(session.inviteCode, session._id); }}
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                          >
                            <IconTicket size={9} stroke={1.5} />
                            {session.inviteCode}
                            <AnimatePresence mode="wait">
                              {copiedId === session._id ? (
                                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <IconCheck size={9} stroke={2.5} />
                                </motion.span>
                              ) : (
                                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <IconCopy size={9} stroke={1.5} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/session/${session._id}`}
                    className="bg-white/8 hover:bg-white/14 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 hover:gap-3"
                  >
                    {isUserInSession(session) ? "Resume" : "Enter"}
                    <IconArrowRight size={12} stroke={2} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActiveSessions;