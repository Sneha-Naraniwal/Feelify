import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, ChevronDownIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden">
      {/* TOOLBAR - Dark & Professional */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1e1e1e] border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Language Selector Wrapper */}
          <div className="relative group bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-3 hover:border-white/20 transition-all">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage].name}
              className="size-5 grayscale group-hover:grayscale-0 transition-all"
            />
            <select 
              className="bg-transparent text-xs font-bold text-zinc-400 outline-none cursor-pointer appearance-none pr-4" 
              value={selectedLanguage} 
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-[#1e1e1e] text-white">
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon size={12} className="absolute right-2 text-zinc-500 pointer-events-none" />
          </div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Main.js</span>
        </div>

        {/* HIGH-CONTRAST RUN BUTTON */}
        <button 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
            isRunning 
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
          }`}
          disabled={isRunning} 
          onClick={onRunCode}
        >
          {isRunning ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlayIcon className="size-4 fill-current" />
          )}
          {isRunning ? "Running" : "Run Code"}
        </button>
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 pt-2 bg-[#1e1e1e]">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 15,
            lineNumbers: "on",
            fontFamily: "'JetBrains Mono', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
            minimap: { enabled: false },
            roundedSelection: true,
            cursorStyle: "line",
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;