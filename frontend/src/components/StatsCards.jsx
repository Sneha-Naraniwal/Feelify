import React from "react";
import { TrophyIcon, UsersIcon, ZapIcon, TargetIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount, problemsCount, globalRank }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <StatCard 
        label="Live Sessions" 
        count={activeSessionsCount} 
        icon={<UsersIcon size={28} />} 
        lightColor="bg-pink-50"
        textColor="text-pink-600"
        shadowColor="shadow-pink-200"
      />
      
      <StatCard 
        label="Total History" 
        count={recentSessionsCount} 
        icon={<TrophyIcon size={28} />} 
        lightColor="bg-amber-50"
        textColor="text-amber-600"
        shadowColor="shadow-amber-200"
      />

      <StatCard 
        label="Practice Arena" 
        count={problemsCount}
        icon={<TargetIcon size={28} />} 
        lightColor="bg-rose-50"
        textColor="text-rose-600"
        shadowColor="shadow-rose-200"
      />

      <StatCard 
        label="Global Rank" 
        count={globalRank} 
        icon={<ZapIcon size={28} />} 
        lightColor="bg-emerald-50"
        textColor="text-emerald-600"
        shadowColor="shadow-emerald-200"
      />
    </div>
  );
}

const StatCard = ({ label, count, icon, lightColor, textColor, shadowColor }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden">
    <div className="flex flex-col items-start gap-6 relative z-10">
      
      <div className={`size-14 ${lightColor} ${textColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl ${shadowColor}`}>
        {icon}
      </div>
      
      <div>
        <div className="text-5xl font-bold text-slate-900 tracking-tighter mb-1 transition-colors group-hover:text-black">
          {count}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
          {label}
        </span>
      </div>
    </div>
  </div>
);

export default StatsCards;