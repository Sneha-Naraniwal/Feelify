import { useState } from "react"; // 1. Add useState
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, SearchIcon } from "lucide-react";

function ProblemsPage() {
  const allProblems = Object.values(PROBLEMS);
  
  // 2. State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Filter problems based on the search query
  const filteredProblems = allProblems.filter((problem) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      problem.title.toLowerCase().includes(searchLower) ||
      problem.category.toLowerCase().includes(searchLower) ||
      problem.difficulty.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Problem Library
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Curated coding challenges to sharpen your skills.
            </p>
          </div>

          {/* 4. Connected Search Bar */}
          <div className="relative group">
            <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${searchQuery ? 'text-indigo-600' : 'text-slate-400'}`} />
            <input 
              type="text" 
              placeholder="Search by title, category, or difficulty..." 
              value={searchQuery} // Bind value
              onChange={(e) => setSearchQuery(e.target.value)} // Handle change
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-96 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
            {/* Clear button if user typed something */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 5. Use filteredProblems instead of allProblems */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="divide-y divide-slate-50">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="group flex items-center justify-between p-8 hover:bg-slate-50/80 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/10 transition-all duration-500">
                      <Code2Icon className="size-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {problem.title}
                        </h2>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest border ${
                          problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium">
                        {problem.category}
                      </p>
                    </div>
                  </div>

                  <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all">
                    <ChevronRightIcon className="size-5 text-slate-400 group-hover:text-white" />
                  </div>
                </Link>
              ))
            ) : (
              /* No Results State */
              <div className="p-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No problems match your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;