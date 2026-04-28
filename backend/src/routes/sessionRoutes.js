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
  getMyRank,
  submitMCQ,
  submitProblem,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

// Leaderboard
router.get("/rank", protectRoute, getMyRank);
router.post("/submit-mcq", protectRoute, submitMCQ);
router.post("/submit-problem", protectRoute, submitProblem);

// Invite-only join
router.post("/join-by-code", protectRoute, joinByInviteCode);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;