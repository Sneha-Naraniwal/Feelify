import React from "react";
import { DatabaseIcon, NetworkIcon, CpuIcon, ArrowRightIcon, TerminalIcon, BookOpenIcon, LayersIcon, GitBranchIcon } from "lucide-react";
import { Link } from "react-router";

function AcademicTopics() {
  const topics = [
    { 
      id: "os", 
      title: "Operating Systems", 
      tag: "SYS_KERNEL_V1", 
      icon: <CpuIcon size={24} />, 
      gradient: "from-indigo-500 to-blue-600",
      lightColor: "bg-indigo-50/50",
      shadowColor: "shadow-indigo-200/60",
      textColor: "text-indigo-600",
      count: "10 Questions"
    },
    { 
      id: "dbms", 
      title: "Database Systems", 
      tag: "DB_SCHEMA_SQL", 
      icon: <DatabaseIcon size={24} />, 
      gradient: "from-emerald-400 to-teal-600",
      lightColor: "bg-emerald-50/50",
      shadowColor: "shadow-emerald-200/60",
      textColor: "text-emerald-600",
      count: "10 Questions"
    },
    { 
      id: "oops", 
      title: "OOP Concepts", 
      tag: "CLASS_INHERIT_V2", 
      icon: <LayersIcon size={24} />, 
      gradient: "from-violet-500 to-purple-600",
      lightColor: "bg-violet-50/50",
      shadowColor: "shadow-violet-200/60",
      textColor: "text-violet-600",
      count: "10 Questions"
    },
    { 
      id: "cn", 
      title: "Computer Networks", 
      tag: "NET_PROTOCOL_TCP", 
      icon: <NetworkIcon size={24} />, 
      gradient: "from-rose-500 to-orange-600",
      lightColor: "bg-rose-50/50",
      shadowColor: "shadow-rose-200/60",
      textColor: "text-rose-600",
      count: "10 Questions"
    },
    { 
      id: "dsa", 
      title: "DSA", 
      tag: "ALGO_STRUCT_V3", 
      icon: <GitBranchIcon size={24} />, 
      gradient: "from-amber-400 to-orange-500",
      lightColor: "bg-amber-50/50",
      shadowColor: "shadow-amber-200/60",
      textColor: "text-amber-600",
      count: "10 Questions"
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/8">
      
      {/* SECTION HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 bg-white/8 border border-white/10 rounded-xl flex items-center justify-center">
          <BookOpenIcon className="text-violet-400 size-5" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Academic Modules</h2>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em]">Curated Interview Prep</p>
        </div>
      </div>

      {/* TOPIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="group relative bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 p-6 rounded-xl transition-all duration-300 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`size-12 bg-gradient-to-br ${topic.gradient} rounded-xl flex items-center justify-center text-white/90 shadow-lg group-hover:scale-110 transition-all duration-500`}>
                  {React.cloneElement(topic.icon, { size: 20, strokeWidth: 2 })}
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Ready
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                {topic.title}
              </h3>
              <div className="flex items-center gap-1.5 mb-7">
                <TerminalIcon size={11} className="text-slate-600" />
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">// {topic.tag}</span>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{topic.count}</span>
                <Link
                  to={`/academic?subject=${topic.id}`}
                  className="size-9 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-full flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                >
                  <ArrowRightIcon size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcademicTopics;