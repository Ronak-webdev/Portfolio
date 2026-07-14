import React, { memo, useState } from "react";
import { Award, ExternalLink, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CERTIFICATIONS, Certification } from "../data";
import { synth, NOTES } from "./AmbientSound";
import HorizontalScrollSection from "./HorizontalScrollSection";

// ══════════════════════════════════════════════════════════════
// Credential Card — displays certificate with optional image
// ══════════════════════════════════════════════════════════════

const ISSUER_COLORS: Record<string, { gradient: string; accent: string; icon: string }> = {
  "Google Cloud Skills Boost": {
    gradient: "from-blue-600 via-red-500 via-yellow-500 to-green-500",
    accent: "text-blue-600",
    icon: "bg-blue-50 border-blue-100",
  },
  "Cisco Networking Academy": {
    gradient: "from-cyan-600 to-teal-500",
    accent: "text-cyan-600",
    icon: "bg-cyan-50 border-cyan-100",
  },
  "MathWorks": {
    gradient: "from-orange-500 to-amber-500",
    accent: "text-orange-600",
    icon: "bg-orange-50 border-orange-100",
  },
  "MongoDB University": {
    gradient: "from-green-600 to-emerald-500",
    accent: "text-green-600",
    icon: "bg-green-50 border-green-100",
  },
  "Udemy Certified": {
    gradient: "from-purple-600 to-violet-500",
    accent: "text-purple-600",
    icon: "bg-purple-50 border-purple-100",
  },
};

const DEFAULT_COLORS = {
  gradient: "from-indigo-600 to-purple-600",
  accent: "text-indigo-600",
  icon: "bg-indigo-50 border-indigo-100",
};

function CredentialCard({ cert, index, onOpen }: { cert: Certification; index: number; onOpen: (url: string) => void; key?: React.Key }) {
  const colors = ISSUER_COLORS[cert.issuer] || DEFAULT_COLORS;

  return (
    <div
      className="flex-shrink-0 w-[80vw] md:w-[380px] lg:w-[420px] bg-white border border-neutral-200/80 rounded-2xl overflow-hidden group hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-900/5 transition-[border-color,box-shadow] duration-500 flex flex-col cursor-pointer"
      onClick={() => {
        synth.playNote(NOTES.hover[index % NOTES.hover.length], "sine", 0.25);
        if (cert.imageUrl) {
          onOpen(cert.imageUrl);
        } else if (cert.link) {
          window.open(cert.link, "_blank");
        }
      }}
    >
      {/* Certificate Image / Placeholder Area */}
      <div className="relative w-full h-52 md:h-60 overflow-hidden">
        {cert.imageUrl ? (
          <img
            src={cert.imageUrl}
            alt={cert.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : cert.link && (cert.link.endsWith(".pdf") || cert.link.endsWith(".html")) ? (
          <iframe
            src={cert.link}
            title={cert.name}
            className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
            scrolling="no"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} opacity-[0.08] absolute inset-0`} />
        )}
        {!cert.imageUrl && !(cert.link && (cert.link.endsWith(".pdf") || cert.link.endsWith(".html"))) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
            <div className={`w-16 h-16 rounded-2xl ${colors.icon} border flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <Award className={`w-7 h-7 ${colors.accent}`} />
            </div>
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              Certificate
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${colors.accent} mb-2`}>
          {cert.issuer}
        </p>
        <h4 className="text-sm md:text-base font-bold text-neutral-900 font-sans leading-snug group-hover:text-purple-600 transition-colors">
          {cert.name}
        </h4>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Credentials Section — Horizontal Scroll
// ══════════════════════════════════════════════════════════════

const Credentials = memo(function Credentials() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const headerContent = (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-amber-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Credentials
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-neutral-900">
            Professional Credentials
          </h3>
        </div>
        <p className="text-neutral-500 max-w-sm text-sm font-sans leading-relaxed">
          Industry certifications and accreditations validating expertise across AI, cloud, and engineering domains.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <HorizontalScrollSection
        sectionId="credentials"
        cardCount={CERTIFICATIONS.length}
        header={headerContent}
        bgClassName="bg-transparent"
        heightMultiplier={0.75}
        direction="ltr"
      >
        {CERTIFICATIONS.map((cert, idx) => (
          <CredentialCard key={idx} cert={cert} index={idx} onOpen={setSelectedCert} />
        ))}
      </HorizontalScrollSection>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center" data-lenis-prevent="true">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center max-w-3xl w-full"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={selectedCert}
                alt="Certificate"
                className="w-full h-auto max-h-[85vh] object-contain bg-neutral-100"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Credentials;
