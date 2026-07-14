import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 110, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 110, damping: 22, mass: 0.6 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFinePointer);
    if (!isFinePointer) return;

    // Single global listener updating motion values directly (no React
    // re-render, no layout reads) — negligible cost vs. per-frame overhead.
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[5] mix-blend-multiply will-change-transform"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(109,102,255,0.12) 0%, rgba(236,72,153,0.07) 35%, transparent 65%)",
        filter: "blur(20px)",
      }}
    />
  );
}
