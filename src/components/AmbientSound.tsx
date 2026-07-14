import { useState, useEffect, memo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Web Audio API Synthesizer Class
class SoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeTimeouts: any[] = [];

  constructor() {}

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.clearTimeouts();
    } else {
      this.init();
    }
  }

  public setTimeoutTracked(fn: () => void, delay: number) {
    const tid = setTimeout(() => {
      fn();
      this.activeTimeouts = this.activeTimeouts.filter(t => t !== tid);
    }, delay);
    this.activeTimeouts.push(tid);
    return tid;
  }

  public clearTimeouts() {
    this.activeTimeouts.forEach(t => clearTimeout(t));
    this.activeTimeouts = [];
  }

  // Tactical typing keypress click sound
  public playTypeClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    // Randomize pitch for realistic keyboard layout variations
    const pitch = 1000 + Math.random() * 500;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.018); // very short mechanical key tick
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  // Interactive mouse click sweep sound
  public playInteractiveClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play a beautiful, soft ambient piano note
  public playNote(frequency: number, type: OscillatorType = "triangle", duration = 2.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle"; // triangle waveform has softer harmonics than square/sawtooth
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    // Felt-piano simulation: heavy filter cutting out highs for warmth
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

    // Warm soft piano keypress envelope
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.02); // rapid soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration); // slow natural release

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Play a piano chord cascade
  public playChord(frequencies: number[], type: OscillatorType = "sine") {
    if (this.isMuted) return;
    frequencies.forEach((freq, index) => {
      this.setTimeoutTracked(() => {
        this.playNote(freq, "triangle", 2.2);
      }, index * 100);
    });
  }

  // Play a background piano arpeggio note
  public playAmbientNote(frequency: number, type: OscillatorType = "triangle", duration = 6.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + duration);

    // Highpass filter to cut out sub-bass frequencies below 200 Hz (prevents speaker distortion)
    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(200, this.ctx.currentTime);

    // Extremely soft background piano touch
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.15); // gentle touch
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const synth = new SoundSynth();

// Harmonious Major Pentatonic scales for a perfectly relaxing composition
export const NOTES = {
  hover: [261.63, 293.66, 329.63, 392.00, 440.00], // C4, D4, E4, G4, A4
  click: [523.25, 587.33, 659.25, 783.99, 880.00], // C5, D5, E5, G5, A5
  success: [261.63, 329.63, 392.00, 523.25, 659.25], // C Major
};

const AmbientSound = memo(function AmbientSound() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    synth.setMute(muted);
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (!muted) {
      // Play a lovely welcoming soft piano sweep
      synth.playChord([261.63, 329.63, 392.00, 523.25], "triangle");

      const playContinuousAmbient = () => {
        // Skip playing new ambient sounds if video is actively open
        if ((window as any).isVideoPlaying) return;

        const chordSelection = [
          [196.00, 293.66, 329.63, 392.00, 493.88], // G Maj9

          [261.63, 329.63, 392.00, 440.00, 523.25], // C Maj7/9
          [329.63, 392.00, 440.00, 493.88, 587.33], // E min11
          [220.00, 329.63, 392.00, 440.00, 523.25], // A min9
          [174.61, 261.63, 349.23, 392.00, 523.25], // F Maj9
          [293.66, 392.00, 440.00, 587.33, 659.25], // G6/9
        ];
        const selectedChord = chordSelection[Math.floor(Math.random() * chordSelection.length)];
        
        // Randomly play ascending, descending, or scrambled arpeggio stagger
        const playOrder = Array.from({ length: selectedChord.length }, (_, i) => i);
        if (Math.random() > 0.5) playOrder.reverse();
        else if (Math.random() > 0.7) playOrder.sort(() => Math.random() - 0.5);

        selectedChord.forEach((freq, idx) => {
          const index = playOrder[idx];
          // Detune slightly for warm analogue tape character (+/- 1.5 Hz)
          const jitter = (Math.random() - 0.5) * 3;
          // Dynamically shift octave of random notes for high-register sparkles (15% chance)
          const octave = Math.random() > 0.85 ? 2 : 1;
          const finalFreq = (freq * octave) + jitter;

          synth.setTimeoutTracked(() => {
            synth.playAmbientNote(finalFreq, "triangle", 6.0);
          }, index * 400); // Staggered arpeggiated strokes
        });
      };

      // Play soft continuous melodies
      intervalId = setInterval(playContinuousAmbient, 7500);
      timeoutId = setTimeout(playContinuousAmbient, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      synth.clearTimeouts();
    };
  }, [muted]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <button
      id="synth-toggle-btn"
      onClick={toggleMute}
      className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all bg-transparent border-none text-purple-600 hover:text-purple-700 active:scale-95 shadow-none"
      title={muted ? "Unmute Ambient Piano" : "Mute Sound"}
    >
      <AnimatePresence mode="wait">
        {muted ? (
          <motion.div
            key="muted"
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <VolumeX className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -45, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
});

export default AmbientSound;
