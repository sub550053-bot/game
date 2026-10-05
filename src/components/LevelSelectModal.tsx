import React, { useState } from 'react';
import { X, Lock, Star, Compass, ChevronRight } from 'lucide-react';
import { LevelCatalog, OCEAN_ZONES } from '../levels/levels';
import { translations } from '../i18n/translations';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (lvl: number) => void;
  lang: 'ur' | 'en';
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  lang,
}) => {
  const initialZone = Math.floor((currentLevel - 1) / 40) + 1;
  const [selectedZoneId, setSelectedZoneId] = useState<number>(initialZone);

  if (!isOpen) return null;
  const t = translations[lang];

  const currentZone = OCEAN_ZONES.find(z => z.id === selectedZoneId) || OCEAN_ZONES[0];
  const zoneLevels = Array.from(
    { length: currentZone.endLevel - currentZone.startLevel + 1 },
    (_, i) => currentZone.startLevel + i
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>{t.levels}</span>
              <span className="text-xs text-cyan-400 font-mono font-bold px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                200
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur'
                ? '5 سمندری زونز میں 200 گہرے مراحل دریافت کریں'
                : 'Explore 200 depth stages across 5 ocean oceanic zones'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Ocean Zone Tabs */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto border-b border-slate-800/80 scrollbar-none">
          {OCEAN_ZONES.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Z{zone.id}:</span>
                <span>{lang === 'ur' ? zone.nameUrdu : zone.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({zone.startLevel}-{zone.endLevel})</span>
              </button>
            );
          })}
        </div>

        {/* Zone Info Bar */}
        <div className="flex items-center justify-between py-2 text-xs text-slate-400">
          <span>{lang === 'ur' ? currentZone.nameUrdu : currentZone.name}</span>
          <span className="font-mono text-cyan-400">
            {lang === 'ur' ? currentZone.depthRangeUrdu : currentZone.depthRange}
          </span>
        </div>

        {/* 40 Levels in Current Zone */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
            {zoneLevels.map((lvl) => {
              const isUnlocked = lvl <= unlockedLevel;
              const isCurrent = lvl === currentLevel;
              const stars = levelStars[lvl] || 0;

              return (
                <button
                  key={lvl}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectLevel(lvl);
                      onClose();
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    !isUnlocked
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-30 cursor-not-allowed text-slate-600'
                      : isCurrent
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-md ring-2 ring-cyan-500/20'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <span className="text-sm font-black tabular-nums">
                    {lvl}
                  </span>

                  <div className="flex items-center gap-0.5 mt-0.5">
                    {!isUnlocked ? (
                      <Lock className="w-2.5 h-2.5 text-slate-500" />
                    ) : (
                      <>
                        <Star className={`w-2 h-2 ${stars >= 1 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        <Star className={`w-2 h-2 ${stars >= 2 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        <Star className={`w-2 h-2 ${stars >= 3 ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
