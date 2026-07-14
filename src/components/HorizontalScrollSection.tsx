import { useRef, useState, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface HorizontalScrollSectionProps {
  children: ReactNode;
  /** Number of cards — used to trigger recalculations */
  cardCount: number;
  /** Section ID for navigation anchoring */
  sectionId?: string;
  /** Header content rendered above the horizontal scroll area */
  header?: ReactNode;
  /** Background class name */
  bgClassName?: string;
  /** Height multiplier fallback (not strictly used if dynamic calculates) */
  heightMultiplier?: number;
  /** Scroll direction direction - ltr (left-to-right) or rtl (right-to-left) */
  direction?: "ltr" | "rtl";
}

export default function HorizontalScrollSection({
  children,
  cardCount,
  sectionId,
  header,
  bgClassName = "bg-white",
  direction = "ltr",
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerHeight, setContainerHeight] = useState<string>("200vh");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const calculateScroll = () => {
      if (trackRef.current && containerRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = containerRef.current.clientWidth;
        
        // The scroll distance is exactly the overflow width of the track
        // We add a tiny buffer (32px) so the last card doesn't touch the screen edge perfectly
        const scrollDistance = Math.max(0, trackWidth - viewportWidth + 32);
        
        setMaxScroll(scrollDistance);
        setContainerHeight(`${window.innerHeight + scrollDistance}px`);
      }
    };

    // Monitor track size changes (loading, images loading, cards rendering) dynamically
    const observer = new ResizeObserver(() => {
      calculateScroll();
    });

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    window.addEventListener("resize", calculateScroll, { passive: true });
    window.addEventListener("load", calculateScroll);
    calculateScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateScroll);
      window.removeEventListener("load", calculateScroll);
    };
  }, [cardCount, isMobile]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Lenis already provides smooth scrolling, so we use direct transform
  // instead of useSpring to avoid double-interpolation lag on reverse scroll.
  const x = useTransform(scrollYProgress, (progress) => {
    return direction === "rtl" ? -maxScroll + progress * maxScroll : -progress * maxScroll;
  });

  // ── Mobile: simple horizontal scroll (no sticky) ──
  if (isMobile) {
    return (
      <section id={sectionId} className={`${bgClassName} py-16 overflow-hidden`}>
        {header && (
          <div className="px-6 mb-8">{header}</div>
        )}
        <div className="overflow-x-auto scrollbar-hide px-6 pb-4">
          <div className="flex gap-6" style={{ width: `max-content` }}>
            {children}
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: sticky pinned horizontal scroll ──
  return (
    <section
      id={sectionId}
      ref={containerRef}
      className={`relative ${bgClassName}`}
      style={{ height: containerHeight }}
    >
      {/* Sticky wrapper — pins to viewport during scroll */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header area */}
        {header && (
          <div className="shrink-0 px-6 md:px-12 lg:px-16 pt-20 pb-4 relative z-10">
            {header}
          </div>
        )}

        {/* Horizontal scrolling card track — fills remaining viewport */}
        <div className="flex-1 flex items-center overflow-hidden relative min-h-0 pb-10">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 md:gap-8 px-6 md:px-12 lg:px-16 will-change-transform h-full items-center py-4"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
