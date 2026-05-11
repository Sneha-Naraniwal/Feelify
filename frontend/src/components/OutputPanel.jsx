import { TerminalIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

function OutputPanel({ output }) {
  const isSuccess = output?.success;
  const isError = output && !output.success;

  return (
    <div className={`h-full flex flex-col bg-[#0f1117] transition-colors duration-300`}>
      {/* TERMINAL HEADER */}
      <div className="px-5 py-2.5 border-b border-white/6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <TerminalIcon
            size={14}
            className={isSuccess ? "text-emerald-400" : isError ? "text-rose-400" : "text-slate-600"}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Console Output</span>
        </div>
        {isSuccess && (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2Icon size={11} /> Executed
          </span>
        )}
        {isError && (
          <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
            <AlertCircleIcon size={11} /> Failed
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-5 font-mono">
        {output === null ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <TerminalIcon size={32} className="mb-3 text-slate-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Ready for input...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {output.output && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Stdout</p>
                <pre className={`text-xs p-4 rounded-xl border whitespace-pre-wrap leading-relaxed ${
                  isSuccess
                    ? "bg-emerald-500/8 border-emerald-500/15 text-emerald-300"
                    : "bg-white/4 border-white/8 text-slate-300"
                }`}>
                  {output.output}
                </pre>
              </div>
            )}

            {output.error && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Stderr</p>
                <pre className="text-xs p-4 rounded-xl bg-rose-500/8 border border-rose-500/15 text-rose-300 whitespace-pre-wrap leading-relaxed">
                  {output.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;