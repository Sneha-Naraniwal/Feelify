import mongoose from "mongoose";

const questionProgressSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  difficulty:   { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  solved:       { type: Boolean, default: false },
  completionPct:{ type: Number, default: 0, min: 0, max: 100 },
  earnedScore:  { type: Number, default: 0 },
}, { _id: false });

// Host marks each question (1–10) after session ends
const questionMarkSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  mark:    { type: Number, min: 1, max: 10, default: null },
  comment: { type: String, default: "" },
}, { _id: false });

const cheatingAlertSchema = new mongoose.Schema({
  type:      { type: String, enum: ["tab_switch", "split_screen", "paste"] },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const chatMessageSchema = new mongoose.Schema({
  userId:    { type: String },
  userName:  { type: String },
  text:      { type: String },
  createdAt: { type: Date },
}, { _id: false });

const sessionSchema = new mongoose.Schema(
  {
    // ── Problem list ───────────────────────────────────────────
    problems: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 10,
        message: "Session must have 1–10 problems",
      },
    },
    problem: { type: String, default: "" }, // legacy compat
    currentProblemIndex: { type: Number, default: 0 },

    // ── Per-question tracking ──────────────────────────────────
    questionProgress: { type: [questionProgressSchema], default: [] },

    // ── Difficulty ────────────────────────────────────────────
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      required: true,
    },

    // ── Participants ──────────────────────────────────────────
    host:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // ── Status & timing ───────────────────────────────────────
    status:    { type: String, enum: ["active", "completed"], default: "active" },
    startedAt: { type: Date, default: Date.now },
    endedAt:   { type: Date, default: null },

    // ── Stream ────────────────────────────────────────────────
    callId:     { type: String, default: "" },
    inviteCode: { type: String, unique: true, sparse: true, default: "" },
    hostJoined: { type: Boolean, default: false },

    // ── Integrity alerts (participant's cheating events) ──────
    cheatingAlerts: { type: [cheatingAlertSchema], default: [] },

    // ── Saved chat history (fetched before channel deletion) ──
    chatHistory: { type: [chatMessageSchema], default: [] },

    // ── Session duration & success ─────────────────────────────
    sessionDurationMinutes: { type: Number, default: 0 },
    isSuccessfulSession:    { type: Boolean, default: false }, // participant joined + 20+ min

    // ── Host marks per question (filled in rating modal) ──────
    questionMarks: { type: [questionMarkSchema], default: [] },

    // ── Scores computed when host submits rating ───────────────
    participantSessionScore: { type: Number, default: 0 },
    hostSessionScore:        { type: Number, default: 0 },

    // ── Host rates participant (multiple aspects, 1–5 each) ───
    participantRating: {
      problemSolving:  { type: Number, min: 1, max: 5, default: null },
      communication:   { type: Number, min: 1, max: 5, default: null },
      codeQuality:     { type: Number, min: 1, max: 5, default: null },
      professionalism: { type: Number, min: 1, max: 5, default: null },
      comment:         { type: String, default: "" },
      submittedAt:     { type: Date, default: null },
    },

    // ── Participant rates host (overall 1–5 + comment) ────────
    hostRating: {
      overall:     { type: Number, min: 1, max: 5, default: null },
      comment:     { type: String, default: "" },
      submittedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;