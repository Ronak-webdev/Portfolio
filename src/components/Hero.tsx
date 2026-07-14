import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDownRight, Terminal, ChevronDown } from "lucide-react";
import { PERSONAL_INFO } from "../data";
import { synth } from "./AmbientSound";
import profileImg from "../../assets/ronak.jpg";

const HeroSubtitleCycler = () => {
  const [currentSubtitleIdx, setCurrentSubtitleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitleIdx((prev) => (prev + 1) % PERSONAL_INFO.subtitles.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[3.8rem] sm:min-h-[4.8rem] md:min-h-[5.8rem] flex items-center mb-6 relative justify-center lg:justify-start">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentSubtitleIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.5rem] py-2 font-normal text-neutral-900 tracking-wide leading-tight"
          style={{ fontFamily: "'Cookie', cursive" }}
        >
          {PERSONAL_INFO.subtitles[currentSubtitleIdx]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default function Hero() {

  const handleHeroClick = () => {
    // Play welcoming chord
    synth.playChord([261.63, 329.63, 392.00, 523.25], "triangle");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-transparent pt-24 md:pt-32 pb-16"
    >
      {/* Decorative Radial Background Blurs — multicolor ambient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,transparent_100%)] z-10 pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full bg-purple-500/10 blur-[110px] pointer-events-none animate-[float-blob_16s_ease-in-out_infinite] will-change-transform" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[55%] h-[55%] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none animate-[float-blob_18s_ease-in-out_infinite_reverse] will-change-transform" />
      <div className="absolute top-[15%] right-[8%] w-[30%] h-[30%] rounded-full bg-rose-500/8 blur-[100px] pointer-events-none animate-[float-blob_14s_ease-in-out_infinite] will-change-transform" />
      <div className="absolute bottom-[18%] left-[6%] w-[26%] h-[26%] rounded-full bg-amber-400/8 blur-[90px] pointer-events-none animate-[float-blob_20s_ease-in-out_infinite_reverse] will-change-transform" />

      {/* Symmetrical Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0 opacity-70" />

      {/* Hero Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Hero Text and Content */}
          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">


            {/* Name Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              onClick={handleHeroClick}
              className="text-lg sm:text-xl font-mono tracking-wide text-neutral-400 hover:text-purple-600 transition-colors cursor-pointer select-none mb-1.5"
            >
              Hi, I'm <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent font-bold">{PERSONAL_INFO.name}</span>
            </motion.h2>

            {/* Subtitle Cycler with tight constraints to prevent layout reflow */}
            <HeroSubtitleCycler />

            {/* Compact Slogan Pitch */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed mb-10 font-sans mx-auto lg:mx-0"
            >
              {PERSONAL_INFO.aboutMe.slice(0, 168)}... I design modular frameworks to make deep learning architectures secure, private, and accessible.
            </motion.p>

            {/* Fully Transparent Glassmorphic CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("toggle-terminal"));
                }}
                className="glitch-btn w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-neutral-200/80 text-neutral-600 h-11 px-5 rounded-none cursor-pointer transition-all text-[11px] font-mono uppercase tracking-wider"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-600" />
                <span className="glitch-text-span">Trigger CLI</span>
              </button>
            </motion.div>
          </div>

          {/* Right Side: Round Portrait Headshot and Rotating Border Glow */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 aspect-square flex items-center justify-center group"
            >
              {/* Outer Ambient Rotating Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-50 via-indigo-500 to-cyan-500 opacity-40 blur-xl group-hover:opacity-75 transition-opacity duration-700 animate-[spin_8s_linear_infinite]" />
              
              {/* Rotating Gradient Background Layer (acts as border) */}
              <div className="absolute inset-[6px] rounded-full bg-gradient-to-tr from-purple-600 via-indigo-400 to-cyan-400 animate-[spin_6s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite] transition-all duration-300" />
              
              {/* Stationary Image Container on top */}
              <div className="absolute inset-[10px] rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img
                    src={profileImg}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.03] select-none pointer-events-none group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
