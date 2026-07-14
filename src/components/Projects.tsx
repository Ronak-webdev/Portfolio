import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, ExternalLink, Github, X, ChevronRight, BarChart3, AlertTriangle, Lightbulb, Compass, Play } from "lucide-react";
import { PROJECTS, Project } from "../data";
import { synth, NOTES } from "./AmbientSound";
import { Icon } from "@iconify/react";
import HorizontalScrollSection from "./HorizontalScrollSection";
import { getLenis } from "../lib/smoothScroll";
import Loader from "./Loader";

// ══════════════════════════════════════════════════════════════
// Horizontal Project Card — wide landscape card for scroll strip
// ══════════════════════════════════════════════════════════════

function ProjectCard({ project, onOpen, onPlayVideo, index }: { project: Project; onOpen: (p: Project) => void; onPlayVideo: (url: string) => void; index: number; key?: React.Key }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  // Color accents per card index for multicolor theme
  const accents = [
    { gradient: "from-purple-600 to-indigo-600", bg: "bg-purple-500/8", border: "border-purple-500/20", text: "text-purple-600", tag: "bg-purple-50 border-purple-100 text-purple-600" },
    { gradient: "from-rose-600 to-pink-600", bg: "bg-rose-500/8", border: "border-rose-500/20", text: "text-rose-600", tag: "bg-rose-50 border-rose-100 text-rose-600" },
    { gradient: "from-cyan-600 to-teal-600", bg: "bg-cyan-500/8", border: "border-cyan-500/20", text: "text-cyan-600", tag: "bg-cyan-50 border-cyan-100 text-cyan-600" },
    { gradient: "from-amber-600 to-orange-600", bg: "bg-amber-500/8", border: "border-amber-500/20", text: "text-amber-600", tag: "bg-amber-50 border-amber-100 text-amber-600" },
    { gradient: "from-indigo-600 to-violet-600", bg: "bg-indigo-500/8", border: "border-indigo-500/20", text: "text-indigo-600", tag: "bg-indigo-50 border-indigo-100 text-indigo-600" },
    { gradient: "from-emerald-600 to-green-600", bg: "bg-emerald-500/8", border: "border-emerald-500/20", text: "text-emerald-600", tag: "bg-emerald-50 border-emerald-100 text-emerald-600" },
    { gradient: "from-fuchsia-600 to-purple-600", bg: "bg-fuchsia-500/8", border: "border-fuchsia-500/20", text: "text-fuchsia-600", tag: "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600" },
  ];
  const accent = accents[index % accents.length];

  return (
    <div
      onClick={() => {
        synth.playChord([261.63, 329.63, 392.00, 523.25], "sine");
        onOpen(project);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex-shrink-0 w-[85vw] md:w-[520px] lg:w-[580px] max-h-[75vh] bg-white border border-neutral-200/80 rounded-2xl overflow-hidden cursor-pointer group hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-900/5 transition-all duration-500 flex flex-col`}
    >
      {/* Video / Image Area */}
      <div 
        className="relative w-full h-[280px] md:h-[340px] bg-neutral-100 overflow-hidden shrink-0"
        onClick={(e) => {
          if (project.videoUrl) {
            e.stopPropagation();
            synth.playNote(NOTES.success[3], "sine", 0.4);
            onPlayVideo(project.videoUrl);
          }
        }}
      >
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            preload="none"
            loop
            muted
            playsInline
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            <div className="w-14 h-14 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Play className={`w-5 h-5 ml-0.5 ${accent.text}`} />
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h4 className={`text-base md:text-lg font-bold text-neutral-900 group-hover:${accent.text} transition-colors mb-1 font-sans leading-tight`}>
            {project.title}
          </h4>
          {/* Tagline */}
          <p className="text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-wider">
            {project.tagline}
          </p>
          {/* Summary */}
          <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-3 font-sans">
            {project.summary}
          </p>
        </div>

        {/* Bottom */}
        <div>
          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-neutral-600"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] font-mono text-neutral-400">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className={`flex items-center justify-between border-t border-neutral-100 pt-2 text-xs font-mono text-neutral-500 group-hover:${accent.text} transition-colors`}>
            <span>View Case Study</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Projects Section — Horizontal Scroll
// ══════════════════════════════════════════════════════════════

export default function Projects() {
  const [activeTab, setActiveTab] = useState<"all" | "ai" | "web">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Handle video state
  useEffect(() => {
    if (playingVideoUrl) {
      setIsVideoLoading(true);
      (window as any).isVideoPlaying = true;
    } else {
      (window as any).isVideoPlaying = false;
    }
  }, [playingVideoUrl]);

  // Pause/resume Lenis when a modal is opened/closed to allow scrolling
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      if (selectedProject || playingVideoUrl) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    return () => {
      const l = getLenis();
      if (l) l.start();
    };
  }, [selectedProject, playingVideoUrl]);

  // Filter projects
  const filteredProjects = PROJECTS.filter((proj) => {
    const matchesTab = activeTab === "all" || proj.category === activeTab;
    const matchesQuery =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  // Section header content
  const headerContent = (
    <div className="max-w-7xl mx-auto">
      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-rose-600" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-rose-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Case Studies</span>
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-neutral-900">
            Selected Works
          </h3>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-white border border-neutral-200 rounded-lg pl-8 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-all font-mono shadow-sm w-40 md:w-52"
            />
          </div>

          {/* Tab Filters */}
          <div className="flex bg-neutral-100 border border-neutral-200 p-0.5 rounded-lg">
            {(["all", "ai", "web"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  synth.playNote(NOTES.hover[1], "sine", 0.25);
                }}
                className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab === "all" ? "All" : tab === "ai" ? "AI" : "Web"}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono text-neutral-400 hidden md:inline">
            {filteredProjects.length} projects
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {filteredProjects.length > 0 ? (
        <HorizontalScrollSection
          sectionId="projects"
          cardCount={filteredProjects.length}
          header={headerContent}
          bgClassName="bg-transparent"
          heightMultiplier={0.9}
          direction="rtl"
        >
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={setSelectedProject}
              onPlayVideo={setPlayingVideoUrl}
              index={idx}
            />
          ))}
        </HorizontalScrollSection>
      ) : (
        <section id="projects" className="bg-transparent py-20">
          <div className="px-6 md:px-12 mb-8">{headerContent}</div>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center py-20 bg-neutral-100/50 border border-neutral-200/60 rounded-2xl">
              <Compass className="w-10 h-10 text-neutral-400 mx-auto mb-4 animate-spin" />
              <p className="text-sm font-mono text-neutral-500">
                No matching case studies found. Try search terms like 'FastAPI', 'ONNX', or 'Prisma'.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto sm:my-8 max-h-[90vh] relative"
            >
              {/* Modal Banner Header */}
              <div className="p-6 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 font-bold mb-2 inline-block">
                    {selectedProject.category === "ai" ? "Computer Vision & Deep Learning" : "E-Commerce / Social Platforms"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 font-sans">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-neutral-500 mt-1">
                    {selectedProject.tagline}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    synth.playNote(220.0, "sine", 0.2);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600 hover:text-neutral-900 cursor-pointer transition-all self-start sm:self-center"
                >
                  <X className="w-4 h-4" />
                  <span>Back to Projects</span>
                </button>
              </div>

              {/* Case Study Contents Body */}
              <div 
                className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent"
                data-lenis-prevent="true"
              >
                {/* Section: Metrics Row */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-purple-600 flex items-center gap-1.5 mb-4">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    Key Performance Indicators & Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedProject.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-50 border border-neutral-200/80 p-4 rounded-xl text-center flex flex-col justify-center"
                      >
                        <p className="text-sm font-bold text-neutral-800 font-sans">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Overview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-purple-600">
                    Project Architecture Summary
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {selectedProject.summary}
                  </p>
                </div>

                {/* Section: Challenges and Solutions Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Challenges */}
                  <div className="bg-rose-50/70 border border-rose-100 p-5 rounded-xl space-y-3">
                    <h5 className="text-sm font-mono text-rose-700 flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                      Engineering Challenges
                    </h5>
                    <p className="text-xs leading-relaxed text-rose-800 font-mono">
                      {selectedProject.challenges}
                    </p>
                  </div>

                  {/* Solutions */}
                  <div className="bg-purple-50/70 border border-purple-100 p-5 rounded-xl space-y-3">
                    <h5 className="text-sm font-mono text-purple-700 flex items-center gap-2 font-bold">
                      <Lightbulb className="w-4.5 h-4.5 text-purple-500" />
                      Architectural Solutions
                    </h5>
                    <p className="text-xs leading-relaxed text-purple-800 font-mono">
                      {selectedProject.solutions}
                    </p>
                  </div>
                </div>

                {/* Highlights and Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Highlights */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-purple-600">
                      Feature Highlights
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedProject.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-sans">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Roadmap */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-indigo-600">
                      Future Product Roadmap
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedProject.roadmap.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-sans">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Stacks used */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-purple-600 mb-3">
                    Integrated Stack & SDKs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono bg-neutral-50 border border-neutral-200 py-1.5 px-3.5 rounded-lg text-neutral-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Case study authored by Ronak Prajapati.
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      synth.playNote(220.0, "sine", 0.2);
                    }}
                    className="w-full sm:w-auto px-5 h-11 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900 rounded-xl text-xs font-mono cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Close Case Study</span>
                  </button>
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 px-5 h-11 rounded-xl text-xs font-mono cursor-pointer transition-all"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 h-11 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all shadow-md shadow-purple-500/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {playingVideoUrl && (
            <div className="fixed inset-0 z-[99999] bg-neutral-900 p-4 sm:p-6 flex justify-center items-center" data-lenis-prevent="true">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-4xl rounded-2xl flex flex-col items-center justify-center"
              >
              <button
                onClick={() => {
                  setPlayingVideoUrl(null);
                  synth.playNote(220.0, "sine", 0.2);
                }}
                className="absolute -top-16 right-0 z-[9999] w-12 h-12 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative w-full max-w-3xl flex items-center justify-center">
                {/* Loader Overlay */}
                <AnimatePresence>
                  {isVideoLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                    >
                      <Loader transparentBg={true} text="BUFFERING STREAM..." />
                    </motion.div>
                  )}
                </AnimatePresence>

                <video
                  src={playingVideoUrl}
                  autoPlay
                  controls
                  playsInline
                  onCanPlay={() => setIsVideoLoading(false)}
                  className={`relative z-10 w-full h-auto aspect-video max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-all duration-700 ${isVideoLoading ? 'opacity-0 scale-[0.95]' : 'opacity-100 scale-100'}`}
                />
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
export type { };
