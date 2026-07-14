import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] bg-neutral-100/40 pointer-events-none">
      <motion.div
        style={{ scaleX }}
      className="h-full w-full origin-left bg-[linear-gradient(to_right,#6d66ff,#a855f7,#ec4899,#f43f5e,#f59e0b,#06b6d4)] shadow-[0_0_8px_rgba(109,102,255,0.5)] will-change-transform"
      />
    </div>
  );
}
