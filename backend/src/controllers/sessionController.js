import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import crypto from "crypto";

// Generate a short, unique invite code
function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. "A1B2C3"
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // generate unique invite code
    let inviteCode = generateInviteCode();
    // ensure uniqueness (very unlikely collision but just in case)
    while (await Session.findOne({ inviteCode })) {
      inviteCode = generateInviteCode();
    }

    // create session in db
    const session = await Session.create({ problem, difficulty, host: userId, callId, inviteCode });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(req, res) {
  try {
    const userId = req.user._id;

    // Only return sessions where the user is host or participant (invite-only)
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
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Join a session by invite code (looks up session, then joins)
export async function joinByInviteCode(req, res) {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const session = await Session.findOne({ inviteCode: inviteCode.toUpperCase(), status: "active" });

    if (!session) return res.status(404).json({ message: "Invalid invite code or session has ended" });

    if (session.host.toString() === userId.toString()) {
      // Host is re-joining their own session — just redirect
      return res.status(200).json({ session, message: "You are the host of this session" });
    }

    if (session.participant) {
      if (session.participant.toString() === userId.toString()) {
        // Already joined — just redirect
        return res.status(200).json({ session, message: "Already in session" });
      }
      return res.status(409).json({ message: "Session is full" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session, message: "Joined session successfully" });
  } catch (error) {
    console.log("Error in joinByInviteCode controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call (non-blocking)
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (callErr) {
      console.warn("Failed to delete Stream call (non-fatal):", callErr.message);
    }

    // delete stream chat channel (non-blocking)
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (channelErr) {
      console.warn("Failed to delete Stream channel (non-fatal):", channelErr.message);
    }

    session.status = "completed";
    await session.save();

    // Increment completedSessions for host and participant
    try {
      await User.findByIdAndUpdate(session.host, { $inc: { completedSessions: 1 } });
      if (session.participant) {
        await User.findByIdAndUpdate(session.participant, { $inc: { completedSessions: 1 } });
      }
      // Recalc totalScore for affected users
      const host = await User.findById(session.host);
      if (host) await host.save();
      if (session.participant) {
        const participant = await User.findById(session.participant);
        if (participant) await participant.save();
      }
    } catch (statsErr) {
      console.warn("Failed to update session stats (non-fatal):", statsErr.message);
    }

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ═══════════════════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════════════════

export async function getMyRank(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Count how many users have a higher totalScore
    const higherCount = await User.countDocuments({ totalScore: { $gt: user.totalScore } });
    const rank = higherCount + 1;
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      rank,
      totalUsers,
      stats: {
        solvedProblems: user.solvedProblems,
        solvedMCQs: user.solvedMCQs,
        completedSessions: user.completedSessions,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    console.log("Error in getMyRank controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function submitMCQ(req, res) {
  try {
    const userId = req.user._id;
    const { correct } = req.body; // number of correct answers to add

    if (!correct || correct < 1) {
      return res.status(400).json({ message: "'correct' count is required (min 1)" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.solvedMCQs += correct;
    await user.save(); // triggers pre-save to recalc totalScore

    res.status(200).json({
      solvedMCQs: user.solvedMCQs,
      totalScore: user.totalScore,
    });
  } catch (error) {
    console.log("Error in submitMCQ controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function submitProblem(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.solvedProblems += 1;
    await user.save(); // triggers pre-save to recalc totalScore

    res.status(200).json({
      solvedProblems: user.solvedProblems,
      totalScore: user.totalScore,
    });
  } catch (error) {
    console.log("Error in submitProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}