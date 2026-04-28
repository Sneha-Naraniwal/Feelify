import { TerminalIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

function OutputPanel({ output }) {
  // Determine status color for the border and icon
  const isSuccess = output?.success;
  const isError = output && !output.success;

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${
      isSuccess ? "bg-emerald-50/30" : isError ? "bg-rose-50/30" : "bg-white"
    }`}>
      {/* TERMINAL HEADER */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TerminalIcon size={16} className={isSuccess ? "text-emerald-500" : isError ? "text-rose-500" : "text-slate-400"} />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Console Output</span>
        </div>
        {isSuccess && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2Icon size={12}/> SUCCESS</span>}
        {isError && <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1"><AlertCircleIcon size={12}/> EXECUTION FAILED</span>}
      </div>

      <div className="flex-1 overflow-auto p-8 font-mono">
        {output === null ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
            <TerminalIcon size={40} className="mb-4" />
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Ready for input...</p>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Standard Output */}
            {output.output && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stdout</p>
                <pre className={`text-sm p-4 rounded-2xl border ${
                  isSuccess ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-slate-50 border-slate-100 text-slate-700"
                } whitespace-pre-wrap leading-relaxed`}>
                  {output.output}
                </pre>
              </div>
            )}
            
            {/* Error Output */}
            {output.error && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Stderr</p>
                <pre className="text-sm p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 whitespace-pre-wrap leading-relaxed shadow-sm">
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