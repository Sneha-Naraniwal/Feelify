import { formatDistanceToNow } from "date-fns";
import { Clock, Trophy, Layout, ChevronRight, Hash } from "lucide-react";

function RecentSessions({ sessions = [], isLoading }) {
  return (
    <div className="mt-20">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100/50">
            <Trophy className="text-amber-600 size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-70">Your historical logs</p>
          </div>
        </div>
        
        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors flex items-center gap-2 group">
          View All Logs <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session) => (
          <div 
            key={session._id} 
            className="group relative bg-white rounded-[2.5rem] p-8 border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Subtle numbering or background element */}
            <div className="absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Hash size={120} strokeWidth={4} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="size-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-500">
                  <Layout size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </span>
                  <div className="h-1 w-4 bg-emerald-400 rounded-full mt-1 animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">
                {session.problem}
              </h3>

              <div className="flex items-center gap-3 mb-8">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${
                  session.difficulty === 'hard' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                  session.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {session.difficulty}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-40">
                  // LOG_RECORD_SUCCESS
                </span>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} className="group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminal Synced</span>
                </div>
                <div className="size-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-black group-hover:text-white transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSessions;