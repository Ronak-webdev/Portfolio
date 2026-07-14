import React, { useState, useRef, MouseEvent, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Award, Cpu } from "lucide-react";
import { synth } from "./AmbientSound";
import BorderGlow from "./BorderGlow";
import { Icon } from "@iconify/react";

// ══════════════════════════════════════ DATA DEFINITIONS ══════════════════════════════════════

interface SkillData {
  name: string;
  desc: string;
  level: number;
  icon: string;
  color: string;
  glowColor: string;
  colors: string[];
}

const SKILL_TABS = [
  { id: "ai", label: "AI & ML" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "cloud", label: "Cloud & DevOps" }
];

const SKILLS_DATA: Record<string, SkillData[]> = {
  ai: [
    { name: "PyTorch", desc: "Deep Learning, GPU inference, custom training pipelines", level: 92, icon: "simple-icons:pytorch", color: "#EE4C2C", glowColor: "11 85 85", colors: ["#EE4C2C", "#f472b6", "#38bdf8"] },
    { name: "Hugging Face", desc: "Transformers, model deployment, Spaces hosting, finetuning", level: 88, icon: "simple-icons:huggingface", color: "#FFD21E", glowColor: "45 80 80", colors: ["#FFD21E", "#38bdf8", "#ec4899"] },
    { name: "Computer Vision", desc: "OpenCV, YOLO, segmentation, OCR, image processing pipelines", level: 90, icon: "simple-icons:opencv", color: "#10B981", glowColor: "150 80 80", colors: ["#10B981", "#34d399", "#06b6d4"] },
    { name: "Audio AI & DSP", desc: "Whisper speech models, Demucs vocal separation, digital audio processing", level: 85, icon: "material-symbols:graphic-eq", color: "#EC4899", glowColor: "320 80 80", colors: ["#EC4899", "#d946ef", "#a855f7"] },
    { name: "LLMs & RAG", desc: "LangChain, Gemini API, OpenAI proxy APIs, prompt engineering, vectorDBs", level: 82, icon: "simple-icons:langchain", color: "#A855F7", glowColor: "270 80 80", colors: ["#A855F7", "#6366f1", "#0284c7"] },
    { name: "AI Agents", desc: "Agentic workflows, task automation, recursive reasoning loop systems", level: 78, icon: "material-symbols:smart-toy-outline", color: "#EC4899", glowColor: "335 85 80", colors: ["#EC4899", "#8b5cf6", "#14b8a6"] },
    { name: "Scikit-learn", desc: "Classical ML, data preprocessing, model evaluation, statistics", level: 80, icon: "simple-icons:scikitlearn", color: "#0EA5E9", glowColor: "200 80 80", colors: ["#0EA5E9", "#3b82f6", "#22c55e"] },
    { name: "Generative AI", desc: "Stable Diffusion, multimodal AI, latency optimization", level: 75, icon: "material-symbols:auto-awesome", color: "#F59E0B", glowColor: "40 85 80", colors: ["#F59E0B", "#ea580c", "#ec4899"] }
  ],
  frontend: [
    { name: "React.js", desc: "Custom hooks, Context API, state machines, highly modular components", level: 92, icon: "simple-icons:react", color: "#61DAFB", glowColor: "190 85 80", colors: ["#61DAFB", "#0ea5e9", "#7c3aed"] },
    { name: "Next.js", desc: "Server components, file router, SEO optimizations, edge caching", level: 88, icon: "simple-icons:nextdotjs", color: "#111111", glowColor: "0 0 20", colors: ["#111111", "#737373", "#e5e5e5"] },
    { name: "Tailwind CSS", desc: "Fluid layouts, utility optimization, responsive patterns, modular presets", level: 95, icon: "simple-icons:tailwindcss", color: "#38BDF8", glowColor: "195 80 80", colors: ["#38BDF8", "#06b6d4", "#10b981"] },
    { name: "Three.js & R3F", desc: "WebGL 3D graphics, camera matrices, custom mesh physics shaders", level: 80, icon: "simple-icons:threedotjs", color: "#A259FF", glowColor: "260 85 80", colors: ["#A259FF", "#ec4899", "#3b82f6"] },
    { name: "GSAP & Framer", desc: "Scroll trigger timelines, spring layouts, fine micro-interactions", level: 85, icon: "simple-icons:greensock", color: "#88CE02", glowColor: "80 80 80", colors: ["#88CE02", "#10b981", "#3b82f6"] },
    { name: "TypeScript", desc: "Advanced generics, strict typing interfaces, mapped types, compile-safety", level: 87, icon: "simple-icons:typescript", color: "#3178C6", glowColor: "210 80 80", colors: ["#3178C6", "#0284c7", "#8b5cf6"] }
  ],
  backend: [
    { name: "Node.js", desc: "REST APIs, high-throughput pipelines, server event-driven loop architectures", level: 90, icon: "simple-icons:nodedotjs", color: "#339933", glowColor: "120 75 80", colors: ["#339933", "#22c55e", "#10b981"] },
    { name: "FastAPI", desc: "Python high-performance APIs, Pydantic data checks, async background queues", level: 88, icon: "simple-icons:fastapi", color: "#009688", glowColor: "175 80 80", colors: ["#009688", "#14b8a6", "#2563eb"] },
    { name: "MongoDB", desc: "Document structure modeling, aggregation pipelines, Atlas sharding", level: 85, icon: "simple-icons:mongodb", color: "#47A248", glowColor: "120 80 80", colors: ["#47A248", "#10b981", "#f59e0b"] },
    { name: "PostgreSQL", desc: "Relational data structures, Prisma indexes, optimized nested joins", level: 82, icon: "simple-icons:postgresql", color: "#336791", glowColor: "205 75 80", colors: ["#336791", "#3b82f6", "#6366f1"] },
    { name: "Socket.IO", desc: "Bidirectional WebSockets, synchronized audio/listening rooms", level: 83, icon: "simple-icons:socketdotio", color: "#010101", glowColor: "0 0 100", colors: ["#a855f7", "#ec4899", "#06b6d4"] },
    { name: "Docker", desc: "Containerized multi-stage deployments, isolated environment layers", level: 78, icon: "simple-icons:docker", color: "#2496ED", glowColor: "205 85 80", colors: ["#2496ED", "#008fe2", "#38bdf8"] }
  ],
  cloud: [
    { name: "Google Cloud", desc: "Gemini server integrations, Cloud Functions, IAM setup, VM instances", level: 80, icon: "simple-icons:googlecloud", color: "#4285F4", glowColor: "215 80 80", colors: ["#4285F4", "#ea4335", "#fbbc05"] },
    { name: "AWS & Azure", desc: "S3 assets buckets, virtual servers, robust enterprise cloud setups", level: 75, icon: "simple-icons:amazonwebservices", color: "#FF9900", glowColor: "35 85 80", colors: ["#FF9900", "#ea580c", "#3b82f6"] },
    { name: "Cloudflare", desc: "Cdn edge delivery, Cloudflare Tunnels, proxy rules, Page workers", level: 82, icon: "simple-icons:cloudflare", color: "#F38020", glowColor: "25 80 80", colors: ["#F38020", "#ea580c", "#fbbf24"] },
    { name: "Vercel", desc: "Serverless web deploys, integrated continuous delivery Git pipelines", level: 90, icon: "simple-icons:vercel", color: "#111111", glowColor: "0 0 20", colors: ["#111111", "#525252", "#e5e5e5"] },
    { name: "Auth Systems", desc: "Clerk secure portals, JWT, OAuth 2.0 flow states, Firebase Auth", level: 88, icon: "material-symbols:vpn-key-outline", color: "#46E3B7", glowColor: "165 75 80", colors: ["#46E3B7", "#059669", "#8b5cf6"] },
    { name: "Git & GitHub", desc: "Branching controls, semantic release webhooks, GitHub Actions CI/CD", level: 92, icon: "simple-icons:git", color: "#F05032", glowColor: "12 85 80", colors: ["#F05032", "#ea580c", "#a855f7"] }
  ]
};

