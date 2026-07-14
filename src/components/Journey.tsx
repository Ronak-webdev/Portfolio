import { useRef, memo } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Milestone, Calendar, Briefcase, Award, GraduationCap } from "lucide-react";
import { TIMELINE, PERSONAL_INFO, EXPERIENCES } from "../data";
import { synth, NOTES } from "./AmbientSound";
import BorderGlow from "./BorderGlow";

const Journey = memo(function Journey() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 50%"]
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 28, restDelta: 0.001 });

  return (
    <section id="journey" className="py-24 bg-transparent relative overflow-hidden">
      {/* Visual glowing meshes */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[2px] bg-cyan-600" />
              <span className="text-xs uppercase tracking-wider text-cyan-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Timeline</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-neutral-900">
              Trajectory & Milestones
            </h3>
          </div>
          <p className="text-neutral-500 max-w-md text-sm font-sans leading-relaxed">
            Tracing my history from the first lines of C++ in academic laboratories to founding an AI Media studio.
          </p>
        </div>

        {/* Timeline Layout */}
        <div ref={timelineRef} className="relative ml-4 md:ml-32 space-y-16">
          {/* Static track line */}
          <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-neutral-200" />
          {/* Animated active gradient line */}
          <motion.div
            style={{ scaleY, transformOrigin: "top", willChange: "transform" }}
            className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#594eff] via-pink-500 via-cyan-500 to-[#493ee6]"
          />

          {TIMELINE.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05, margin: "0px 0px -100px 0px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8, delay: idx * 0.05 }}
              style={{ willChange: "transform, opacity" }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline dot marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-neutral-300 group-hover:border-purple-500 group-hover:bg-purple-50 transition-colors flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-purple-500 transition-colors" />
              </div>

              {/* Responsive year label floating outside on desktop */}
              <div className="md:absolute md:-left-32 md:top-1 font-sans text-xs text-neutral-500 group-hover:text-purple-600 font-bold tracking-wider transition-colors">
                {item.year.split(" ")[0]}
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-neutral-200/80 p-6 rounded-2xl shadow-sm hover:border-purple-500/30 transition-[border-color,box-shadow] duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-sans text-purple-600 font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.year}</span>
                </div>
                <h4 className="text-lg font-bold text-neutral-900 mb-2 font-sans group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                  {item.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Professional History sub-section */}
        <div className="mt-28">
          <div className="flex items-center gap-2 mb-10">
            <Milestone className="w-5 h-5 text-purple-600" />
            <h4 className="text-xl font-bold text-neutral-900 font-sans uppercase tracking-wider">
              Work & Independent Roles
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                style={{ willChange: "transform, opacity" }}
              >
                <BorderGlow
                  className="w-full h-full border border-neutral-200 shadow-sm cursor-pointer"
                  backgroundColor="#ffffff"
                  borderRadius={16}
                  glowColor="242 90 70"
                  colors={['#818cf8', '#6366f1', '#a78bfa']}
                >
                  <div className="p-6 flex flex-col justify-between h-full min-h-[280px]">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-purple-600 uppercase tracking-widest block mb-1">
                        {exp.period}
                      </span>
                      <h5 className="text-base font-bold text-neutral-900 mb-1 font-sans">
                        {exp.role}
                      </h5>
                      <p className="text-xs font-sans text-neutral-500 mb-4">
                        {exp.company}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {exp.description.slice(0, 3).map((desc, dIdx) => (
                          <li key={dIdx} className="text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5 font-sans">
                            <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full mt-1.5 shrink-0" />
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stacks */}
                    <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-4">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic college performance callout */}
        <div className="mt-16 bg-white border border-neutral-200 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-base font-bold text-neutral-900 font-sans">Bachelor of Technology inside CSE</h5>
              <p className="text-xs font-sans text-neutral-500 mt-0.5">
                {PERSONAL_INFO.university} • CGPA: {PERSONAL_INFO.cgpa}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
              <span className="text-[10px] font-mono text-purple-600/70 uppercase tracking-wider font-semibold">Expected Graduation</span>
              <span className="w-1 h-1 rounded-full bg-purple-300" />
              <span className="text-xs font-sans font-bold text-purple-700 tracking-wide">Class of 2027</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Journey;
