import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import { translations } from '../i18n/translations';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ur' | 'en';
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'responsive' | 'fixed'>('responsive');

  if (!isOpen) return null;
  const t = translations[lang];

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com';

  const embedCode = aspectRatio === 'responsive'
    ? `<!-- Aqua Bounce: Deep Sea Odyssey Responsive Embed -->
<div style="position: relative; width: 100%; max-width: 800px; aspect-ratio: 7/5.5; margin: 0 auto; overflow: hidden; border-radius: 20px; box-shadow: 0 14px 40px rgba(0,0,0,0.6); background-color: #010c1c;">
  <iframe 
    src="${currentUrl}" 
    title="Aqua Bounce: Deep Sea Odyssey" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
    allow="autoplay; fullscreen"
    loading="lazy">
  </iframe>
</div>`
    : `<!-- Aqua Bounce: Deep Sea Odyssey Fixed Embed -->
<iframe 
  src="${currentUrl}" 
  width="700" 
  height="550" 
  title="Aqua Bounce: Deep Sea Odyssey" 
  style="border: none; border-radius: 20px; box-shadow: 0 14px 40px rgba(0,0,0,0.6);" 
  allow="autoplay; fullscreen"
  loading="lazy">
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {t.embed}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur' ? 'بلاگر یا کسی بھی ویب سائٹ پر گیم ایمبیڈ کریں' : 'Embed Aqua Bounce on Blogger, WordPress, or custom sites'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between my-4 text-xs">
          <span className="text-slate-300 font-medium">
            {lang === 'ur' ? 'ڈیزائن کا انتخاب:' : 'Embed Mode:'}
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setAspectRatio('responsive')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                aspectRatio === 'responsive'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ur' ? 'ریسپانسیو (موبائل + ڈیسک ٹاپ)' : 'Responsive'}
            </button>
            <button
              onClick={() => setAspectRatio('fixed')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                aspectRatio === 'fixed'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ur' ? 'مخصوص سائز (700x550)' : 'Fixed (700x550)'}
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-36 leading-relaxed">
          <pre>{embedCode}</pre>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="mt-4 w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t.copied : t.copyEmbedCode}</span>
        </button>

        {/* Blogger instructions */}
        <div className="mt-4 p-3 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
          <div className="font-semibold text-slate-300 mb-1">
            {lang === 'ur' ? 'بلاگر (Blogger) پر لگانے کا طریقہ:' : 'Blogger Embedding Guide:'}
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            {lang === 'ur' ? (
              <>
                <li>بلاگر ڈیش بورڈ میں جا کر نیا پوسٹ کھولیں۔</li>
                <li>اوپر پنسل آئیکن سے <b>HTML View</b> منتخب کریں۔</li>
                <li>کاپی شدہ کوڈ چسپاں (Paste) کریں اور Publish کر دیں!</li>
              </>
            ) : (
              <>
                <li>In your Blogger dashboard, create or edit a Post.</li>
                <li>Switch editor mode to <b>HTML View</b>.</li>
                <li>Paste the copied iframe snippet and Publish your post!</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};
