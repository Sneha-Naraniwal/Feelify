import React from "react";
import { IconUsers, IconShieldCheck, IconArchive, IconBolt, IconMilitaryRank } from "@tabler/icons-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const GRADIENTS = {
  pink:    "from-pink-500 to-rose-500",
  violet:  "from-violet-500 to-indigo-500",
  amber:   "from-amber-400 to-orange-500",
  indigo:  "from-indigo-500 to-blue-500",
  emerald: "from-emerald-400 to-teal-500",
};

const GLOWS = {
  pink:    "group-hover:shadow-pink-500/20",
  violet:  "group-hover:shadow-violet-500/20",
  amber:   "group-hover:shadow-amber-500/20",
  indigo:  "group-hover:shadow-indigo-500/20",
  emerald: "group-hover:shadow-emerald-500/20",
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

function StatsCards({ activeSessionsCount, sessionsHosted, recentSessionsCount, participantRank, hostRank, avgHostRating }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      <StatCard label="Live Sessions"    count={activeSessionsCount}                   icon={<IconUsers       size={22} stroke={1.5} />} gradient={GRADIENTS.pink}    glow={GLOWS.pink}    />
      <StatCard label="Sessions Hosted"  count={sessionsHosted ?? "…"}                 icon={<IconShieldCheck size={22} stroke={1.5} />} gradient={GRADIENTS.violet}  glow={GLOWS.violet}  />
      <StatCard label="History"          count={recentSessionsCount}                   icon={<IconArchive     size={22} stroke={1.5} />} gradient={GRADIENTS.amber}   glow={GLOWS.amber}   linkTo="/history" />
      <StatCard label="Participant Rank" count={participantRank ? `#${participantRank}` : "N/A"} icon={<IconBolt size={22} stroke={1.5} />} gradient={GRADIENTS.indigo} glow={GLOWS.indigo} linkTo="/leaderboard" sub="Solver board" />
      <StatCard label="Host Rank"        count={hostRank ? `#${hostRank}` : "N/A"}     icon={<IconMilitaryRank size={22} stroke={1.5} />} gradient={GRADIENTS.emerald} glow={GLOWS.emerald} linkTo="/leaderboard"
        sub={avgHostRating > 0 ? `${avgHostRating.toFixed(1)} avg rating` : "No ratings yet"} />
    </motion.div>
  );
}

const StatCard = ({ label, count, icon, gradient, glow, linkTo, sub }) => {
  const inner = (
    <motion.div
      variants={item}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`group relative bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 overflow-hidden h-full shimmer-card hover:shadow-lg ${glow}`}
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.09] transition-opacity duration-400 rounded-2xl`} />

      {/* Animated top-edge glow line */}
      <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
        >
          <span className="text-white">{icon}</span>
        </motion.div>

        <div className="min-w-0">
          <motion.div
            key={count}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-extrabold text-white tracking-tight leading-none mb-0.5"
          >
            {count}
          </motion.div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</span>
          {sub && <p className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );

  return linkTo ? <Link to={linkTo} className="block h-full">{inner}</Link> : inner;
};

export default StatsCards;