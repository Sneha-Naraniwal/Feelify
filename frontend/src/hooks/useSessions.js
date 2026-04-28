import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });

  return result;
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });

  return result;
};

// ── Leaderboard hooks ──────────────────────────────────────

export const useMyRank = () => {
  return useQuery({
    queryKey: ["myRank"],
    queryFn: sessionApi.getMyRank,
    refetchInterval: 30000, // refresh rank every 30s
    staleTime: 10000,
  });
};

export const useSubmitMCQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (correct) => sessionApi.submitMCQ(correct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRank"] });
    },
  });
};

export const useSubmitProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.submitProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRank"] });
    },
  });
};

export const useJoinByInviteCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode) => sessionApi.joinByInviteCode(inviteCode),
    onSuccess: () => {
      toast.success("Joined session successfully!");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Invalid invite code"),
  });
};