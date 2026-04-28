import { useActiveSessions } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import ActiveSessions from "../components/ActiveSessions";

function SessionsGallery() {
  const { data, isLoading } = useActiveSessions();
  const { user } = useUser();

  // This matches the logic your ActiveSessions component needs
  const isUserInSession = (session) => {
    return session.host?.clerkId === user?.id || session.participant?.clerkId === user?.id;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Navbar />
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase tracking-tight">
              Live Lobby
            </h1>
            <p className="text-slate-400 font-medium">Jump into any active room to start collaborating.</p>
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