import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { translations } from '../i18n/translations';

interface VictoryModalProps {
  isOpen: boolean;
  levelNumber: number;
  pearlsCollected: number;
  onNextLevel: () => void;
  onReplay: () => void;
  lang: 'ur' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  levelNumber,
  pearlsCollected,
  onNextLevel,
  onReplay,
  lang,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#fbbf24', '#e0f2fe', '#c084fc'],
        });
      } catch {
        // safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Ambient Oceanic Halo */}
        <div className="absolute -top-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 mb-3">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-black text-slate-100">
          {t.levelComplete}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ur'
            ? `مرحلہ ${levelNumber} کامیابی سے مکمل ہو گیا!`
            : `Depth ${levelNumber} conquered successfully!`}
        </p>

        {/* 3 Pearls / Stars Display */}
        <div className="flex items-center justify-center gap-2.5 my-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="transform transition-transform">
              <Star
                className={`w-8 h-8 ${
                  s <= pearlsCollected
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]'
                    : 'text-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Pearls Count */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-around my-3 text-xs">
          <span className="text-slate-400">{t.pearlsCollected}:</span>
          <span className="text-base font-black text-cyan-400">
            {pearlsCollected} / 3 ⚪
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full mt-2">
          <button
            onClick={onReplay}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>{t.tryAgain}</span>
          </button>

          <button
            onClick={onNextLevel}
            className="flex-[1.3] py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>{t.nextLevel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