// ══════════════════════════════════════ REPELLING FLOATING TECH ICONS ══════════════════════════════════════

interface FloatingIconConfig {
  id: number;
  icon: string;
  label: string;
  className: string;
  color: string;
}
const REPELLING_ICONS: FloatingIconConfig[] = [
  { id: 1, icon: "simple-icons:pytorch", label: "PyTorch", className: "top-[15%] left-[10%] md:left-[15%]", color: "rgba(238, 76, 44, 0.4)" },
  { id: 2, icon: "simple-icons:react", label: "React.js", className: "top-[20%] right-[10%] md:right-[15%]", color: "rgba(97, 218, 251, 0.4)" },
  { id: 3, icon: "simple-icons:nodedotjs", label: "Node.js", className: "top-[65%] left-[10%] md:left-[15%]", color: "rgba(51, 153, 51, 0.4)" },
  { id: 4, icon: "simple-icons:nextdotjs", label: "Next.js", className: "bottom-[15%] right-[10%] md:right-[15%]", color: "rgba(17, 17, 17, 0.4)" },
  { id: 5, icon: "simple-icons:typescript", label: "TypeScript", className: "top-[15%] left-[25%] md:left-[28%]", color: "rgba(49, 120, 198, 0.4)" },
  { id: 6, icon: "simple-icons:fastapi", label: "FastAPI", className: "top-[15%] right-[25%] md:right-[30%]", color: "rgba(0, 150, 136, 0.4)" },
  { id: 7, icon: "simple-icons:docker", label: "Docker", className: "bottom-[22%] left-[22%] md:left-[26%]", color: "rgba(36, 150, 237, 0.4)" },
  { id: 8, icon: "simple-icons:mongodb", label: "MongoDB", className: "top-[42%] left-[8%] md:left-[12%]", color: "rgba(71, 162, 72, 0.4)" },
  { id: 9, icon: "simple-icons:postgresql", label: "PostgreSQL", className: "top-[72%] right-[20%] md:right-[24%]", color: "rgba(51, 103, 145, 0.4)" },
  { id: 10, icon: "simple-icons:cloudflare", label: "Cloudflare", className: "bottom-[12%] left-[32%] md:left-[36%]", color: "rgba(243, 128, 32, 0.4)" },
  { id: 11, icon: "simple-icons:huggingface", label: "Hugging Face", className: "top-[45%] right-[8%] md:right-[12%]", color: "rgba(255, 210, 30, 0.4)" },
  { id: 12, icon: "material-symbols:graphic-eq", label: "Audio AI", className: "top-[55%] left-[18%] md:left-[22%]", color: "rgba(236, 72, 153, 0.4)" },
  { id: 13, icon: "simple-icons:tailwindcss", label: "Tailwind CSS", className: "top-[30%] left-[20%] md:left-[24%]", color: "rgba(56, 189, 248, 0.4)" },
  { id: 14, icon: "simple-icons:git", label: "Git", className: "bottom-[12%] right-[32%] md:right-[36%]", color: "rgba(240, 80, 50, 0.4)" },
  { id: 15, icon: "simple-icons:threedotjs", label: "Three.js", className: "top-[32%] right-[20%] md:right-[24%]", color: "rgba(162, 89, 255, 0.4)" },
  { id: 16, icon: "simple-icons:googlegemini", label: "Gemini API", className: "top-[58%] right-[25%] md:right-[28%]", color: "rgba(168, 85, 247, 0.4)" }
];

