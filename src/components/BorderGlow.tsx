import React, { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '270 90 70',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const width = rectRef.current?.width ?? el.clientWidth;
    const height = rectRef.current?.height ?? el.clientHeight;
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      rectRef.current = card.getBoundingClientRect();
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      rectRef.current = null;
      card.style.setProperty('--border-opacity', '0');
      card.style.setProperty('--glow-opacity', '0');
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const rect = rectRef.current;
    if (!card || !rect) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const proximity = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);
      const colorSensitivity = edgeSensitivity + 20;
      const borderOpacity = Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity));
      const glowOpacity = Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity));
      card.style.setProperty('--border-opacity', borderOpacity.toFixed(4));
      card.style.setProperty('--glow-opacity', glowOpacity.toFixed(4));
      card.style.setProperty('--cursor-angle-deg', `${angle.toFixed(3)}deg`);
    });
  }, [getEdgeProximity, getCursorAngle, edgeSensitivity]);

  useEffect(() => {
    if (!animated) return;
    const card = cardRef.current;
    if (!card) return;
    const angleStart = 110;
    const angleEnd = 465;

    animateValue({ duration: 500, onUpdate: v => {
      const proximity = v / 100;
      const colorSensitivity = edgeSensitivity + 20;
      const borderOpacity = Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity));
      const glowOpacity = Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity));
      card.style.setProperty('--border-opacity', borderOpacity.toFixed(4));
      card.style.setProperty('--glow-opacity', glowOpacity.toFixed(4));
    } });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      const angle = (angleEnd - angleStart) * (v / 100) + angleStart;
      card.style.setProperty('--cursor-angle-deg', `${angle.toFixed(3)}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      const angle = (angleEnd - angleStart) * (v / 100) + angleStart;
      card.style.setProperty('--cursor-angle-deg', `${angle.toFixed(3)}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => {
        const proximity = v / 100;
        const colorSensitivity = edgeSensitivity + 20;
        const borderOpacity = Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity));
        const glowOpacity = Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity));
        card.style.setProperty('--border-opacity', borderOpacity.toFixed(4));
        card.style.setProperty('--glow-opacity', glowOpacity.toFixed(4));
      }
    });
  }, [animated, edgeSensitivity]);

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map(g => `${g} border-box`);
  const fillBg = meshGradients.map(g => `${g} padding-box`);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative grid isolate border border-white/10 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow: 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px',
      }}
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 'var(--border-opacity, 0)',
          maskImage: `conic-gradient(from var(--cursor-angle-deg, 45deg) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from var(--cursor-angle-deg, 45deg) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: 'opacity 0.25s ease-out',
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskImage: `radial-gradient(ellipse at center, transparent 30%, black 100%), conic-gradient(from var(--cursor-angle-deg, 45deg) at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          WebkitMaskImage: `radial-gradient(ellipse at center, transparent 30%, black 100%), conic-gradient(from var(--cursor-angle-deg, 45deg) at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
          opacity: `calc(var(--border-opacity, 0) * ${fillOpacity})`,
          mixBlendMode: 'soft-light',
          transition: 'opacity 0.25s ease-out',
        } as React.CSSProperties}
      />

      {/* outer glow */}
      <span
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          maskImage: `conic-gradient(from var(--cursor-angle-deg, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from var(--cursor-angle-deg, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: 'var(--glow-opacity, 0)',
          mixBlendMode: 'plus-lighter',
          transition: 'opacity 0.25s ease-out',
        } as React.CSSProperties}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="flex flex-col relative h-full w-full z-[1] rounded-[inherit] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
