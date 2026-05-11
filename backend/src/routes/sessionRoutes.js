import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  joinByInviteCode,
  setProblemIndex,
  setHostJoined,
  getMyRank,
  submitMCQ,
  submitProblem,
  rateHost,
  rateParticipant,
  getHostedHistory,
  getParticipatedHistory,
  getLeaderboard,
} from "../controllers/sessionController.js";

const router = express.Router();

// ── Session CRUD ──────────────────────────────────────────────
router.post("/",          protectRoute, createSession);
router.get("/active",     protectRoute, getActiveSessions);
router.get("/my-recent",  protectRoute, getMyRecentSessions);

// ── History (must be before /:id routes) ──────────────────────
router.get("/history/hosted",       protectRoute, getHostedHistory);
router.get("/history/participated", protectRoute, getParticipatedHistory);

// ── Leaderboard ───────────────────────────────────────────────
router.get("/leaderboard", protectRoute, getLeaderboard);
router.get("/rank",        protectRoute, getMyRank);

// ── Scoring submissions ───────────────────────────────────────
router.post("/submit-mcq",     protectRoute, submitMCQ);
router.post("/submit-problem", protectRoute, submitProblem);

// ── Invite-only join ──────────────────────────────────────────
router.post("/join-by-code", protectRoute, joinByInviteCode);

// ── Per-session routes ────────────────────────────────────────
router.get( "/:id",                protectRoute, getSessionById);
router.post("/:id/join",           protectRoute, joinSession);
router.post("/:id/end",            protectRoute, endSession);
router.post("/:id/set-problem",    protectRoute, setProblemIndex);
router.post("/:id/host-joined",    protectRoute, setHostJoined);
router.post("/:id/rate-host",      protectRoute, rateHost);
router.post("/:id/rate-participant", protectRoute, rateParticipant);

export default router;