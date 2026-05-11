import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  IconLayoutDashboard,
  IconCode,
  IconUsers,
  IconBook2,
  IconChevronUp,
  IconLogout,
  IconUser,
  IconSettings,
  IconMail,
  IconClockHour4,
  IconTrophy,
} from "@tabler/icons-react";
import { useUser, useClerk } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClick(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-slate-900/95 backdrop-blur-xl border-r border-white/8 flex flex-col z-50 font-sans">

      {/* Subtle mesh glow behind brand */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none" />

      {/* BRAND HEADER */}
      <div className="relative px-7 py-6 border-b border-white/8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full group-hover:scale-125 transition-transform" />
          <span className="font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 uppercase">
            FEELIFY
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 py-5 overflow-y-auto no-scrollbar">
        <div className="px-7 mb-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">
          Workspace
        </div>
        <nav className="space-y-0.5 px-3">
          <NavItem to="/dashboard"   icon={<IconLayoutDashboard size={18} stroke={1.5} />} label="Dashboard"     active={isActive("/dashboard")} />
          <NavItem to="/problems"    icon={<IconCode            size={18} stroke={1.5} />} label="Problems"      active={isActive("/problems")} />
          <NavItem to="/sessions"    icon={<IconUsers           size={18} stroke={1.5} />} label="Live Sessions" active={isActive("/sessions")} isLive />
          <NavItem to="/academic"    icon={<IconBook2           size={18} stroke={1.5} />} label="Study Modules" active={isActive("/academic")} />
          <NavItem to="/history"     icon={<IconClockHour4      size={18} stroke={1.5} />} label="History"       active={isActive("/history")} />
          <NavItem to="/leaderboard" icon={<IconTrophy          size={18} stroke={1.5} />} label="Leaderboard"   active={isActive("/leaderboard")} />
        </nav>
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="relative border-t border-white/8" ref={popoverRef}>

        {/* SLIDE-UP POPOVER */}
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-800 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* User info */}
            <div className="px-4 py-4 bg-gradient-to-br from-white/5 to-transparent border-b border-white/8">
              <div className="flex items-center gap-3">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="avatar" className="size-10 rounded-xl object-cover border border-white/15 shadow-sm" />
                ) : (
                  <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <IconUser size={18} stroke={1.5} className="text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {user?.fullName || user?.firstName || "User"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <IconMail size={11} stroke={1.5} />
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-2">
              <button
                onClick={() => { openUserProfile(); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors group text-left"
              >
                <div className="size-8 bg-indigo-500/15 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/25 transition-colors shrink-0">
                  <IconSettings size={15} stroke={1.5} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 leading-none mb-0.5">Manage Account</p>
                  <p className="text-[10px] text-slate-500">Profile, password & security</p>
                </div>
              </button>

              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-colors group text-left mt-1"
              >
                <div className="size-8 bg-rose-500/15 rounded-xl flex items-center justify-center group-hover:bg-rose-500/25 transition-colors shrink-0">
                  <IconLogout size={15} stroke={1.5} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-400 leading-none mb-0.5">Sign Out</p>
                  <p className="text-[10px] text-slate-500">End your current session</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TRIGGER ROW */}
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="w-full px-5 py-4 hover:bg-white/5 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="avatar" className="size-9 rounded-xl object-cover border border-white/15" />
            ) : (
              <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <IconUser size={16} stroke={1.5} className="text-white" />
              </div>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                {user?.firstName || "Account"}
              </p>
              <p className="text-[9px] font-medium text-slate-500 uppercase tracking-tight">
                View Settings
              </p>
            </div>
          </div>

          <IconChevronUp
            size={14}
            stroke={2.5}
            className={`transition-all duration-300 ${profileOpen ? "text-slate-300" : "text-slate-600 rotate-180 group-hover:text-slate-300"}`}
          />
        </button>
      </div>
    </nav>
  );
}

const NavItem = ({ to, icon, label, active, isLive }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-2.5 transition-all rounded-xl group relative mb-0.5 ${
      active
        ? "bg-white/12 text-white font-bold"
        : "text-slate-500 hover:bg-white/6 hover:text-slate-200"
    }`}
  >
    <div className="flex items-center gap-3.5">
      <span className={`transition-colors ${active ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-300"}`}>
        {icon}
      </span>
      <span className="text-sm tracking-tight">{label}</span>
    </div>

    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full" />
    )}

    {isLive && (
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${
        active ? "bg-emerald-500/15 border-emerald-500/20" : "bg-emerald-500/10 border-emerald-500/15"
      }`}>
        <span className="size-1.5 rounded-full animate-pulse bg-emerald-400" />
        <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-400">Live</span>
      </div>
    )}
  </Link>
);

export default Navbar;