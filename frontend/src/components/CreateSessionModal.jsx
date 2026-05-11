import { IconCode, IconLoader, IconPlus, IconX, IconCheck, IconHash, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({ isOpen, onClose, roomConfig, setRoomConfig, onCreateRoom, isCreating }) {
  const allProblems = Object.values(PROBLEMS);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const selectedProblems = roomConfig.problems || [];

  const toggleProblem = (title) => {
    const current = [...selectedProblems];
    const idx = current.indexOf(title);
    if (idx > -1) {
      current.splice(idx, 1);
    } else if (current.length < 10) {
      current.push(title);
    }
    let difficulty = "mixed";
    if (current.length === 1) {
      const p = allProblems.find((p) => p.title === current[0]);
      difficulty = p?.difficulty?.toLowerCase() || "mixed";
    } else if (current.length > 1) {
      const diffs = current.map((t) => allProblems.find((p) => p.title === t)?.difficulty?.toLowerCase());
      difficulty = new Set(diffs).size === 1 ? diffs[0] : "mixed";
    }
    setRoomConfig({ problems: current, difficulty });
  };

  const filteredProblems = allProblems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDiffBadge = (diff) => {
    const d = diff?.toLowerCase();
    if (d === "easy")   return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (d === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (d === "hard")   return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    return "text-slate-400 bg-white/5 border-white/10";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 w-full max-w-2xl rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="px-7 py-5 border-b border-white/8 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Create Session</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Select 1-10 problems for the session
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/8 rounded-xl text-slate-500 hover:text-slate-300 transition-colors"
          >
            <IconX size={18} stroke={2} />
          </button>
        </div>

        <div className="px-7 py-5 space-y-5 flex-1 overflow-y-auto no-scrollbar">

          {/* SELECTED TAGS */}
          {selectedProblems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Selected ({selectedProblems.length}/10)
                </label>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getDiffBadge(roomConfig.difficulty)}`}>
                  {roomConfig.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProblems.map((title, i) => (
                  <button
                    key={title}
                    onClick={() => toggleProblem(title)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/20 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 transition-all"
                  >
                    <span className="text-indigo-500 group-hover:text-rose-400 font-black text-[10px]">#{i + 1}</span>
                    {title}
                    <IconX size={11} stroke={2} className="text-indigo-500/60 group-hover:text-rose-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH */}
          <div className="relative">
            <IconSearch size={14} stroke={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white font-medium text-sm focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* PROBLEM LIST */}
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
            {filteredProblems.map((problem) => {
              const isSelected = selectedProblems.includes(problem.title);
              const isDisabled = !isSelected && selectedProblems.length >= 10;

              return (
                <button
                  key={problem.id}
                  onClick={() => !isDisabled && toggleProblem(problem.title)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/25"
                      : isDisabled
                      ? "bg-white/2 border-white/5 opacity-30 cursor-not-allowed"
                      : "bg-white/3 border-white/6 hover:bg-white/6 hover:border-indigo-500/20"
                  }`}
                >
                  <div className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "bg-indigo-500 border-indigo-500" : "border-white/15"
                  }`}>
                    {isSelected && <IconCheck size={12} stroke={2.5} className="text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{problem.title}</p>
                    <p className="text-[10px] text-slate-600 font-medium truncate">{problem.category}</p>
                  </div>

                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${getDiffBadge(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-7 py-4 bg-white/3 flex items-center justify-between gap-4 shrink-0 border-t border-white/8">
          <div className="flex items-center gap-2 text-slate-600">
            <IconHash size={13} stroke={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {selectedProblems.length} problem{selectedProblems.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                selectedProblems.length === 0
                  ? "bg-white/8 text-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              }`}
              onClick={onCreateRoom}
              disabled={isCreating || selectedProblems.length === 0}
            >
              {isCreating ? (
                <IconLoader className="size-4 animate-spin" stroke={1.5} />
              ) : (
                <IconPlus className="size-4" stroke={2} />
              )}
              {isCreating ? "Deploying..." : "Create Session"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;