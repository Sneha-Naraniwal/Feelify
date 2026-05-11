import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

// Top-level error boundary — prevents blank screen on unhandled render errors
class RootErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "sans-serif", padding: "2rem" }}>
          <div style={{ background: "white", borderRadius: "1.5rem", padding: "2.5rem", maxWidth: "480px", width: "100%", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#ef4444", marginBottom: "1rem" }}>!</div>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "#0f172a", marginBottom: "0.5rem" }}>Something went wrong</h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{this.state.error?.message || "An unexpected error occurred."}</p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = "/dashboard"; }}
              style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "0.75rem", padding: "0.75rem 2rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <App />
          </ClerkProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </RootErrorBoundary>
  </StrictMode>
);