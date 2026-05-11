import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import crypto from "crypto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUCCESSFUL_SESSION_MIN = 20; // minutes both must stay for session to count

function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

const DIFFICULTY_MULTIPLIER = { easy: 1.0, medium: 1.8, hard: 3.0 };
const ALERT_PENALTY         = { tab_switch: 0.15, split_screen: 0.10, paste: 0.05 };
const MIN_SCORE_RATIO       = 0.30; // never award less than 30% even with many alerts

/**
 * Compute score for one question solved during a session.
 * @param {string} difficulty - "easy"|"medium"|"hard"
 * @param {number} numProblems - total problems in session (for base share)
 * @param {string[]} alertTypes - array of alert type strings for that question
 * @param {number} completionPct - 0–100 completion percentage
 */
function calcQuestionScore(difficulty, numProblems, alertTypes = [], completionPct = 100) {
  const multiplier  = DIFFICULTY_MULTIPLIER[difficulty] || 1.0;
  const base        = (100 / numProblems) * multiplier;
  const completion  = Math.min(completionPct, 100) / 100;

  // Compute penalty
  const totalPenalty = alertTypes.reduce((sum, t) => sum + (ALERT_PENALTY[t] || 0), 0);
  const integrityRatio = Math.max(MIN_SCORE_RATIO, 1 - totalPenalty);

  return Math.round(base * completion * integrityRatio);
}

// ─── Session CRUD ──────────────────────────────────────────────────────────────

