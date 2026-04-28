import { Link, useLocation } from "react-router"; // Using -dom for stability
import { 
  LayoutDashboardIcon, 
  Code2Icon, 
  UsersIcon, 
  ChevronRightIcon,
  BookOpenIcon,
  LogOutIcon // New icon for utility
} from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react"; // Added useUser hook

function Navbar() {
  const location = useLocation();
  const { user } = useUser(); // Get actual user data
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-white/80 backdrop-blur-xl border-r border-zinc-200/50 flex flex-col z-50 font-sans">
      
      {/* BRAND HEADER */}
      <div className="p-8 border-b border-zinc-200/50 bg-white/40">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-2.5 bg-black rounded-full transition-transform group-hover:scale-125" />
          <span className="font-black text-xl tracking-tighter text-black uppercase">
            FEELIFY
          </span>
        </Link>
      </div>

      {/* NAVIGATION SECTION */}
      <div className="flex-1 py-6 overflow-y-auto no-scrollbar">
        <div className="px-8 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          Workspace
        </div>
        
        <nav className="space-y-1 px-3">
          <NavItem to="/dashboard" icon={<LayoutDashboardIcon size={18} />} label="Dashboard" active={isActive("/dashboard")} />
          <NavItem to="/problems" icon={<Code2Icon size={18} />} label="Problems" active={isActive("/problems")} />
          <NavItem to="/sessions" icon={<UsersIcon size={18} />} label="Live Sessions" active={isActive("/sessions")} isLive={true} />
          <NavItem to="/academic" icon={<BookOpenIcon size={18} />} label="Study Modules" active={isActive("/academic")} />
        </nav>
      </div>

      {/* UPDATED USER PROFILE FOOTER */}
      <div className="p-6 border-t border-zinc-200/50 bg-white/40 transition-all hover:bg-zinc-50 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="scale-90 shadow-sm rounded-full overflow-hidden border border-white ring-1 ring-zinc-100">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="flex flex-col">
              {/* Show the user's actual name from Clerk */}
              <span className="text-xs font-bold text-black truncate max-w-[100px]">
                {user?.firstName || "Account"}
              </span>
              <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-tight">
                View Settings
              </span>
            </div>
          </div>
          <ChevronRightIcon 
            size={14} 
            className="text-zinc-300 group-hover:text-black transition-colors" 
          />
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ to, icon, label, active, isLive }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-5 py-3 transition-all rounded-2xl group relative mb-1 ${
      active 
        ? "bg-black text-white font-bold shadow-lg shadow-black/10 scale-[1.02]" 
        : "text-zinc-500 hover:bg-white hover:text-black hover:shadow-sm"
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`transition-colors ${active ? "text-white" : "text-zinc-400 group-hover:text-black"}`}>
        {icon}
      </span>
      <span className="text-sm tracking-tight">{label}</span>
    </div>

    {isLive && (
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border shadow-sm ${
        active ? "bg-white/10 border-white/20" : "bg-emerald-50 border-emerald-100"
      }`}>
        <span className={`size-1.5 rounded-full animate-pulse ${active ? "bg-emerald-400" : "bg-emerald-500"}`} />
        <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? "text-emerald-400" : "text-emerald-600"}`}>
          Live
        </span>
      </div>
    )}
  </Link>
);

export default Navbar;