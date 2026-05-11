import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, ChevronDownIcon, EyeIcon, LockIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  readOnly = false,
  label = "Main.js",
  runButtonLabel,
  showRunButton = true,
  blockClipboard = false,
}) {

  // Block copy/paste/cut when in proctored mode
  const handleEditorMount = (editor, monaco) => {
    if (blockClipboard) {
      // Disable Ctrl+C, Ctrl+V, Ctrl+X
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {});
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {});
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {});
      // Disable right-click context menu
      editor.updateOptions({ contextmenu: false });
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden">
      {/* TOOLBAR - Dark & Professional */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1e1e1e] border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Language Selector Wrapper */}
          <div className="relative group bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-3 hover:border-white/20 transition-all">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
              alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
              className="size-5 grayscale group-hover:grayscale-0 transition-all"
            />
            {readOnly ? (
              <span className="text-xs font-bold text-zinc-400">{LANGUAGE_CONFIG[selectedLanguage]?.name}</span>
            ) : (
              <>
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
              </>
            )}
          </div>

          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>

          {readOnly && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <EyeIcon size={10} className="text-indigo-400" />
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Live Feed</span>
            </div>
          )}

          {blockClipboard && !readOnly && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <LockIcon size={10} className="text-rose-400" />
              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">No Copy/Paste</span>
            </div>
          )}
        </div>

        {/* RUN BUTTON */}
        {showRunButton && !readOnly && (
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
            {runButtonLabel || (isRunning ? "Running" : "Run Code")}
          </button>
        )}
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 pt-2 bg-[#1e1e1e]">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
          value={code}
          onChange={readOnly ? undefined : onCodeChange}
          theme="vs-dark"
          onMount={handleEditorMount}
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
            readOnly: readOnly,
            domReadOnly: readOnly,
            contextmenu: !blockClipboard,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;