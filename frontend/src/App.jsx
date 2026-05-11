import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import SessionsGallery from "./pages/SessionsGallery";
import AcademicPage from "./pages/AcademicPage";
import SessionHistoryPage from "./pages/SessionHistoryPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import Navbar from "./components/Navbar";

const pageVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } },
};

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname.startsWith("/session/") ||
    location.pathname.startsWith("/problem/");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {isSignedIn && !hideNavbar && <Navbar />}

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <Routes location={location}>
              <Route path="/"           element={!isSignedIn ? <HomePage />          : <Navigate to="/dashboard" />} />
              <Route path="/dashboard"  element={isSignedIn  ? <DashboardPage />      : <Navigate to="/" />} />
              <Route path="/problems"   element={isSignedIn  ? <ProblemsPage />       : <Navigate to="/" />} />
              <Route path="/problem/:id"element={isSignedIn  ? <ProblemPage />        : <Navigate to="/" />} />
              <Route path="/session/:id"element={isSignedIn  ? <SessionPage />        : <Navigate to="/" />} />
              <Route path="/sessions"   element={isSignedIn  ? <SessionsGallery />    : <Navigate to="/" />} />
              <Route path="/academic"   element={isSignedIn  ? <AcademicPage />       : <Navigate to="/" />} />
              <Route path="/history"    element={isSignedIn  ? <SessionHistoryPage /> : <Navigate to="/" />} />
              <Route path="/leaderboard"element={isSignedIn  ? <LeaderboardPage />    : <Navigate to="/" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            color: "#e2e8f0",
            fontSize: "13px",
            fontWeight: "600",
            padding: "12px 16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "rgba(15,23,42,0.95)" } },
          error:   { iconTheme: { primary: "#f87171", secondary: "rgba(15,23,42,0.95)" } },
        }}
      />
    </div>
  );
}

export default App;