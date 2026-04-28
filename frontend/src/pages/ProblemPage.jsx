import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { 
  ChevronLeftIcon, 
  BookOpenIcon, 
  CodeIcon, 
  LayoutIcon 
} from "lucide-react";

// COMPONENTS & LIBS
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import { PROBLEMS } from "../data/problems"; // <-- CRITICAL IMPORT FIX
import { useSubmitProblem } from "../hooks/useSessions";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // LAYOUT STATE
  const [isIdeVisible, setIsIdeVisible] = useState(true);

  // PROBLEM & CODE STATE
  // We use the ID from the URL to find the problem immediately
  const currentProblem = PROBLEMS[id] || PROBLEMS["two-sum"];
  
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(currentProblem.starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const submitProblemMutation = useSubmitProblem();

  // Sync code when problem or language changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    return output
      .replace(/\r/g, "")
      .trim()
      .split("\n")
      .map(line => line.trim().replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\s*,\s*/g, ","))
      .filter(line => line.length > 0)
      .join("\n");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result);
      if (result.success) {
        const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
        if (normalizeOutput(result.output) === normalizeOutput(expectedOutput)) {
          triggerConfetti();
          toast.success("All tests passed!");
          submitProblemMutation.mutate(); // Report to leaderboard
        } else {
          toast.error("Tests failed!");
        }
      }
    } catch (err) {
      toast.error("Execution failed!");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* HEADER / BREADCRUMB */}
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/problems")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-900 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <ChevronLeftIcon size={16} />
            Back
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">{currentProblem?.title}</span>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setIsIdeVisible(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isIdeVisible ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <BookOpenIcon size={14} /> Description
          </button>
          <button 
            onClick={() => setIsIdeVisible(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isIdeVisible ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            <CodeIcon size={14} /> Split View
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden">
        {isIdeVisible ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30}>
              <ProblemDescription
                problem={currentProblem}
                currentProblemId={id}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
              />
            </Panel>

            <PanelResizeHandle className="w-[1.5px] bg-slate-100 hover:bg-indigo-400 transition-colors cursor-col-resize active:bg-indigo-600" />

            <Panel defaultSize={60} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>
                <PanelResizeHandle className="h-[1.5px] bg-slate-100 hover:bg-indigo-400 transition-colors cursor-row-resize" />
                <Panel defaultSize={30}>
                  <OutputPanel output={output} />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full overflow-y-auto bg-[#f8fafc]">
            <div className="max-w-4xl mx-auto py-12 px-6">
              <ProblemDescription
                problem={currentProblem}
                currentProblemId={id}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
              />
              <div className="mt-12 p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-center justify-between">
                <div>
                  <h4 className="text-indigo-900 font-bold">Ready to solve this?</h4>
                  <p className="text-indigo-600/70 text-sm">Switch to Split View to start coding.</p>
                </div>
                <button 
                  onClick={() => setIsIdeVisible(true)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Open Editor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemPage;