function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const diffBadge = (difficulty) => {
    if (difficulty === "Easy")   return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (difficulty === "Medium") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0f1117] border-r border-white/6">
      {/* STICKY HEADER */}
      <div className="p-6 border-b border-white/6 sticky top-0 bg-[#0f1117]/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-white/5 border border-white/8 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Problem</span>
            <select
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
              value={currentProblemId}
              onChange={(e) => onProblemChange(e.target.value)}
            >
              {allProblems.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.title}</option>
              ))}
            </select>
          </div>

          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${diffBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
          {problem.title}
        </h1>
        <p className="text-indigo-400 text-xs font-bold mt-1.5 uppercase tracking-widest">{problem.category}</p>
      </div>

      <div className="p-6 space-y-8">
        {/* DESCRIPTION */}
        <section>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Task Description</h2>
          <div className="text-slate-400 leading-relaxed font-medium text-sm space-y-3">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-slate-500 italic">{note}</p>
            ))}
          </div>
        </section>

        {/* EXAMPLES */}
        <section>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-white/4 rounded-xl p-5 border border-white/6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-5 bg-white/10 text-slate-400 rounded-md flex items-center justify-center text-[10px] font-bold">
                    0{idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Example</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-bold w-16 shrink-0">Input:</span>
                    <span className="text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/6 flex-1">{example.input}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-400 font-bold w-16 shrink-0">Output:</span>
                    <span className="text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/6 flex-1">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="mt-3 pt-3 border-t border-white/6 text-slate-500 text-xs italic">
                      <span className="font-bold text-slate-400 not-italic">Note:</span> {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSTRAINTS */}
        <section className="pb-10">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">Constraints</h2>
          <div className="flex flex-wrap gap-2">
            {problem.constraints.map((constraint, idx) => (
              <code key={idx} className="bg-white/5 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/8">
                {constraint}
              </code>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export default ProblemDescription;