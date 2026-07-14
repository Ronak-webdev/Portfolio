import { useState, useEffect, useRef, memo } from "react";
import { Terminal, X, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { synth, NOTES } from "./AmbientSound";
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from "../data";
import { getLenis } from "../lib/smoothScroll";

interface LogEntry {
  type: "input" | "output" | "error" | "ai";
  text: string;
}

const DeveloperConsole = memo(function DeveloperConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "output", text: "Welcome to Ronak's Interactive Terminal v1.0.0" },
    { type: "output", text: "Type 'help' to see available commands or 'gemini [query]' to ask my AI twin a question directly." },
  ]);
  const [loading, setLoading] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pause/resume Lenis when console modal is toggled
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    return () => {
      const l = getLenis();
      if (l) l.start();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        synth.playNote(261.63, "triangle", 0.4);
      }
    };
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
      synth.playNote(261.63, "triangle", 0.4);
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("toggle-terminal", handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("toggle-terminal", handleToggleEvent);
    };
  }, []);

  const handleCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    // Play high key click tone
    synth.playNote(NOTES.click[Math.floor(Math.random() * NOTES.click.length)], "sine", 0.15);

    const newLogs = [...logs, { type: "input" as const, text: `$ ${trimmed}` }];
    setLogs(newLogs);
    setInput("");

    const args = trimmed.split(" ");
    const command = args[0].toLowerCase();
    const commandArg = args.slice(1).join(" ");

    switch (command) {
      case "help":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            text: `Available Commands:
  help               Show this directory
  about              Introduction to Ronak Prajapati
  skills             Display major technology competencies
  projects           List case-study applications
  gemini [query]     Query Ronak's server-side AI Career Twin
  socials            Get click-to-open links (GitHub, LinkedIn, HF, etc.)
  piano              Trigger a beautiful synthesized pentatonic chord cascade
  clear              Wipe console log buffers`,
          },
        ]);
        break;

      case "about":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            text: `RONAK PRAJAPATI - AI ENGINEER & FULL STACK DEVELOPER
--------------------------------------------------------
Location: ${PERSONAL_INFO.location}
Education: B.Tech in CSE, ${PERSONAL_INFO.university} (${PERSONAL_INFO.graduation})
CGPA: ${PERSONAL_INFO.cgpa}
Core Focus: Bridging GPU-accelerated deep learning (PyTorch, YOLOv8, CNN OCR) 
            with modern robust full-stack software development.`,
          },
        ]);
        break;

      case "skills":
        const skillText = SKILL_CATEGORIES.map(
          (cat) =>
            `\n[ ${cat.title.toUpperCase()} ]\n` +
            cat.skills.map((s) => `  • ${s.name.padEnd(35)} - Lvl: ${s.level}% (${s.info || ""})`).join("\n")
        ).join("\n");
        setLogs((prev) => [...prev, { type: "output", text: skillText }]);
        break;

      case "projects":
        const projText = PROJECTS.map(
          (p) =>
            `\n⚡ ${p.title} (${p.tagline})\n  Techs: ${p.technologies.slice(0, 5).join(", ")}\n  Metrics: ${p.metrics[0]}`
        ).join("\n");
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            text: `Ronak's Featured Portfolio Case Studies:${projText}\n\nType 'gemini analyze [project_name]' to let AI describe its solutions in depth!`,
          },
        ]);
        break;

      case "socials":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            text: `Interactive Connections:
  • GitHub: ${PERSONAL_INFO.github}
  • LinkedIn: ${PERSONAL_INFO.linkedin}
  • HuggingFace: ${PERSONAL_INFO.huggingface}
  • LeetCode: ${PERSONAL_INFO.leetcode}
  • Resume: ${PERSONAL_INFO.resumeDrive}`,
          },
        ]);
        break;

      case "piano":
        synth.playChord([261.63, 293.66, 329.63, 392.00, 523.25], "triangle");
        setLogs((prev) => [...prev, { type: "output", text: "Playing major pentatonic ambient chord cascade... 🎹🎵" }]);
        break;

      case "clear":
        setLogs([{ type: "output", text: "Console buffer cleared." }]);
        break;

      case "gemini":
        if (!commandArg) {
          setLogs((prev) => [...prev, { type: "error", text: "Error: Please specify a query. Usage: gemini [your question]" }]);
          break;
        }

        setLoading(true);
        setLogs((prev) => [...prev, { type: "output", text: "Communicating with server-side Gemini Career Agent..." }]);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: commandArg }),
          });
          const data = await response.json();

          if (data.error) {
            setLogs((prev) => [...prev, { type: "error", text: `Error: ${data.error}` }]);
          } else {
            // Success sound tone
            synth.playNote(NOTES.success[3], "sine", 0.6);
            setLogs((prev) => [...prev, { type: "ai", text: `[Gemini Agent]: ${data.text}` }]);
          }
        } catch (err: any) {
          setLogs((prev) => [...prev, { type: "error", text: `Connection Failed: ${err.message || err}` }]);
        } finally {
          setLoading(false);
        }
        break;

      default:
        setLogs((prev) => [
          ...prev,
          { type: "error", text: `Command not recognized: '${command}'. Type 'help' to view valid parameters.` },
        ]);
        break;
    }
  };

  return (
    <>


      {/* Console Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl h-[80vh] bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 pr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-purple-500/80 inline-block" />
                  </div>
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-semibold text-neutral-400">
                    prajapati@developer: ~
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    synth.playNote(196.0, "triangle", 0.2);
                  }}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Log Viewport */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-3 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`whitespace-pre-wrap leading-relaxed ${
                      log.type === "input"
                        ? "text-white font-medium"
                        : log.type === "error"
                        ? "text-rose-400 font-semibold"
                        : log.type === "ai"
                        ? "text-purple-300 bg-purple-950/20 border border-purple-500/10 p-3 rounded-md"
                        : "text-neutral-300"
                    }`}
                  >
                    {log.type === "ai" && (
                      <div className="flex items-center gap-1.5 text-xs text-purple-400 mb-1.5 font-bold uppercase tracking-wider">
                        AI Career Assistant
                      </div>
                    )}
                    {log.text}
                  </div>
                ))}
                {loading && (
                  <div className="text-purple-400/80 animate-pulse flex items-center gap-2 font-mono text-xs">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                    <span>Gemini is synthesizing insights...</span>
                  </div>
                )}
                <div ref={consoleEndRef} />
              </div>

              {/* Command Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand(input);
                }}
                className="flex items-center gap-2 px-4 py-3 bg-neutral-900/50 border-t border-neutral-800"
              >
                <ChevronRight className="w-4 h-4 text-purple-400 animate-pulse" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command (e.g. 'help', 'socials', 'gemini who is Ronak?')..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-purple-400 placeholder-neutral-600 focus:ring-0"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-mono border border-purple-500/20 rounded cursor-pointer transition-all flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-purple-400/20" />
                  Run
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

export default DeveloperConsole;
