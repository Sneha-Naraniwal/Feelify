import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },

  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`);
    return response.data;
  },

  // Accepts { id, questionProgress, cheatingAlerts }
  endSession: async ({ id, questionProgress = [], cheatingAlerts = [] }) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`, {
      questionProgress,
      cheatingAlerts,
    });
    return response.data;
  },

  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },

  // ── Leaderboard ───────────────────────────────────────────
  getMyRank: async () => {
    const response = await axiosInstance.get("/sessions/rank");
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/sessions/leaderboard");
    return response.data;
  },
  submitMCQ: async (correct) => {
    const response = await axiosInstance.post("/sessions/submit-mcq", { correct });
    return response.data;
  },
  submitProblem: async () => {
    const response = await axiosInstance.post("/sessions/submit-problem");
    return response.data;
  },

  // ── History ───────────────────────────────────────────────
  getHostedHistory: async () => {
    const response = await axiosInstance.get("/sessions/history/hosted");
    return response.data;
  },
  getParticipatedHistory: async () => {
    const response = await axiosInstance.get("/sessions/history/participated");
    return response.data;
  },

  // ── Ratings ───────────────────────────────────────────────
  rateHost: async (id, { overall, comment }) => {
    const response = await axiosInstance.post(`/sessions/${id}/rate-host`, { overall, comment });
    return response.data;
  },
  rateParticipant: async (id, data) => {
    const response = await axiosInstance.post(`/sessions/${id}/rate-participant`, data);
    return response.data;
  },

  // ── Session Controls (host-only) ─────────────────────────
  joinByInviteCode: async (inviteCode) => {
    const response = await axiosInstance.post("/sessions/join-by-code", { inviteCode });
    return response.data;
  },
  setProblemIndex: async (id, index) => {
    const response = await axiosInstance.post(`/sessions/${id}/set-problem`, { index });
    return response.data;
  },
  setHostJoined: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/host-joined`);
    return response.data;
  },
};