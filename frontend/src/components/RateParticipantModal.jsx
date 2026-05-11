import { useState } from "react";
import { StarIcon, SendIcon, UserIcon, BookOpenIcon } from "lucide-react";
import axiosInstance from "../lib/axios";

// Feedback dimensions (3 aspects, 1–5 stars each)
const FEEDBACK_ASPECTS = [
  { key: "communication",   label: "Communication",   desc: "Did they explain their thinking clearly?" },
  { key: "codeQuality",     label: "Code Quality",    desc: "Was their code clean, readable, and efficient?" },
  { key: "professionalism", label: "Professionalism", desc: "Were they respectful, punctual, and engaged?" },
];

function StarPicker({ value, onChange, max = 5 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <StarIcon
            size={max === 10 ? 18 : 22}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function RateParticipantModal({ sessionId, participantName, problems = [], onSubmit, onSkip }) {
  // Per-question marks (1–10)
  const [questionMarks, setQuestionMarks] = useState(
    problems.map((title) => ({ title, mark: 0, comment: "" }))
  );
  // Feedback ratings (1–5)
  const [feedbackRatings, setFeedbackRatings] = useState({
    communication: 0, codeQuality: 0, professionalism: 0,
  });
  const [comment,  setComment]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const allMarked    = questionMarks.every((q) => q.mark > 0);
  const allRated     = Object.values(feedbackRatings).every((v) => v > 0);
  const canSubmit    = allMarked && allRated;

  const updateMark = (idx, field, value) => {
    setQuestionMarks((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const handleSubmit = async () => {
    if (!canSubmit) { setError("Please mark all questions and rate all feedback aspects."); return; }
    setLoading(true);
    try {
      await axiosInstance.post(`/sessions/${sessionId}/rate-participant`, {
        ...feedbackRatings,
        comment,
        questionMarks,
      });
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">Session Complete</p>
            <h2 className="text-xl font-black text-white">Rate Participant</h2>
            <p className="text-slate-400 text-sm mt-1">How did <span className="text-white font-semibold">{participantName}</span> perform?</p>
          </div>
          <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <UserIcon size={22} className="text-white" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">

          {/* ── SECTION 1: Per-question marks (mandatory, 1–10) ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon size={14} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Question Marks</p>
                <p className="text-[11px] text-slate-400">Rate each question out of 10. This counts 70% of their score.</p>
              </div>
            </div>

            <div className="space-y-4">
              {questionMarks.map((q, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{q.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Question {idx + 1}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StarPicker max={10} value={q.mark} onChange={(v) => updateMark(idx, "mark", v)} />
                      {q.mark > 0 && (
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{q.mark}/10</span>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={q.comment}
                    onChange={(e) => updateMark(idx, "comment", e.target.value)}
                    placeholder="Brief note on this question (optional)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 2: Feedback ratings (1–5 stars, 30% of score) ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 bg-rose-100 rounded-xl flex items-center justify-center">
                <StarIcon size={14} className="text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Feedback Ratings</p>
                <p className="text-[11px] text-slate-400">Rate soft skills 1 to 5. Counts 30% of their score.</p>
              </div>
            </div>

            <div className="space-y-4">
              {FEEDBACK_ASPECTS.map((aspect) => (
                <div key={aspect.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{aspect.label}</p>
                      <p className="text-[11px] text-slate-400">{aspect.desc}</p>
                    </div>
                    <StarPicker
                      value={feedbackRatings[aspect.key]}
                      onChange={(v) => setFeedbackRatings((r) => ({ ...r, [aspect.key]: v }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall comment */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Overall Comments <span className="text-slate-300 normal-case font-medium">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any additional feedback for the participant..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none"
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 pt-4 flex gap-3 shrink-0 border-t border-slate-100">
          <button
            onClick={onSkip}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="flex-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? "Submitting..." : <><SendIcon size={15} /> Submit Rating</>}
          </button>
        </div>
      </div>
    </div>
  );
}
