import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  CpuIcon, DatabaseIcon, LayersIcon, NetworkIcon, GitBranchIcon,
  SearchIcon, ChevronDownIcon, CheckCircle2Icon, XCircleIcon,
  BookOpenIcon, RotateCcwIcon, TrophyIcon, TargetIcon,
  ArrowLeftIcon
} from "lucide-react";
import { SUBJECTS, QUESTIONS } from "../data/academicData";
import { useSubmitMCQ } from "../hooks/useSessions";

// ─── Icon map ────────────────────────────────────────────────
const ICON_MAP = {
  cpu:         CpuIcon,
  database:    DatabaseIcon,
  layers:      LayersIcon,
  network:     NetworkIcon,
  "git-branch": GitBranchIcon,
};

// ─── Tailwind color map (uses rose theme accent) ─────────────
const COLOR = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  ring: "ring-indigo-200",  badge: "bg-indigo-500",  hover: "hover:bg-indigo-100",  gradient: "from-indigo-500 to-blue-600",   shadow: "shadow-indigo-200/60"  },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", badge: "bg-emerald-500", hover: "hover:bg-emerald-100", gradient: "from-emerald-400 to-teal-600",  shadow: "shadow-emerald-200/60" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-200",  badge: "bg-violet-500",  hover: "hover:bg-violet-100",  gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200/60"  },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-200",    badge: "bg-rose-500",    hover: "hover:bg-rose-100",    gradient: "from-rose-500 to-orange-600",   shadow: "shadow-rose-200/60"    },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   badge: "bg-amber-500",   hover: "hover:bg-amber-100",   gradient: "from-amber-400 to-orange-500",  shadow: "shadow-amber-200/60"   },
};

