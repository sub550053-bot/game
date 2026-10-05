/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AquaCanvas } from './components/AquaCanvas';
import { HUD } from './components/HUD';
import { TouchController } from './components/TouchController';
import { LevelSelectModal } from './components/LevelSelectModal';
import { VictoryModal } from './components/VictoryModal';
import { EmbedModal } from './components/EmbedModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelCatalog } from './levels/levels';
import { AquaStorage, AquaSaveData } from './utils/storage';
import { soundManager } from './audio/soundManager';
import { LevelData } from './types/game';
import { translations } from './i18n/translations';
import { Waves, Share2, HelpCircle, Compass, RotateCcw } from 'lucide-react';

export default function App() {
  const [saveData, setSaveData] = useState<AquaSaveData>(() => AquaStorage.load());
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(() => Math.min(200, saveData.unlockedLevel || 1));

  // Current Level Data
  const currentLevel: LevelData = useMemo(() => {
    return LevelCatalog.getLevel(currentLevelNumber);
  }, [currentLevelNumber]);

  // Game state
  const [pearlsCollected, setPearlsCollected] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Sound States
  const [soundEnabled, setSoundEnabled] = useState<boolean>(saveData.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(saveData.musicEnabled);

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [victoryState, setVictoryState] = useState<{
    isOpen: boolean;
    pearls: number;
  }>({
    isOpen: false,
    pearls: 0,
  });

  const onRestartTrigger = useRef<(() => void) | null>(null);

  const lang = saveData.language;
  const t = translations[lang];

  // Music initialization
  useEffect(() => {
    if (musicEnabled) {
      soundManager.startBgm();
    }
    return () => {
      soundManager.stopBgm();
    };
  }, [musicEnabled]);

  // When level changes, reset lives and pearls
  useEffect(() => {
    setPearlsCollected(0);
    setLives(3);
    setIsPaused(false);
  }, [currentLevelNumber]);

  // Level Complete Handler
  const handleLevelComplete = (pearls: number) => {
    setIsPaused(true);
    const updated = AquaStorage.saveLevelCompletion(saveData, currentLevelNumber, pearls);
    setSaveData(updated);

    setVictoryState({
      isOpen: true,
      pearls,
    });
  };

  const handleNextLevel = () => {
    setVictoryState(prev => ({ ...prev, isOpen: false }));
    if (currentLevelNumber < 200) {
      setCurrentLevelNumber(prev => prev + 1);
    } else {
      if (onRestartTrigger.current) {
        onRestartTrigger.current();
      }
      setIsPaused(false);
    }
  };

  const handleReplay = () => {
    setVictoryState(prev => ({ ...prev, isOpen: false }));
    setPearlsCollected(0);
    setLives(3);
    setIsPaused(false);
    if (onRestartTrigger.current) {
      onRestartTrigger.current();
    }
  };

  // Sound toggles
  const handleToggleSound = () => {
    const val = soundManager.toggleSound();
    setSoundEnabled(val);
    const updated = { ...saveData, soundEnabled: val };
    setSaveData(updated);
    AquaStorage.save(updated);
  };

  const handleToggleMusic = () => {
    const val = soundManager.toggleMusic();
    setMusicEnabled(val);
    const updated = { ...saveData, musicEnabled: val };
    setSaveData(updated);
    AquaStorage.save(updated);
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'ur' ? 'en' : 'ur';
    const updated = { ...saveData, language: nextLang as 'ur' | 'en' };
    setSaveData(updated);
    AquaStorage.save(updated);
  };

  const handleSelectLevel = (lvl: number) => {
    setCurrentLevelNumber(lvl);
    setIsLevelSelectOpen(false);
  };

  // Mobile D-Pad Press Simulator
  const handleDirectionPress = (dir: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => {
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    const keyName = keyMap[dir];
    const eventType = isPressed ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { key: keyName }));
  };

  return (
    <div
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-['Outfit'] selection:bg-cyan-500 selection:text-slate-950"
    >
      {/* Universal Top Bar: Zone 1 (Wordmark) — Zone 2 (Clean links) — Zone 3 (Primary Action) */}
      <header className="w-full max-w-4xl px-4 py-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
            <Waves className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-['Syne'] font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            {lang === 'ur' ? 'ایکوا باؤنس: سمندری سفر' : 'Aqua Bounce: Odyssey'}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setIsLevelSelectOpen(true)}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.levels}</span>
          </button>
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.howToPlay}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action (Blogger Embed) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title={t.embed}
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'ur' ? 'بلاگر ایمبیڈ' : 'Embed'}</span>
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center p-2 sm:p-4 gap-2">
        {/* HUD Component */}
        <HUD
          level={currentLevel}
          pearlsCollected={pearlsCollected}
          totalPearls={3}
          lives={lives}
          hasKey={false}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          lang={lang}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onToggleLang={handleToggleLang}
          onRestart={handleReplay}
          onOpenLevels={() => setIsLevelSelectOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenEmbed={() => setIsEmbedOpen(true)}
        />

        {/* Aqua Canvas */}
        <AquaCanvas
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onPearlCollected={count => setPearlsCollected(count)}
          isPaused={isPaused}
          lives={lives}
          setLives={setLives}
          onRestartTrigger={onRestartTrigger}
        />

        {/* Mobile Touch Controller (D-Pad) */}
        <TouchController onDirectionPress={handleDirectionPress} />

        {/* Bottom Helper Subtext */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
          <span>{t.tipSwipe}</span>
          <span className="text-cyan-400 font-bold tabular-nums">
            {currentLevelNumber} / 200
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl py-3 px-4 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>Aqua Bounce: Deep Sea Odyssey</span>
          <span className="mx-2">·</span>
          <span>Classic Nokia Underwater Adventure Inspired</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="hover:text-slate-300 transition-colors"
          >
            {t.embed}
          </button>
          <span>·</span>
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="hover:text-slate-300 transition-colors"
          >
            {t.howToPlay}
          </button>
        </div>
      </footer>

      {/* Modals */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        currentLevel={currentLevelNumber}
        unlockedLevel={saveData.unlockedLevel}
        levelStars={saveData.levelStars}
        onSelectLevel={handleSelectLevel}
        lang={lang}
      />

      <VictoryModal
        isOpen={victoryState.isOpen}
        levelNumber={currentLevelNumber}
        pearlsCollected={victoryState.pearls}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
        lang={lang}
      />

      <EmbedModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        lang={lang}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        lang={lang}
      />
    </div>
  );
}
