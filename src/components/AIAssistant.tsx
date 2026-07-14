import { useState, useRef, useEffect, memo } from "react";
import { MessageSquare, Send, X, Bot, User, HelpCircle, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { synth, NOTES } from "./AmbientSound";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "What are Ronak's core AI skills?",
  "Tell me about the One World project.",
  "What is Ronak's current focus?",
  "How can I contact Ronak?",
];

const AIAssistant = memo(function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am Ronak's AI Twin, a virtual representative. Ask me anything about my projects, research, technical stack, or career aspirations!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Play click audio tone
    synth.playNote(NOTES.click[2], "sine", 0.12);

    const userMsg: ChatMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          // Extract last 6 messages as contextual history for the model
          history: messages
            .slice(-6)
            .map((m) => ({
              role: m.sender === "user" ? "user" : "model",
              parts: [{ text: m.text }],
            })),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `Sorry, I encountered an issue: ${data.error}` },
        ]);
      } else {
        // Success chord tone
        synth.playNote(NOTES.success[4], "sine", 0.4);
        setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am having trouble connecting to my central server. Please ensure the server is active.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        id="ai-twin-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          synth.playNote(329.63, "triangle", 0.3); // E4 tone
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-md text-neutral-900 rounded-full cursor-pointer shadow-xl border border-neutral-200 group overflow-visible"
        title="Chat with Ronak's AI Twin"
      >
        <div className="relative w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
          <Bot className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-all duration-300" />
        </div>
      </motion.button>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30, x: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md h-[550px] bg-white border border-neutral-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 shadow-sm">
                    <Bot className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                    Ronak's AI Twin
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    Online • AI Career Agent
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  synth.playNote(220.0, "triangle", 0.25); // A3 tone
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs shadow-sm ${
                      m.sender === "user"
                        ? "bg-neutral-900 border-neutral-800 text-white"
                        : "bg-white border-neutral-200 text-neutral-600"
                    }`}
                  >
                    {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-3 py-2 text-sm leading-relaxed rounded-xl shadow-sm ${
                      m.sender === "user"
                        ? "bg-neutral-900 text-white rounded-tr-none"
                        : "bg-neutral-50 border border-neutral-100 text-neutral-800 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 mr-auto max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 text-neutral-600 shadow-sm flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-white border-t border-neutral-100">
                <p className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 mb-1.5">
                  <HelpCircle className="w-3 h-3" />
                  SUGGESTED QUESTIONS
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s)}
                      className="text-[11px] font-mono bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 px-2.5 py-1 rounded-full cursor-pointer transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3.5 bg-white border-t border-neutral-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ronak's skills, projects..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-0 font-mono transition-all shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
              >
                <Send className="w-4.5 h-4.5 fill-current" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default AIAssistant;
