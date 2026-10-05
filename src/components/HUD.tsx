import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  Share2,
  HelpCircle,
  Layers,
  Heart,
  Key,
} from 'lucide-react';
import { LevelData } from '../types/game';
import { translations } from '../i18n/translations';

interface HUDProps {
  level: LevelData;
  pearlsCollected: number;
  totalPearls: number;
  lives: number;
  hasKey: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  lang: 'ur' | 'en';
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleLang: () => void;
  onRestart: () => void;
  onOpenLevels: () => void;
  onOpenHowToPlay: () => void;
  onOpenEmbed: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  level,
  pearlsCollected,
  totalPearls,
  lives,
  hasKey,
  soundEnabled,
  musicEnabled,
  lang,
  onToggleSound,
  onToggleMusic,
  onToggleLang,
  onRestart,
  onOpenLevels,
  onOpenHowToPlay,
  onOpenEmbed,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800">
        {/* Left: Level selector button & Name */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLevels}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-xl transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>#{level.id}</span>
          </button>

          <div className="hidden sm:block text-xs font-semibold text-slate-200">
            {lang === 'ur' ? level.nameUrdu : level.name}
          </div>
        </div>

        {/* Center: Depth Indicator */}
        <div className="px-3 py-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 font-bold">
          {lang === 'ur' ? level.depthNameUrdu : level.depthName}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={onOpenEmbed}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title={t.embed}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title={t.howToPlay}
          >
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </button>

          <button
            onClick={onToggleLang}
            className="px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            {lang === 'ur' ? 'EN' : 'اردو'}
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title={t.sound}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onToggleMusic}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title={t.music}
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-teal-400' : 'text-slate-500'}`} />
          </button>
        </div>
      </header>

      {/* Stats Sub-Bar: Pearls, Lives, Key & Restart */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 text-xs">
        {/* Pearls Count */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">{t.pearls}:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <span
                key={p}
                className={`text-sm ${
                  p <= pearlsCollected
                    ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                    : 'text-slate-700'
                }`}
              >
                ⚪
              </span>
            ))}
          </div>
        </div>

        {/* Lives / Bubbles */}
        <div className="flex items-center gap-1.5 font-bold text-rose-400">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span className="tabular-nums">{lives}</span>
        </div>

        {/* Action: Restart Button */}
        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-3 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors font-medium"
          title={t.restart}
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t.restart}</span>
        </button>
      </div>
    </div>
  );
};