const InteractiveIcon = ({
  iconData,
  index,
  registerIcon,
}: {
  iconData: FloatingIconConfig;
  index: number;
  registerIcon: (
    index: number,
    cx: number,
    cy: number,
    setX: (val: number) => void,
    setY: (val: number) => void,
    reset: () => void
  ) => void;
  key?: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 25 });
  const springY = useSpring(y, { stiffness: 180, damping: 25 });

  // Cache the icon's page-space center once on mount/resize instead of
  // calling getBoundingClientRect() on every mousemove (avoids layout thrash).
  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + window.scrollX + rect.width / 2;
      const cy = rect.top + window.scrollY + rect.height / 2;
      registerIcon(
        index,
        cx,
        cy,
        (val) => x.set(val),
        (val) => y.set(val),
        () => {
          x.set(0);
          y.set(0);
        }
      );
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [index, registerIcon, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className={`absolute cursor-pointer group ${iconData.className}`}
    >
      <div
        className="flex flex-col items-center justify-center w-14 h-14 md:w-18 md:h-18 p-3 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-neutral-200 transition-all duration-300 group-hover:border-purple-400 group-hover:bg-white animate-[float-blob_8s_ease-in-out_infinite] will-change-transform"
      >
        <Icon icon={iconData.icon} className="w-7 h-7 md:w-9 md:h-9 transition-all duration-300 group-hover:scale-110" style={{ color: iconData.color.replace("0.4)", "1.0)") }} />
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-[10px] font-mono text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-30">
        {iconData.label}
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════ CORE SKILLS MAIN COMPONENT ══════════════════════════════════════

export default function Skills() {
  const [activeTab, setActiveTab] = useState("ai");
  const iconRefs = useRef<{ cx: number; cy: number; setX: (v: number) => void; setY: (v: number) => void; reset: () => void }[]>([]);

  const registerIcon = useCallback((
    index: number,
    cx: number,
    cy: number,
    setX: (val: number) => void,
    setY: (val: number) => void,
    reset: () => void
  ) => {
    iconRefs.current[index] = { cx, cy, setX, setY, reset };
  }, []);

  const requestRef = useRef<number | null>(null);

  const handleRepulsionMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const mx = event.pageX;
    const my = event.pageY;

    if (requestRef.current) return;

    requestRef.current = requestAnimationFrame(() => {
      iconRefs.current.forEach((icon) => {
        if (!icon) return;
        const dx = mx - icon.cx;
        const dy = my - icon.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 160) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / 160) * 60;
          icon.setX(-Math.cos(angle) * force);
          icon.setY(-Math.sin(angle) * force);
        } else {
          icon.setX(0);
          icon.setY(0);
        }
      });
      requestRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const handleRepulsionMouseLeave = () => {
    iconRefs.current.forEach((icon) => {
      if (icon) icon.reset();
    });
  };

  const handleCardMouseEnter = (sIdx: number) => {
    // Soft sound triggers
    const baseFreq = 220.00; // A3
    const freq = baseFreq + (sIdx % 10) * 40;
    synth.playNote(freq, "triangle", 0.15);
  };

  return (
    <div id="skills">
      {/* ════════ SECTION 1: TABBED SKILLS & PROGRESS PANEL ════════ */}
      <section className="section bg-transparent text-neutral-900 py-24 relative overflow-hidden">
        {/* Symmetrical dark grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.3em] text-purple-600 uppercase mb-3 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
              02 / Expertise
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight mb-4 text-neutral-900">
              Skills & <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Technology Stack</span>
            </h2>
            <p className="text-sm text-neutral-500 font-sans max-w-lg leading-relaxed">
              Synthesized benchmarks of my technical capabilities spanning Deep Learning models and Full-Stack Engineering.
            </p>
          </motion.div>

          {/* Skill Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-neutral-100 border border-neutral-200 p-1 rounded-xl">
              {SKILL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    synth.playNote(330, "sine", 0.1);
                  }}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-sans font-semibold tracking-wide rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "text-purple-600 bg-white shadow-sm border border-neutral-200/50"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills Panels */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {SKILLS_DATA[activeTab].map((skill, index) => (
              <BorderGlow
                key={skill.name}
                edgeSensitivity={30}
                glowColor={skill.glowColor}
                backgroundColor="#ffffff"
                borderRadius={20}
                glowRadius={25}
                glowIntensity={1.2}
                coneSpread={22}
                animated={true}
                colors={skill.colors}
                fillOpacity={0.4}
                className="group"
              >
                <div
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  className="p-5 h-auto min-h-[115px] flex flex-col justify-center relative overflow-hidden bg-white rounded-[inherit]"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <Icon icon={skill.icon} className="w-6 h-6" style={{ color: skill.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-neutral-900 font-sans tracking-tight">
                        {skill.name}
                      </h4>
                      <p className="mt-1.5 text-xs text-neutral-500 font-sans leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </motion.div>

          {/* Floating Competencies Metrics Box with BorderGlow */}
          <div className="mt-16 max-w-4xl mx-auto">
            <BorderGlow
              edgeSensitivity={40}
              glowColor="270 90 70"
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={30}
              glowIntensity={1.0}
              colors={["#a855f7", "#ec4899", "#3b82f6"]}
            >
              <div className="flex flex-col sm:flex-row justify-around gap-6 items-center p-6 text-center sm:text-left">
                <div className="flex items-center gap-3 text-xs text-neutral-700 font-sans font-medium">
                  <Award className="w-6 h-6 text-purple-600 shrink-0" />
                  <span>Highest semester GPA achieved: <strong className="text-purple-700 font-bold font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-100">9.00</strong></span>
                </div>
                <div className="h-px w-full sm:h-8 sm:w-px bg-neutral-200" />
                <div className="flex items-center gap-3 text-xs text-neutral-700 font-sans font-medium">
                  <Cpu className="w-6 h-6 text-indigo-600 shrink-0 animate-pulse" />
                  <span>Primary framework suite: <strong className="text-indigo-700 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">PyTorch, YOLOv8 & Next.js</strong></span>
                </div>
              </div>
            </BorderGlow>
          </div>

        </div>
      </section>

      {/* ════════ SECTION 2: INTERACTIVE REPELLING TECHNOLOGY SPACE ════════ */}
      <section
        onMouseMove={handleRepulsionMouseMove}
        onMouseLeave={handleRepulsionMouseLeave}
        className="relative w-full h-[600px] min-h-[500px] flex flex-col items-center justify-center overflow-hidden bg-transparent"
      >
        {/* Ambient background particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,transparent_100%)] pointer-events-none z-0" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        {/* Floating tech background container */}
        <div className="absolute inset-0 w-full h-full z-10">
          {REPELLING_ICONS.map((iconData, index) => (
            <InteractiveIcon
              key={iconData.id}
              registerIcon={registerIcon}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>

        {/* Central visual text header */}
        <div className="relative z-20 text-center px-4 max-w-xl pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-600 font-semibold">Interactive Tech Cosmos</span>
          </motion.div>
          <h3 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-neutral-900 mb-4">
            Interactive <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Technology Space</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Move your cursor across the grid. Discover my live ecosystem of libraries, database engines, cloud frameworks, and deep learning nodes that react dynamically.
          </p>
        </div>
      </section>
    </div>
  );
}
