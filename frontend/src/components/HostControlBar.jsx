import {
  ChevronLeftIcon, ChevronRightIcon,
  AlertTriangleIcon, PlayIcon, XIcon, CheckIcon, EyeIcon, EyeOffIcon,
  ClipboardIcon, MonitorIcon, ArrowLeftRightIcon, MicIcon, VideoIcon
} from "lucide-react";

export default function HostControlBar({
  currentIndex,
  totalProblems,
  onSetProblem,
  pendingRunRequest,
  onApproveRun,
  onDenyRun,
  alerts,
  questionRevealed,
  onToggleReveal,
  participantRequests,
  onDismissRequest,
  onApproveMediaRequest,
}) {
  const tabSwitches = alerts.filter((a) => a.type === "tab_switch").length;
  const pastes = alerts.filter((a) => a.type === "paste").length;
  const splitScreens = alerts.filter((a) => a.type === "split_screen").length;

  return (
    <div className="bg-slate-900 border-b border-white/5 px-6 py-3 flex items-center justify-between gap-4 shrink-0 flex-wrap">
      {/* LEFT: Problem Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSetProblem(currentIndex - 1)}
          disabled={currentIndex <= 0}
          className={`p-2 rounded-xl transition-all ${
            currentIndex <= 0
              ? "text-slate-600 cursor-not-allowed"
              : "text-white bg-white/10 hover:bg-white/20"
          }`}
        >
          <ChevronLeftIcon size={16} />
        </button>

        <div className="text-center min-w-[100px]">
          <span className="text-white font-black text-sm">
            Problem {currentIndex + 1}
          </span>
          <span className="text-slate-500 font-bold text-sm"> / {totalProblems}</span>
        </div>

        <button
          onClick={() => onSetProblem(currentIndex + 1)}
          disabled={currentIndex >= totalProblems - 1}
          className={`p-2 rounded-xl transition-all ${
            currentIndex >= totalProblems - 1
              ? "text-slate-600 cursor-not-allowed"
              : "text-white bg-white/10 hover:bg-white/20"
          }`}
        >
          <ChevronRightIcon size={16} />
        </button>

        {/* Reveal/Hide Question Toggle */}
        <button
          onClick={onToggleReveal}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ml-2 ${
            questionRevealed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}
        >
          {questionRevealed ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
          {questionRevealed ? "Visible" : "Hidden"}
        </button>
      </div>

      {/* CENTER: Run Request + Participant Requests */}
      <div className="flex items-center gap-3">
        {pendingRunRequest && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 animate-pulse">
            <PlayIcon size={14} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Run Requested
            </span>
            <button
              onClick={() => onApproveRun(pendingRunRequest.requestId)}
              className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/40 transition-all"
            >
              <CheckIcon size={14} />
            </button>
            <button
              onClick={() => onDenyRun(pendingRunRequest.requestId)}
              className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/40 transition-all"
            >
              <XIcon size={14} />
            </button>
          </div>
        )}

        {/* Participant mic/camera requests */}
        {participantRequests && participantRequests.length > 0 && (
          participantRequests.map((req, i) => (
            <div key={req.id || i} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2">
              {req.requestType === "mic" ? <MicIcon size={12} className="text-indigo-400" /> : <VideoIcon size={12} className="text-indigo-400" />}
              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">
                {req.requestType === "mic" ? "Mic Request" : "Camera Request"}
              </span>
              <button
                onClick={() => { onApproveMediaRequest(req.requestType); onDismissRequest(req.id); }}
                className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/40 transition-all"
                title="Approve"
              >
                <CheckIcon size={12} />
              </button>
              <button
                onClick={() => onDismissRequest(req.id)}
                className="p-1 bg-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500/40 transition-all"
                title="Deny"
              >
                <XIcon size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: Proctoring Alerts */}
      <div className="flex items-center gap-3">
        {tabSwitches > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <MonitorIcon size={12} className="text-rose-400" />
            <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">
              Tab: {tabSwitches}
            </span>
          </div>
        )}
        {pastes > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <ClipboardIcon size={12} className="text-amber-400" />
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
              Paste: {pastes}
            </span>
          </div>
        )}
        {splitScreens > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <ArrowLeftRightIcon size={12} className="text-orange-400" />
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">
              Split: {splitScreens}
            </span>
          </div>
        )}
        {tabSwitches === 0 && pastes === 0 && splitScreens === 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <EyeIcon size={12} className="text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
              Clean
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
