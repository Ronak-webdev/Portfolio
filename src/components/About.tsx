import { motion } from "motion/react";
import { User, Heart, Target, Compass, Music, Flame } from "lucide-react";
import { PERSONAL_INFO } from "../data";
import { synth, NOTES } from "./AmbientSound";
import BorderGlow from "./BorderGlow";

export default function About() {
  const traits = [
    { title: "Fast Learner", desc: "Quickly adapts to new tools, frameworks, and deep learning architectures." },
    { title: "Research Driven", desc: "Prefers understanding underlying math, paper architectures, and limits before coding." },
    { title: "Problem Solver", desc: "Systematically decomposes large bottlenecks into clean modular abstractions." },
    { title: "Creative Thinker", desc: "Infuses software with design principles and ambient auditory feedbacks." }
  ];

  return (
    <section id="about" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[2px] bg-indigo-600" />
              <span className="text-xs uppercase tracking-widest text-indigo-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Biography</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-neutral-900">
              Behind The Screen
            </h3>
          </div>
          <p className="text-neutral-500 max-w-md text-sm font-mono leading-relaxed">
            A look into the philosophy, motivations, and creative foundations of my engineering workflow.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Story (Large Card) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <BorderGlow
              className="w-full h-full border border-neutral-200/80 shadow-sm"
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="242 90 70"
              colors={['#818cf8', '#6366f1', '#a78bfa']}
            >
              <div className="p-6 sm:p-8 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2 font-sans">
                  <User className="w-5 h-5 text-purple-600" />
                  <span>Ronak Prajapati</span>
                </h4>
                <div className="text-neutral-600 space-y-4 text-sm leading-relaxed font-sans">
                  <p>{PERSONAL_INFO.aboutMe}</p>
                  <p>
                    My ambition is to become an <strong>AI Research Engineer</strong> capable of bridging academic models with real-world product engineering, ensuring technologies improve lives through automation while prioritizing user privacy.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Core Values Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <BorderGlow
              className="w-full h-full border border-neutral-200/80 shadow-sm"
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="242 90 70"
              colors={['#818cf8', '#6366f1', '#a78bfa']}
            >
              <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-base font-bold text-neutral-900 mb-6 uppercase tracking-wider font-sans flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>Core Guidelines</span>
                  </h4>
                  <ul className="space-y-4">
                    {[
                      "Research before implementation",
                      "Build privacy-first solutions",
                      "Focus on real-world impact",
                      "Never stop learning"
                    ].map((val, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-neutral-600 font-sans">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                        <span>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-neutral-400 font-sans text-[10px] mt-6 border-t border-neutral-200/80 pt-4">
                  PRAJAPATI // ENG.PHILOSOPHY
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Personality Traits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-3">
            {traits.map((tr, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="h-full"
              >
                <BorderGlow
                  className="w-full h-full border border-neutral-200 shadow-sm cursor-pointer hover:bg-neutral-50/50 transition-all"
                  backgroundColor="#ffffff"
                  borderRadius={12}
                  glowColor="242 90 70"
                  colors={['#818cf8', '#6366f1', '#a78bfa']}
                >
                  <div
                    onClick={() => {
                      synth.playNote(NOTES.hover[idx % NOTES.hover.length], "sine", 0.3);
                    }}
                    className="p-5 flex items-start gap-4 h-full animate-none"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 border border-purple-100 shrink-0">
                      {idx === 0 ? (
                        <Flame className="w-4 h-4" />
                      ) : idx === 1 ? (
                        <Compass className="w-4 h-4" />
                      ) : idx === 2 ? (
                        <Target className="w-4 h-4" />
                      ) : (
                        <Flame className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-neutral-900 mb-1 font-sans">
                        {tr.title}
                      </h5>
                      <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                        {tr.desc}
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>

          {/* Ambient Hobbies (Piano & singing) Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <BorderGlow
              className="w-full h-full border border-neutral-200 shadow-sm"
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="242 90 70"
              colors={['#818cf8', '#6366f1', '#a78bfa']}
            >
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shrink-0">
                    <Music className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-neutral-900 font-sans flex items-center gap-1.5">
                      Creative Balance
                    </h5>
                    <p className="text-xs text-neutral-500 leading-relaxed font-sans mt-1 max-w-xl">
                      Outside of deep learning pipelines, I balance analytical thought by playing the <strong>Piano</strong>, the <strong>Harmonium</strong>, and singing classical vocal arrangements. This fuels spatial creativity and patient debugging mindsets.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => synth.playChord([261.63, 329.63, 392.00, 523.25], "triangle")}
                  className="w-full sm:w-auto px-5 h-11 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 hover:border-neutral-300 text-xs font-sans font-medium text-neutral-700 hover:text-neutral-900 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Trigger Piano Chord
                </button>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
