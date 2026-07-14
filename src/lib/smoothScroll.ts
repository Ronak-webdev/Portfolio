import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

/** Boots a single shared Lenis instance that powers buttery, inertia-based
 *  scrolling for the whole page (vertical page scroll AND the pinned
 *  horizontal sections, since Framer Motion's useScroll tracks the same
 *  native scroll position Lenis animates). Safe to call multiple times. */
export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 0.8,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: true,
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Smoothly scrolls to a target element/selector/offset via the shared Lenis
 *  instance, falling back to native smooth scroll if Lenis isn't ready. */
export function smoothScrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, { offset: options?.offset ?? 0, duration: options?.duration ?? 1.2 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}

export function destroyLenis() {
  if (rafId) cancelAnimationFrame(rafId);
  lenisInstance?.destroy();
  lenisInstance = null;
  rafId = null;
}
