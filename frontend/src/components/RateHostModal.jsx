import { useState } from "react";
import { StarIcon, SendIcon, SmileIcon } from "lucide-react";
import axiosInstance from "../lib/axios";

function StarPicker({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <StarIcon
            size={size}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-white/10 fill-white/5"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function RateHostModal({ sessionId, hostName, onSubmit, onSkip }) {
  const [overall, setOverall] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    if (!overall) { setError("Please select a rating."); return; }
    setLoading(true);
    try {
      await axiosInstance.post(`/sessions/${sessionId}/rate-host`, { overall, comment });
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-7 text-center">
          <div className="size-13 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SmileIcon size={24} className="text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200 mb-1">Session Complete</p>
          <h2 className="text-2xl font-black text-white">How was your host?</h2>
          <p className="text-indigo-200 text-sm mt-1">
            Rate <span className="text-white font-semibold">{hostName}</span> on their hosting quality
          </p>
        </div>

        <div className="px-7 py-6">
          <div className="text-center mb-6">
            <StarPicker value={overall} onChange={setOverall} size={34} />
            {overall > 0 && (
              <p className="text-indigo-400 font-black text-sm mt-3 uppercase tracking-widest">
                {RATING_LABELS[overall]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
              Feedback <span className="text-slate-600 normal-case font-medium">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What went well? What could be improved?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 resize-none placeholder:text-slate-600"
            />
          </div>

          {error && <p className="text-rose-400 text-sm font-medium mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-3 rounded-xl border border-white/10 text-slate-500 font-semibold text-sm hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !overall}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : <><SendIcon size={14} /> Submit</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
