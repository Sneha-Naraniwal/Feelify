function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto bg-white border-r border-slate-200">
      {/* HEADER SECTION - Refined */}
      <div className="p-8 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-4">
           {/* Custom Styled Select */}
           <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem</span>
             <select
               className="bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
               value={currentProblemId}
               onChange={(e) => onProblemChange(e.target.value)}
             >
               {allProblems.map((p) => (
                 <option key={p.id} value={p.id}>{p.title}</option>
               ))}
             </select>
           </div>
           
           <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border ${
             problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
             problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
             'bg-rose-50 text-rose-600 border-rose-100'
           }`}>
             {problem.difficulty}
           </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {problem.title}
        </h1>
        <p className="text-indigo-500 text-sm font-bold mt-2 uppercase tracking-widest">{problem.category}</p>
      </div>

      <div className="p-8 space-y-10">
        {/* DESCRIPTION */}
        <section>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Task Description</h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="mt-4">{note}</p>
            ))}
          </div>
        </section>

        {/* EXAMPLES - Modern Code Blocks */}
        <section>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Examples</h2>
          <div className="space-y-6">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-bold">
                    0{idx + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Example</span>
                </div>
                
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="text-indigo-500 font-bold w-20">Input:</span>
                    <span className="text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 w-full">{example.input}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="text-emerald-500 font-bold w-20">Output:</span>
                    <span className="text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 w-full">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="mt-4 pt-4 border-t border-slate-200 text-slate-400 text-xs italic font-sans">
                      <span className="font-bold text-slate-600 not-italic">Note:</span> {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSTRAINTS */}
        <section className="pb-12">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Constraints</h2>
          <div className="flex flex-wrap gap-2">
            {problem.constraints.map((constraint, idx) => (
              <code key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200">
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