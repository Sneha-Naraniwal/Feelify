import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router"; // Added useLocation
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";       // This is the active IDE
import SessionsGallery from "./pages/SessionsGallery";
import AcademicPage from "./pages/AcademicPage";
import Navbar from "./components/Navbar"; // Make sure Navbar is imported here

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  // 2. Sidebar Visibility Logic
  // Hide sidebar on HomePage, SessionPage (IDE), and ProblemPage (Focus Mode)
  const hideNavbar = 
    location.pathname === "/" || 
    location.pathname.startsWith("/session/") || 
    location.pathname.startsWith("/problem/");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      {/* 3. Render Navbar conditionally and wrap it in a flex container */}
      {isSignedIn && !hideNavbar && <Navbar />}

      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
          <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
          <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
          <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
          <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
          
          {/* 4. Add the Sessions Gallery Route */}
          <Route path="/sessions" element={isSignedIn ? <SessionsGallery /> : <Navigate to={"/"} />} />
          <Route path="/academic" element={isSignedIn ? <AcademicPage /> : <Navigate to={"/"} />} />
        </Routes>
      </div>

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default App;