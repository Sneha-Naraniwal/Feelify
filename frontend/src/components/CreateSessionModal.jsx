import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    /* 1. SOLID OVERLAY: Increased Z-Index and slightly darker backdrop */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* 2. SOLID MODAL: Added bg-white and high shadow to prevent see-through */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* HEADER */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Session</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure your collaborative room</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Select Problem <span className="text-rose-500">*</span>
            </label>

            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>Choose a coding problem...</option>
              {problems.map((problem) => (
                <option key={problem.id} value={problem.title} className="font-sans">
                  {problem.title} — {problem.difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY - Premium Look */}
          {roomConfig.problem && (
            <div className="bg-indigo-50 rounded-[1.5rem] p-6 border border-indigo-100 flex items-start gap-4">
              <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <Code2Icon className="text-white size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-indigo-900 font-bold text-sm leading-none">Session Summary</p>
                <p className="text-indigo-600/70 text-xs font-medium uppercase tracking-tight">
                  {roomConfig.problem} • 1-on-1 mode
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="p-8 bg-slate-50/50 flex items-center justify-end gap-4">
          <button 
            className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
              !roomConfig.problem 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200 hover:shadow-indigo-200"
            }`}
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {isCreating ? "Deploying..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;