import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PERSONAL_INFO } from "../data";
import { smoothScrollTo } from "../lib/smoothScroll";
import { synth, NOTES } from "./AmbientSound";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Trajectory" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Connect" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 1. Optimized Scroll Check (throttled/passive)
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 15);
      });
    };
    
    // Initial check
    handleScroll();
    
    // Use passive listener to not block main thread
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // 2. Intersection Observer for Scroll Spy
    // This entirely replaces the heavy .offsetTop logic
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is around the middle
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      smoothScrollTo(el, { offset: -12, duration: 1.3 });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 h-20 flex items-center px-6 md:px-12 justify-between transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/50" : "bg-transparent"
    }`}>
      <div className="flex items-center cursor-pointer" onClick={() => handleNavClick("home")}>
        <span className="font-sans text-sm font-black tracking-tight text-neutral-900 hover:text-purple-600 transition-colors">
          Ronak.dev
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-transparent px-2 py-1.5 rounded-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`px-4 py-2.5 text-sm font-sans font-medium transition-colors cursor-pointer relative ${
              activeSection === item.id
                ? "text-purple-600 font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {activeSection === item.id && (
              <motion.span
                layoutId="active-nav-line"
                className="absolute bottom-0 left-4 right-4 h-[2px] bg-purple-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Call CTA */}
      <div className="flex items-center gap-3">
        <a
          href={PERSONAL_INFO.resumeDrive}
          target="_blank"
          referrerPolicy="no-referrer"
          onClick={() => synth.playChord([261.63, 329.63, 392.00], "sine")}
          className="hidden sm:flex items-center justify-center border border-neutral-200 hover:border-neutral-300 text-xs font-sans font-medium text-neutral-600 hover:text-neutral-900 px-4 h-10 rounded-full cursor-pointer transition-colors"
        >
          <span>Resume</span>
        </a>
        <a
          href="#contact"
          id="nav-connect-cta"
          onClick={(e) => {
            e.preventDefault();
            synth.playNote(NOTES.success[3], "sine", 0.4);
            handleNavClick("contact");
          }}
          className="bg-transparent border border-purple-500 hover:bg-purple-500/10 text-purple-600 font-medium font-sans text-xs px-4.5 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        >
          Connect
        </a>
      </div>
    </header>
  );
}
