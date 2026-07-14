import React from 'react';

interface LoaderProps {
  transparentBg?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ transparentBg = false, text = "INITIALIZING SECURE PORTFOLIO..." }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${transparentBg ? 'bg-neutral-900' : 'bg-white'} text-neutral-900 z-[9999] absolute inset-0`}>
      <div className="loader-container relative flex flex-col items-center gap-8">
        <div className="loader">
          <div className="cell d-0" />
          <div className="cell d-1" />
          <div className="cell d-2" />
          <div className="cell d-1" />
          <div className="cell d-2" />
          <div className="cell d-2" />
          <div className="cell d-3" />
          <div className="cell d-3" />
          <div className="cell d-4" />
        </div>
        
        <div className={`text-center font-mono text-xs tracking-[0.25em] ${transparentBg ? 'text-white/80' : 'text-purple-600/80'} uppercase animate-pulse`}>
          {text}
        </div>
      </div>

      <style>{`
        .loader {
          --cell-size: 40px;
          --cell-spacing: 2px;
          --cells: 3;
          --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));
          display: flex;
          flex-wrap: wrap;
          width: var(--total-size);
          height: var(--total-size);
        }

        .cell {
          flex: 0 0 var(--cell-size);
          width: var(--cell-size);
          height: var(--cell-size);
          margin: var(--cell-spacing);
          background-color: transparent;
          box-sizing: border-box;
          border-radius: 6px;
          animation: 1.5s ripple ease infinite;
        }

        .cell.d-1 {
          animation-delay: 100ms;
        }

        .cell.d-2 {
          animation-delay: 200ms;
        }

        .cell.d-3 {
          animation-delay: 300ms;
        }

        .cell.d-4 {
          animation-delay: 400ms;
        }

        .cell:nth-child(1) {
          --cell-color: #818CF8;
        }

        .cell:nth-child(2) {
          --cell-color: #8B5CF6;
        }

        .cell:nth-child(3) {
          --cell-color: #A78BFA;
        }

        .cell:nth-child(4) {
          --cell-color: #C084FC;
        }

        .cell:nth-child(5) {
          --cell-color: #EC4899;
        }

        .cell:nth-child(6) {
          --cell-color: #F43F5E;
        }

        .cell:nth-child(7) {
          --cell-color: #3B82F6;
        }

        .cell:nth-child(8) {
          --cell-color: #06B6D4;
        }

        .cell:nth-child(9) {
          --cell-color: #10B981;
        }

        @keyframes ripple {
          0% {
            background-color: transparent;
            transform: scale(0.9);
            box-shadow: none;
          }

          30% {
            background-color: var(--cell-color);
            transform: scale(1.05);
            box-shadow: 0 0 15px var(--cell-color);
          }

          60% {
            background-color: transparent;
            transform: scale(0.9);
            box-shadow: none;
          }

          100% {
            background-color: transparent;
            transform: scale(0.9);
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
