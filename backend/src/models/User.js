import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage:{
    type: String,
    default:"",
  },
  clerkId:{
    type: String,
    required: true,
    unique: true  ,
  },

  // ── Leaderboard stats ──────────────────────────────
  solvedProblems: { type: Number, default: 0 },   // coding problems passed
  solvedMCQs:     { type: Number, default: 0 },   // academic MCQs answered correctly
  completedSessions: { type: Number, default: 0 }, // sessions completed
  totalScore: { type: Number, default: 0 },        // weighted composite score
},
  {
    timestamps: true
  }
);

// Recalculate totalScore before saving
userSchema.pre("save", function (next) {
  this.totalScore = (this.solvedProblems * 10) + (this.solvedMCQs * 2) + (this.completedSessions * 15);
  next();
});

const User=mongoose.model("User",userSchema);

export default User;