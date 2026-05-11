import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  profileImage: { type: String, default: "" },
  clerkId:      { type: String, required: true, unique: true },

  // ── Activity counters ──────────────────────────────────────
  solvedProblems:       { type: Number, default: 0 },
  solvedMCQs:           { type: Number, default: 0 },
  sessionsHosted:       { type: Number, default: 0 },
  successfulSessionsHosted: { type: Number, default: 0 }, // sessions with participant + 20+ min
  sessionsParticipated: { type: Number, default: 0 },

  // ── Participant leaderboard score ─────────────────────────
  // 70% host question marks + 30% host feedback ratings (avg across all sessions)
  participantScore:          { type: Number, default: 0 },
  totalQuestionMarkPoints:   { type: Number, default: 0 }, // cumulative raw question mark pts
  totalFeedbackRatingPoints: { type: Number, default: 0 }, // cumulative raw feedback pts
  ratedSessionsCount:        { type: Number, default: 0 }, // sessions where host submitted marks

  // ── Host leaderboard score ────────────────────────────────
  hostScore:       { type: Number, default: 0 },
  avgHostRating:   { type: Number, default: 0 },
  hostRatingCount: { type: Number, default: 0 },
}, { timestamps: true });

// ── Recalculate composite scores before saving ────────────────
userSchema.pre("save", function (next) {
  // Participant score:
  // Per-session score = (avgQuestionMark/10 * 0.70 + avgFeedbackRating/5 * 0.30) * 100
  // Cumulative = average across all rated sessions
  if (this.ratedSessionsCount > 0) {
    const questionAvg  = this.totalQuestionMarkPoints  / this.ratedSessionsCount; // 0–10 scale
    const feedbackAvg  = this.totalFeedbackRatingPoints / this.ratedSessionsCount; // 0–5 scale
    const sessionScore = (questionAvg / 10) * 70 + (feedbackAvg / 5) * 30; // 0–100 per session
    this.participantScore = Math.round(sessionScore);
  } else {
    this.participantScore = 0;
  }

  // Host score: 20 pts per SUCCESSFUL session + rating bonus
  const sessionBase = this.successfulSessionsHosted * 20;
  const ratingBonus = this.avgHostRating > 0
    ? (this.avgHostRating / 5) * 16 * this.successfulSessionsHosted
    : 0;
  this.hostScore = Math.round(sessionBase + ratingBonus);

  next();
});

const User = mongoose.model("User", userSchema);
export default User;