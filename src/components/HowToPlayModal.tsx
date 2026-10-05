import React from 'react';
import { X, Waves, Sparkles, Key, Compass, ShieldAlert } from 'lucide-react';
import { translations } from '../i18n/translations';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ur' | 'en';
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">
              {t.howToPlay}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 py-4 text-xs text-slate-300">
          {/* Controls */}
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-start gap-3">
            <span className="text-2xl">🕹️</span>
            <div>
              <div className="font-bold text-slate-100 text-sm mb-0.5">
                {lang === 'ur' ? 'تیرنے کے آسان کنٹرولز' : 'Fluid Swimming Controls'}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {lang === 'ur'
                  ? 'موبائل پر اسکرین پر ٹچ کریں یا آن اسکرین تیر کے بٹن دبائیں۔ کمپیوٹر پر ماؤس سے ڈریگ کریں یا Arrow Keys / WASD دبائیں۔'
                  : 'On mobile, tap/drag anywhere or use the on-screen D-Pad. On PC, use Arrow Keys / WASD or drag your mouse.'}
              </p>
            </div>
          </div>

          {/* Fishes / Hazards */}
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex flex-col gap-2">
            <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'ur' ? 'سمندری مچھلیوں سے بچیں!' : 'Beware of Marine Predators!'}</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <b>🐡 {lang === 'ur' ? 'پفر فش (Pufferfish):' : 'Pufferfish:'}</b>{' '}
                {lang === 'ur'
                  ? 'پھول کر تیز کانٹے نکالتی ہے، جب وہ پھولی ہو تو اس سے دور رہیں!'
                  : 'Puffs up periodically extending razor spikes. Swim past only when unpuffed!'}
              </li>
              <li>
                <b>🪼 {lang === 'ur' ? 'جیلی فش (Jellyfish):' : 'Jellyfish:'}</b>{' '}
                {lang === 'ur'
                  ? 'اوپر نیچے تیرتی ہے، اس کے ڈنک سے بچ کر راستہ بنائیں۔'
                  : 'Bobs vertically with stinging tendrils. Time your glide carefully.'}
              </li>
              <li>
                <b>🦈 {lang === 'ur' ? 'باراکوڈا (Barracuda):' : 'Barracuda:'}</b>{' '}
                {lang === 'ur'
                  ? 'تیز رفتار سے راستوں میں چکر لگاتی ہے، دھیان سے پار کریں۔'
                  : 'Fast predatory hunter patrolling long underwater channels.'}
              </li>
            </ul>
          </div>

          {/* Goals */}
          <div className="p-3 bg-cyan-950/30 rounded-2xl border border-cyan-500/30 text-[11px] text-cyan-300 space-y-1">
            <div>⚪ <b>{lang === 'ur' ? 'چمکتے موتی:' : 'Ocean Pearls:'}</b> {lang === 'ur' ? 'ہر لیول میں 3 موتی تلاش کریں۔' : 'Collect 3 hidden pearls for 3 stars.'}</div>
            <div>🗝️ <b>{lang === 'ur' ? 'سنہری چابی:' : 'Sunken Keys:'}</b> {lang === 'ur' ? 'بند مرجانی دروازے کھولنے کے لیے چابی حاصل کریں۔' : 'Pick up glowing keys to open coral gates.'}</div>
            <div>🌀 <b>{lang === 'ur' ? 'ایگزٹ شرائن:' : 'Exit Shrine:'}</b> {lang === 'ur' ? 'گیند کو چمکتے ہوئے بھنور تک پہنچائیں تاکہ اگلا لیول شروع ہو!' : 'Reach the glowing vortex to dive to the next depth!'}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors border border-slate-700"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
