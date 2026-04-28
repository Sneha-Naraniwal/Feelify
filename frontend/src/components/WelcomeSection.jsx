import React from "react";
import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative group">
      {/* BACKGROUND GLOWS - These stay to keep the "fancy" depth */}
      <div className="absolute -top-24 -left-20 size-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 size-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative bg-white/60 backdrop-blur-xl border border-white rounded-[3.5rem] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} 
        />

        <div className="relative z-10 flex flex-row items-center justify-between gap-12">
          
          <div className="flex-1">
            {/* REMOVED: The "System_Online" Badge. 
                This gives the Name Header more "breathing room" at the top.
            */}

            <div className="flex items-start gap-10">
              {/* BRAND ICON WITH PULSE */}
              <div className="relative hidden xl:block">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative size-24 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <SparklesIcon className="size-12 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                {/* NAME HEADER */}
                <h1 className="text-6xl font-bold text-slate-900 tracking-tighter leading-[0.85] mb-10">
                  Welcome back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500">
                    {user?.firstName || "Operator"}
                  </span>
                </h1>
                
                {/* MOTIVATIONAL SECTION - Clean and Large */}
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-[2px] w-14 bg-gradient-to-r from-indigo-500 to-transparent flex-shrink-0" />
                    
                    <p className="text-3xl md:text-4xl font-medium text-slate-500 tracking-tight italic leading-tight max-w-3xl">
                      "Go beyond the <span className="text-slate-900 font-bold not-italic">limits</span>, we live once so why not <span className="relative inline-block text-indigo-600 font-bold not-italic">
                        live it fully
                        <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-indigo-200/60 rounded-full" />
                      </span>?"
                    </p>
                  </div>
                  
                  {/* BREAKTHROUGH TAG */}
                  <div className="flex items-center gap-3 ml-20">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100/50 shadow-sm">
                      <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.25em]">
                        Ready for Breakthrough
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON PILL */}
          <div className="flex-shrink-0">
            <button
              onClick={onCreateSession}
              className="group relative flex items-center gap-6 bg-slate-900 hover:bg-black p-2 rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 overflow-hidden"
            >
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000" />

              <div className="size-20 bg-gradient-to-br from-indigo-500 via-violet-600 to-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                <ZapIcon className="size-8 text-white fill-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col items-start pr-10">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 group-hover:text-indigo-400 transition-colors">Initiate</span>
                <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-4">
                  Create Session
                  <ArrowRightIcon className="size-6 text-indigo-400 group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;