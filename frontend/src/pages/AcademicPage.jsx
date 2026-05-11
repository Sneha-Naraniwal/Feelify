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

// ─── Dark color map ──────────────────────────────────────────
const COLOR = {
  indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-400",  ring: "ring-indigo-500/20",  badge: "bg-indigo-500",  hover: "hover:bg-indigo-500/15",  gradient: "from-indigo-500 to-blue-600",   shadow: "shadow-indigo-500/20"  },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", badge: "bg-emerald-500", hover: "hover:bg-emerald-500/15", gradient: "from-emerald-400 to-teal-600",  shadow: "shadow-emerald-500/20" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  ring: "ring-violet-500/20",  badge: "bg-violet-500",  hover: "hover:bg-violet-500/15",  gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20"  },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    ring: "ring-rose-500/20",    badge: "bg-rose-500",    hover: "hover:bg-rose-500/15",    gradient: "from-rose-500 to-orange-600",   shadow: "shadow-rose-500/20"    },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   ring: "ring-amber-500/20",   badge: "bg-amber-500",   hover: "hover:bg-amber-500/15",   gradient: "from-amber-400 to-orange-500",  shadow: "shadow-amber-500/20"   },
};

// ═════════════════════════════════════════════════════════════
//  ACADEMIC PAGE COMPONENT
// ═════════════════════════════════════════════════════════════
export default function AcademicPage() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject") || "os";

  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const [searchQuery, setSearchQuery] = useState("");
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const submitMCQMutation = useSubmitMCQ();

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

  const handleAnswer = (questionId, optionIndex) => {
    if (revealed[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));

    const question = QUESTIONS.find((q) => q.id === questionId);
    if (question && optionIndex === question.correctAnswer) {
      submitMCQMutation.mutate(1);
    }
  };

  const handleReset = () => {
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

  return (
    <div className="relative min-h-screen font-sans bg-slate-950 selection:bg-indigo-500/30">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-[600px] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-[-5%] size-[500px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-12">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className={`size-14 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-xl ${c.shadow} border border-white/10`}>
              <BookOpenIcon className="text-white size-6" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-1.5 bg-indigo-400 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Study Modules</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">MCQ Practice</h1>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mt-0.5">
                {QUESTIONS.length} Questions · {SUBJECTS.length} Subjects
              </p>
            </div>
          </div>

          {/* SCORE BADGE */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/8 flex items-center gap-5">
            <div className="flex items-center gap-2">
              <TrophyIcon size={16} className="text-amber-400" />
              <span className="text-sm font-bold text-white">
                {currentScore.correct}/{currentScore.total}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">correct</span>
            </div>
            <div className="h-5 w-px bg-white/8" />
            <div className="flex items-center gap-2">
              <TargetIcon size={16} className="text-rose-400" />
              <span className="text-sm font-bold text-white">
                {currentScore.total > 0 ? Math.round((currentScore.correct / currentScore.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* SUBJECT TABS */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SUBJECTS.map((s) => {
            const Icon = ICON_MAP[s.icon] || BookOpenIcon;
            const sc = COLOR[s.color];
            const isActive = activeSubject === s.id;
            const score = subjectScores[s.id];
            return (
              <button
                key={s.id}
                onClick={() => { setActiveSubject(s.id); setSearchQuery(""); }}
                className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 font-bold text-sm ${
                  isActive
                    ? `${sc.bg} ${sc.text} border-current/30`
                    : "bg-white/4 text-slate-500 border-white/8 hover:bg-white/8 hover:text-slate-300"
                }`}
              >
                <Icon size={16} className={isActive ? sc.text : "text-slate-600 group-hover:text-slate-400"} />
                <span>{s.label}</span>
                {score && score.answered > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? "bg-white/15 text-current" : "bg-white/8 text-slate-500"
                  }`}>
                    {score.correct}/{score.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SEARCH + RESET BAR */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/8 transition-all"
            />
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all text-sm font-bold"
          >
            <RotateCcwIcon size={13} />
            Reset
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600 tracking-widest mb-2">
            <span>Progress · {activeSubjectMeta?.label}</span>
            <span>{currentScore.answered}/{currentScore.total} answered</span>
          </div>
          <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${currentScore.total > 0 ? (currentScore.answered / currentScore.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* QUESTIONS GRID */}
        <div className="space-y-5 pb-16">
          {filteredQuestions.length === 0 && (
            <div className="text-center py-20">
              <SearchIcon size={32} className="mx-auto mb-4 text-slate-700" />
              <p className="text-sm font-bold text-slate-600">No questions match your search</p>
            </div>
          )}

          {filteredQuestions.map((q, qIndex) => {
            const isRevealed = revealed[q.id];
            const selectedOption = answers[q.id];
            const isCorrect = selectedOption === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`bg-white/4 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 ${
                  isRevealed
                    ? isCorrect
                      ? "border-emerald-500/25 shadow-emerald-500/5 shadow-lg"
                      : "border-rose-500/25 shadow-rose-500/5 shadow-lg"
                    : "border-white/8 hover:border-white/15"
                }`}
              >
                {/* QUESTION HEADER */}
                <div className="flex items-start gap-4 mb-7">
                  <div className={`shrink-0 size-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    isRevealed
                      ? isCorrect
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                      : `${c.bg} ${c.text}`
                  }`}>
                    {qIndex + 1}
                  </div>
                  <h3 className="text-base font-bold text-white leading-relaxed pt-1">
                    {q.question}
                  </h3>
                </div>

                {/* OPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedOption === optIndex;
                    const isCorrectOption = q.correctAnswer === optIndex;
                    let optionStyle = "bg-white/4 border-white/8 hover:border-white/20 hover:bg-white/8 cursor-pointer";

                    if (isRevealed) {
                      if (isCorrectOption) {
                        optionStyle = "bg-emerald-500/10 border-emerald-500/25 text-emerald-300";
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle = "bg-rose-500/10 border-rose-500/25 text-rose-300";
                      } else {
                        optionStyle = "bg-white/2 border-white/5 text-slate-600 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(q.id, optIndex)}
                        disabled={isRevealed}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${optionStyle}`}
                      >
                        <span className={`shrink-0 size-7 rounded-lg flex items-center justify-center text-xs font-black border ${
                          isRevealed && isCorrectOption
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : isRevealed && isSelected && !isCorrectOption
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-white/8 text-slate-500 border-white/10"
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="text-sm font-medium leading-snug text-inherit">{option}</span>
                        {isRevealed && isCorrectOption && (
                          <CheckCircle2Icon size={16} className="ml-auto text-emerald-400 shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrectOption && (
                          <XCircleIcon size={16} className="ml-auto text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* EXPLANATION */}
                {isRevealed && (
                  <div className={`p-5 rounded-xl border text-sm leading-relaxed font-medium ${
                    isCorrect
                      ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/8 border-rose-500/20 text-rose-300"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2Icon size={14} className="text-emerald-400" />
                      ) : (
                        <XCircleIcon size={14} className="text-rose-400" />
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
