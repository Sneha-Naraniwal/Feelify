import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, SearchIcon } from "lucide-react";

function ProblemsPage() {
  const allProblems = Object.values(PROBLEMS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = allProblems.filter((problem) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      problem.title.toLowerCase().includes(searchLower) ||
      problem.category.toLowerCase().includes(searchLower) ||
      problem.difficulty.toLowerCase().includes(searchLower)
    );
  });

  const diffBadge = (difficulty) => {
    if (difficulty === "Easy")   return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (difficulty === "Medium") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 ml-64">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-1.5 bg-indigo-400 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Library</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Problem Library
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Curated coding challenges to sharpen your skills.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${searchQuery ? "text-indigo-400" : "text-slate-600"}`} />
            <input
              type="text"
              placeholder="Search by title, category, difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-5 py-2.5 bg-white/5 border border-white/10 rounded-xl w-full md:w-80 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 font-bold text-xs transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Problem List */}
        <div className="bg-white/4 rounded-2xl border border-white/8 overflow-hidden">
          <div className="divide-y divide-white/5">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="group flex items-center justify-between px-7 py-5 hover:bg-white/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-5">
                    <div className="size-12 bg-white/5 border border-white/8 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all duration-300">
                      <Code2Icon className="size-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-0.5">
                        <h2 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {problem.title}
                        </h2>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest border ${diffBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {problem.category}
                      </p>
                    </div>
                  </div>

                  <div className="size-8 rounded-lg border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all">
                    <ChevronRightIcon className="size-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-20 text-center">
                <SearchIcon size={28} className="mx-auto mb-4 text-slate-700" />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No problems match your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;