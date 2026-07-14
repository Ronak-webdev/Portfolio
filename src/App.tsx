import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { PERSONAL_INFO } from "./data";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AmbientSound, { synth } from "./components/AmbientSound";
import DeveloperConsole from "./components/DeveloperConsole";
import AIAssistant from "./components/AIAssistant";
import Loader from "./components/Loader";
import ScrollProgressBar from "./components/ScrollProgressBar";
import CursorGlow from "./components/CursorGlow";
import { initLenis, destroyLenis } from "./lib/smoothScroll";
import { Agentation } from 'agentation';

const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Journey = lazy(() => import("./components/Journey"));
const Credentials = lazy(() => import("./components/Credentials"));
const Contact = lazy(() => import("./components/Contact"));


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Global typing and click sound triggers
  const typeTimeoutRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) {
        if (typeTimeoutRef.current) return;
        synth.playTypeClick();
        typeTimeoutRef.current = window.setTimeout(() => { typeTimeoutRef.current = null; }, 50);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, [role='button'], .cursor-pointer");
      if (interactive) {
        if (clickTimeoutRef.current) return;
        synth.playInteractiveClick();
        clickTimeoutRef.current = window.setTimeout(() => { clickTimeoutRef.current = null; }, 100);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, { passive: true });
    window.addEventListener("click", handleGlobalClick, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("click", handleGlobalClick);
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [loading]);

  // Boot the shared Lenis instance once — powers smooth inertia scrolling
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-[#ffffff] via-[#f3f4fd] via-[#f0f9ff] via-[#fdf4ff] via-[#faf8ff] to-[#ffffff] min-h-screen text-neutral-950 select-none selection:bg-purple-500/10 selection:text-purple-600 font-sans antialiased relative"
        >
          {/* Seamless global background blurs */}
          <div className="absolute top-[12%] left-[5%] w-[45vw] h-[45vw] max-w-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0 will-change-transform" />
          <div className="absolute top-[32%] right-[5%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none z-0 will-change-transform" />
          <div className="absolute top-[55%] left-[8%] w-[45vw] h-[45vw] max-w-[600px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none z-0 will-change-transform" />
          <div className="absolute top-[78%] right-[8%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0 will-change-transform" />

          <ScrollProgressBar />
          <CursorGlow />

          <Header />

      {/* Primary Section Blocks */}
      <main className="relative z-20">
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Credentials />
          <Contact />
        </Suspense>
      </main>

      {/* Footer Details */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-16 px-6 md:px-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-20">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse inline-block" />
              <span className="text-sm font-bold text-white font-sans tracking-wide">
                Ronak Prajapati
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              AI Engineer & Full-Stack Developer bridging model pipeline research and robust web products.
            </p>
          </div>

          {/* Social connections */}
          <div className="flex items-center gap-4">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-white hover:text-neutral-300 transition-all cursor-pointer shadow-sm hover:scale-110"
              title="GitHub"
            >
              <Icon icon="simple-icons:github" className="w-5 h-5" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-[#0077B5] hover:text-[#0077B5]/80 transition-all cursor-pointer shadow-sm hover:scale-110"
              title="LinkedIn"
            >
              <Icon icon="simple-icons:linkedin" className="w-5 h-5" />
            </a>
            <a
              href={PERSONAL_INFO.huggingface}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-[#FFD21E] hover:text-[#FFD21E]/80 transition-all cursor-pointer shadow-sm hover:scale-110"
              title="Hugging Face"
            >
              <Icon icon="simple-icons:huggingface" className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20 text-[10px] text-neutral-600">
          <span>
            © 2026 Ronak Prajapati. All rights reserved.
          </span>
        </div>
      </footer>

          {/* Floating Auxiliary Tools */}
          <DeveloperConsole />
          <div className="fixed bottom-6 left-17 z-40">
            <AmbientSound />
          </div>
          <AIAssistant />
          <Agentation />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