// ═════════════════════════════════════════════════════════════
//  ACADEMIC PAGE COMPONENT
// ═════════════════════════════════════════════════════════════
export default function AcademicPage() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject") || "os";

  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const [searchQuery, setSearchQuery] = useState("");
  const [answers, setAnswers] = useState({});       // { questionId: selectedIndex }
  const [revealed, setRevealed] = useState({});      // { questionId: true }

  const submitMCQMutation = useSubmitMCQ();

  // ─── Derived data ────────────────────────────────────────
  const subjectQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.subject === activeSubject),
    [activeSubject]
  );

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return subjectQuestions;
    const q = searchQuery.toLowerCase();
    return subjectQuestions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.options.some((o) => o.toLowerCase().includes(q))
    );
  }, [subjectQuestions, searchQuery]);

  const activeSubjectMeta = SUBJECTS.find((s) => s.id === activeSubject);
  const c = COLOR[activeSubjectMeta?.color || "indigo"];

  // ─── Scoring ─────────────────────────────────────────────
  const subjectScores = useMemo(() => {
    const scores = {};
    SUBJECTS.forEach((s) => {
      const qs = QUESTIONS.filter((q) => q.subject === s.id);
      const answered = qs.filter((q) => revealed[q.id]);
      const correct = answered.filter((q) => answers[q.id] === q.correctAnswer);
      scores[s.id] = { total: qs.length, answered: answered.length, correct: correct.length };
    });
    return scores;
  }, [answers, revealed]);

  const currentScore = subjectScores[activeSubject] || { total: 0, answered: 0, correct: 0 };

  // ─── Handlers ────────────────────────────────────────────
  const handleAnswer = (questionId, optionIndex) => {
    if (revealed[questionId]) return; // already answered
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));

    // If correct, report to backend for leaderboard
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (question && optionIndex === question.correctAnswer) {
      submitMCQMutation.mutate(1);
    }
  };

  const handleReset = () => {
    // Reset only the active subject
    const ids = subjectQuestions.map((q) => q.id);
    setAnswers((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
    setRevealed((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
  };

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="relative min-h-screen font-sans selection:bg-pink-500/30">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-rose-100" />
        <div className="absolute top-[-10%] left-[-10%] size-[800px] rounded-full bg-pink-300/40 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-[-5%] size-[600px] rounded-full bg-rose-300/35 blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] size-[500px] rounded-full bg-amber-200/30 blur-[80px]" />
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────── */}
      <div className="ml-64 p-12">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className={`size-16 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-xl ${c.shadow} border border-white/20`}>
              <BookOpenIcon className="text-white size-7" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Study Modules</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1">
                MCQ Practice · {QUESTIONS.length} Questions · {SUBJECTS.length} Subjects
              </p>
            </div>
          </div>

          {/* SCORE BADGE */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] px-8 py-4 border border-white/60 shadow-lg flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TrophyIcon size={18} className="text-amber-500" />
              <span className="text-sm font-bold text-slate-700">
                {currentScore.correct}/{currentScore.total}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <TargetIcon size={18} className="text-rose-500" />
              <span className="text-sm font-bold text-slate-700">
                {currentScore.total > 0 ? Math.round((currentScore.correct / currentScore.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* ─── SUBJECT TABS ─────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SUBJECTS.map((s) => {
            const Icon = ICON_MAP[s.icon] || BookOpenIcon;
            const sc = COLOR[s.color];
            const isActive = activeSubject === s.id;
            const score = subjectScores[s.id];
            return (
              <button
                key={s.id}
                onClick={() => { setActiveSubject(s.id); setSearchQuery(""); }}
                className={`group flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 font-bold text-sm ${
                  isActive
                    ? `${sc.bg} ${sc.text} border-current shadow-lg scale-[1.03]`
                    : "bg-white/70 text-slate-500 border-white/50 hover:bg-white hover:shadow-md"
                }`}
              >
                <Icon size={18} className={isActive ? sc.text : "text-slate-400 group-hover:text-slate-600"} />
                <span className="tracking-tight">{s.label}</span>
                {score && score.answered > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    isActive ? "bg-white/60" : "bg-slate-100"
                  }`}>
                    {score.correct}/{score.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── SEARCH + RESET BAR ───────────────────────── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-sm"
            />
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 border border-white/60 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-sm font-bold shadow-sm"
          >
            <RotateCcwIcon size={14} />
            Reset {activeSubjectMeta?.label}
          </button>
        </div>

        {/* ─── PROGRESS BAR ─────────────────────────────── */}
        <div className="mb-10">
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">
            <span>Progress · {activeSubjectMeta?.label}</span>
            <span>{currentScore.answered}/{currentScore.total} answered</span>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${currentScore.total > 0 ? (currentScore.answered / currentScore.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* ─── QUESTIONS GRID ───────────────────────────── */}
        <div className="space-y-6 pb-16">
          {filteredQuestions.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <SearchIcon size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold">No questions match your search</p>
            </div>
          )}

          {filteredQuestions.map((q, qIndex) => {
            const isRevealed = revealed[q.id];
            const selectedOption = answers[q.id];
            const isCorrect = selectedOption === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border transition-all duration-500 shadow-sm hover:shadow-lg ${
                  isRevealed
                    ? isCorrect
                      ? "border-emerald-200 shadow-emerald-100/50"
                      : "border-rose-200 shadow-rose-100/50"
                    : "border-white/60 hover:border-slate-200"
                }`}
              >
                {/* QUESTION HEADER */}
                <div className="flex items-start gap-4 mb-8">
                  <div className={`shrink-0 size-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    isRevealed
                      ? isCorrect
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                      : `${c.bg} ${c.text}`
                  }`}>
                    {qIndex + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-relaxed pt-1">
                    {q.question}
                  </h3>
                </div>

                {/* OPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedOption === optIndex;
                    const isCorrectOption = q.correctAnswer === optIndex;
                    let optionStyle = "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer";
                    
                    if (isRevealed) {
                      if (isCorrectOption) {
                        optionStyle = "bg-emerald-50 border-emerald-200 text-emerald-800";
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle = "bg-rose-50 border-rose-200 text-rose-800";
                      } else {
                        optionStyle = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(q.id, optIndex)}
                        disabled={isRevealed}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${optionStyle}`}
                      >
                        <span className={`shrink-0 size-8 rounded-xl flex items-center justify-center text-xs font-black border ${
                          isRevealed && isCorrectOption
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : isRevealed && isSelected && !isCorrectOption
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="text-sm font-medium leading-snug">{option}</span>
                        {isRevealed && isCorrectOption && (
                          <CheckCircle2Icon size={18} className="ml-auto text-emerald-500 shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrectOption && (
                          <XCircleIcon size={18} className="ml-auto text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* EXPLANATION (shown after answering) */}
                {isRevealed && (
                  <div className={`p-6 rounded-2xl border text-sm leading-relaxed font-medium ${
                    isCorrect
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                      : "bg-rose-50/50 border-rose-100 text-rose-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2Icon size={16} className="text-emerald-500" />
                      ) : (
                        <XCircleIcon size={16} className="text-rose-500" />
                      )}
                      <span className="font-black text-[10px] uppercase tracking-widest">
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
