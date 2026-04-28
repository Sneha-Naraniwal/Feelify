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
    <div className="bg-white/70 backdrop-blur-md rounded-[3.5rem] p-12 border border-white shadow-[0_30px_60px_rgba(0,0,0,0.03)]">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
            <BookOpenIcon className="text-white size-7" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Academic Modules
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
              Curated Interview Prep
            </p>
          </div>
        </div>
      </div>

      {/* TOPIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-700 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                
                {/* Subject Icon Container */}
                <div className={`size-14 bg-gradient-to-br ${topic.gradient} rounded-2xl flex items-center justify-center text-white/90 shadow-2xl ${topic.shadowColor} border border-white/20 group-hover:scale-110 transition-all duration-500`}>
                  {React.cloneElement(topic.icon, { strokeWidth: 2 })}
                </div>
                
                {/* Status Badge */}
                <div className="px-3.5 py-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[9px] font-bold uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">
                  Ready
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-1.5 line-clamp-1 transition-colors group-hover:text-black">
                {topic.title}
              </h3>
              
              {/* Technical Tag */}
              <div className="flex items-center gap-2 mb-10">
                <TerminalIcon size={12} className="text-slate-300" />
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                  // {topic.tag}
                </span>
              </div>

              {/* Footer Section */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-tight transition-colors group-hover:text-slate-500">
                  {topic.count}
                </span>
                
                <Link 
                  to={`/academic?subject=${topic.id}`}
                  className="size-11 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  <ArrowRightIcon size={18} strokeWidth={2} />
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