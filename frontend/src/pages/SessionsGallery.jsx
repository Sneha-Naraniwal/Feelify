import { useActiveSessions } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import ActiveSessions from "../components/ActiveSessions";

function SessionsGallery() {
  const { data, isLoading } = useActiveSessions();
  const { user } = useUser();

  const isUserInSession = (session) => {
    return session.host?.clerkId === user?.id || session.participant?.clerkId === user?.id;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Navbar />
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Live Lobby</h1>
            <p className="text-slate-500 font-medium mt-1">Jump into any active room to start collaborating.</p>
          </header>
          <ActiveSessions
            sessions={data?.sessions || []}
            isLoading={isLoading}
            isUserInSession={isUserInSession}
          />
        </div>
      </main>
    </div>
  );
}

export default SessionsGallery;