export async function createSession(req, res) {
  try {
    const { problems, difficulty, questionDifficulties } = req.body;
    const userId  = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problems || !Array.isArray(problems) || problems.length === 0 || !difficulty) {
      return res.status(400).json({ message: "Problems array and difficulty are required" });
    }
    if (problems.length > 10) {
      return res.status(400).json({ message: "Maximum 10 problems per session" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    let inviteCode = generateInviteCode();
    while (await Session.findOne({ inviteCode })) inviteCode = generateInviteCode();

    // Build per-question progress entries
    const questionProgress = problems.map((title, i) => ({
      title,
      difficulty: questionDifficulties?.[i] || (difficulty === "mixed" ? "medium" : difficulty),
      solved: false,
      completionPct: 0,
      earnedScore: 0,
    }));

    const session = await Session.create({
      problems,
      problem: problems[0],
      difficulty,
      host: userId,
      callId,
      inviteCode,
      hostJoined: false,
      currentProblemIndex: 0,
      questionProgress,
      // startedAt is set in setHostJoined when the host actually enters the session
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problems: JSON.stringify(problems), difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problems[0]} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });
    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "active",
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const session = await Session.findById(req.params.id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinByInviteCode(req, res) {
  try {
    const { inviteCode } = req.body;
    const userId  = req.user._id;
    const clerkId = req.user.clerkId;

    if (!inviteCode) return res.status(400).json({ message: "Invite code is required" });

    const session = await Session.findOne({ inviteCode: inviteCode.toUpperCase(), status: "active" });
    if (!session) return res.status(404).json({ message: "Invalid invite code or session has ended" });

    if (session.host.toString() === userId.toString())
      return res.status(200).json({ session, message: "You are the host of this session" });

    if (session.participant) {
      if (session.participant.toString() === userId.toString())
        return res.status(200).json({ session, message: "Already in session" });
      return res.status(409).json({ message: "Session is full" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session, message: "Joined session successfully" });
  } catch (error) {
    console.log("Error in joinByInviteCode:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId  = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "active") return res.status(400).json({ message: "Cannot join a completed session" });
    if (session.host.toString() === userId.toString())
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── End Session ──────────────────────────────────────────────────────────────

export async function endSession(req, res) {
  try {
    const { id }   = req.params;
    const userId   = req.user._id;
    const { cheatingAlerts = [], questionProgress: clientProgress = [] } = req.body;

    const session = await Session.findById(id)
      .populate("host", "_id clerkId")
      .populate("participant", "_id clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host._id.toString() !== userId.toString())
      return res.status(403).json({ message: "Only the host can end the session" });
    if (session.status === "completed")
      return res.status(400).json({ message: "Session is already completed" });

    // 1. Save chat history before deletion
    let savedChat = [];
    try {
      const channel  = chatClient.channel("messaging", session.callId);
      const response = await channel.query({ messages: { limit: 200 } });
      savedChat = (response.messages || []).map((m) => ({
        userId:    m.user?.id || "",
        userName:  m.user?.name || "Unknown",
        text:      m.text || "",
        createdAt: new Date(m.created_at),
      }));
    } catch (chatErr) {
      console.warn("Could not fetch chat history:", chatErr.message);
    }

    // 2. Merge client-reported question progress (for record keeping)
    if (clientProgress.length > 0) {
      session.questionProgress = session.questionProgress.map((q, i) => {
        const client = clientProgress[i];
        if (!client) return q;
        return { ...q, solved: client.solved ?? q.solved, completionPct: client.completionPct ?? q.completionPct };
      });
    }

    // 3. Save cheating alerts
    session.cheatingAlerts = (cheatingAlerts || []).map((a) => ({
      type: a.type,
      timestamp: new Date(a.timestamp || Date.now()),
    }));

    // 4. Compute session duration and determine if successful
    const now      = new Date();
    const startedAt = new Date(session.startedAt);
    const durationMs  = now - startedAt;
    const durationMin = durationMs / 60000;
    session.sessionDurationMinutes = Math.round(durationMin);

    // Successful = participant joined AND session lasted 20+ minutes
    const isSuccessful = !!session.participant && durationMin >= SUCCESSFUL_SESSION_MIN;
    session.isSuccessfulSession = isSuccessful;

    // 5. No auto participant score — scoring happens in rateParticipant
    //    Set base host session score (successful sessions only)
    session.hostSessionScore = isSuccessful ? 20 : 0;

    // 6. Initialise questionMarks skeleton for the rating modal
    if (session.questionMarks.length === 0) {
      session.questionMarks = session.problems.map((title) => ({ title, mark: null, comment: "" }));
    }

    // 7. Update session metadata
    session.chatHistory = savedChat;
    session.status      = "completed";
    session.endedAt     = now;
    await session.save();

    // 8. Update host stats
    const hostUser = await User.findById(session.host._id);
    if (hostUser) {
      hostUser.sessionsHosted += 1;
      if (isSuccessful) hostUser.successfulSessionsHosted += 1;
      await hostUser.save();
    }

    // 9. Update participant stats (score applied later in rateParticipant)
    if (session.participant) {
      const participantUser = await User.findById(session.participant._id);
      if (participantUser) {
        participantUser.sessionsParticipated += 1;
        await participantUser.save();
      }
    }

    // 10. Respond immediately
    res.status(200).json({ session, message: "Session ended successfully" });

    // 11. Stream cleanup — fire-and-forget
    (async () => {
      try {
        const call = streamClient.video.call("default", session.callId);
        await call.endCall();
        await new Promise((r) => setTimeout(r, 1500));
        await call.delete({ hard: true });
      } catch (e) {
        console.warn("Stream call cleanup (non-fatal):", e.message);
      }
      try {
        const ch = chatClient.channel("messaging", session.callId);
        await ch.delete();
      } catch (e) {
        console.warn("Stream channel cleanup (non-fatal):", e.message);
      }
    })();
  } catch (error) {
    console.log("Error in endSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Session Controls ─────────────────────────────────────────────────────────

export async function setProblemIndex(req, res) {
  try {
    const { id }    = req.params;
    const { index } = req.body;
    const userId    = req.user._id;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host.toString() !== userId.toString())
      return res.status(403).json({ message: "Only the host can navigate problems" });
    if (session.status !== "active")
      return res.status(400).json({ message: "Session is not active" });

    const maxIndex = (session.problems?.length || 1) - 1;
    if (index < 0 || index > maxIndex)
      return res.status(400).json({ message: `Index must be between 0 and ${maxIndex}` });

    session.currentProblemIndex = index;
    await session.save();
    res.status(200).json({ session, currentProblemIndex: index });
  } catch (error) {
    console.log("Error in setProblemIndex:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function setHostJoined(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host.toString() !== userId.toString())
      return res.status(403).json({ message: "Only the host can mark themselves as joined" });

    session.hostJoined = true;
    // Start the clock the first time the host enters the session room
    if (!session.startedAt) session.startedAt = new Date();
    await session.save();
    res.status(200).json({ session, hostJoined: true });
  } catch (error) {
    console.log("Error in setHostJoined:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Rating Routes ────────────────────────────────────────────────────────────

/** Participant rates host: POST /:id/rate-host */
export async function rateHost(req, res) {
  try {
    const { id }               = req.params;
    const userId               = req.user._id;
    const { overall, comment } = req.body;

    if (!overall || overall < 1 || overall > 5)
      return res.status(400).json({ message: "Overall rating must be 1–5" });

    const session = await Session.findById(id).populate("host", "_id");
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (!session.participant || session.participant.toString() !== userId.toString())
      return res.status(403).json({ message: "Only the participant can rate the host" });
    if (session.status !== "completed")
      return res.status(400).json({ message: "Can only rate after session ends" });
    if (session.hostRating.submittedAt)
      return res.status(409).json({ message: "Already rated" });

    // Save rating on session
    session.hostRating = { overall, comment: comment || "", submittedAt: new Date() };
    await session.save();

    // Update host's rolling average
    const hostUser = await User.findById(session.host._id);
    if (hostUser) {
      const prevTotal = hostUser.avgHostRating * hostUser.hostRatingCount;
      hostUser.hostRatingCount += 1;
      hostUser.avgHostRating = parseFloat(
        ((prevTotal + overall) / hostUser.hostRatingCount).toFixed(2)
      );
      await hostUser.save();
    }

    res.status(200).json({ message: "Host rated successfully" });
  } catch (error) {
    console.log("Error in rateHost:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** Host rates participant: POST /:id/rate-participant
 *  Now includes mandatory questionMarks[] and computes participant score */
export async function rateParticipant(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { communication, codeQuality, professionalism, comment, questionMarks } = req.body;

    const session = await Session.findById(id).populate("participant", "_id");
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host.toString() !== userId.toString())
      return res.status(403).json({ message: "Only the host can rate the participant" });
    if (session.status !== "completed")
      return res.status(400).json({ message: "Can only rate after session ends" });
    if (!session.participant)
      return res.status(400).json({ message: "No participant in this session" });
    if (session.participantRating.submittedAt)
      return res.status(409).json({ message: "Already rated" });

    // Validate feedback ratings (3 aspects, 1–5 each)
    const feedbackAspects = [communication, codeQuality, professionalism];
    if (feedbackAspects.some((v) => v === undefined || v < 1 || v > 5))
      return res.status(400).json({ message: "communication, codeQuality, professionalism must be 1–5" });

    // Validate question marks (1–10 each, all required)
    if (!questionMarks || !Array.isArray(questionMarks) || questionMarks.length !== session.problems.length)
      return res.status(400).json({ message: `Must provide marks for all ${session.problems.length} question(s)` });
    if (questionMarks.some((qm) => !qm.mark || qm.mark < 1 || qm.mark > 10))
      return res.status(400).json({ message: "Each question mark must be 1–10" });

    // Save question marks on session
    session.questionMarks = questionMarks.map((qm) => ({
      title:   qm.title,
      mark:    qm.mark,
      comment: qm.comment || "",
    }));

    // Save feedback rating
    session.participantRating = {
      communication,
      codeQuality,
      professionalism,
      comment: comment || "",
      submittedAt: new Date(),
    };
    await session.save();

    // Compute and store participant score
    const participantUser = await User.findById(session.participant._id);
    if (participantUser) {
      // Average question mark (0–10 scale)
      const avgMark = questionMarks.reduce((s, qm) => s + qm.mark, 0) / questionMarks.length;
      // Average feedback rating (0–5 scale)
      const avgFeedback = (communication + codeQuality + professionalism) / 3;

      participantUser.totalQuestionMarkPoints   += avgMark;
      participantUser.totalFeedbackRatingPoints += avgFeedback;
      participantUser.ratedSessionsCount        += 1;
      await participantUser.save(); // triggers pre-save hook to recompute participantScore
    }

    res.status(200).json({ message: "Participant rated successfully" });
  } catch (error) {
    console.log("Error in rateParticipant:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Session History ──────────────────────────────────────────────────────────

/** GET /history/hosted — full detail, includes cheating alerts */
export async function getHostedHistory(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ host: userId, status: "completed" })
      .populate("participant", "name profileImage email clerkId")
      .sort({ endedAt: -1 })
      .limit(50);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getHostedHistory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** GET /history/participated — cheating alerts stripped */
export async function getParticipatedHistory(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ participant: userId, status: "completed" })
      .populate("host", "name profileImage email clerkId")
      .sort({ endedAt: -1 })
      .limit(50);

    // Strip cheating alerts from participant view
    const sanitized = sessions.map((s) => {
      const obj = s.toObject();
      delete obj.cheatingAlerts;
      return obj;
    });

    res.status(200).json({ sessions: sanitized });
  } catch (error) {
    console.log("Error in getParticipatedHistory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export async function getLeaderboard(req, res) {
  try {
    const [participantBoard, hostBoard] = await Promise.all([
      User.find({ ratedSessionsCount: { $gt: 0 } })
        .select("name profileImage participantScore ratedSessionsCount totalQuestionMarkPoints totalFeedbackRatingPoints sessionsParticipated")
        .sort({ participantScore: -1 })
        .limit(50),
      User.find()
        .select("name profileImage hostScore avgHostRating hostRatingCount sessionsHosted successfulSessionsHosted")
        .sort({ hostScore: -1 })
        .limit(50),
    ]);

    res.status(200).json({ participantBoard, hostBoard });
  } catch (error) {
    console.log("Error in getLeaderboard:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRank(req, res) {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const [participantRank, hostRank, totalUsers] = await Promise.all([
      User.countDocuments({ participantScore: { $gt: user.participantScore } }),
      User.countDocuments({ hostScore: { $gt: user.hostScore } }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      participantRank: participantRank + 1,
      hostRank: hostRank + 1,
      totalUsers,
      stats: {
        participantScore:          user.participantScore,
        hostScore:                 user.hostScore,
        avgHostRating:             user.avgHostRating,
        solvedProblems:            user.solvedProblems,
        solvedMCQs:                user.solvedMCQs,
        sessionsHosted:            user.sessionsHosted,
        successfulSessionsHosted:  user.successfulSessionsHosted,
        sessionsParticipated:      user.sessionsParticipated,
        ratedSessionsCount:        user.ratedSessionsCount,
        totalQuestionMarkPoints:   user.totalQuestionMarkPoints,
        totalFeedbackRatingPoints: user.totalFeedbackRatingPoints,
      },
    });
  } catch (error) {
    console.log("Error in getMyRank:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function submitMCQ(req, res) {
  try {
    const userId      = req.user._id;
    const { correct } = req.body;

    if (!correct || correct < 1)
      return res.status(400).json({ message: "'correct' count is required (min 1)" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.solvedMCQs += correct;
    user.mcqPoints  += correct * 5; // 5 pts per correct MCQ
    await user.save();

    res.status(200).json({ solvedMCQs: user.solvedMCQs, participantScore: user.participantScore });
  } catch (error) {
    console.log("Error in submitMCQ:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function submitProblem(req, res) {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.solvedProblems += 1;
    user.practicePoints += 30; // 30 pts per standalone problem solved
    await user.save();

    res.status(200).json({ solvedProblems: user.solvedProblems, participantScore: user.participantScore });
  } catch (error) {
    console.log("Error in submitProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}