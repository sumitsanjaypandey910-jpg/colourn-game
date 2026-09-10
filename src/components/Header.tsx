import React from 'react';
import { Volume2, VolumeX, Download, Printer, Sparkles, BookOpen, Music, Music2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  onCelebrate: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOpenPageSelector: () => void;
  currentPageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  musicPlaying,
  onToggleMusic,
  musicVolume,
  onMusicVolumeChange,
  onCelebrate,
  onDownload,
  onPrint,
  onOpenPageSelector,
  currentPageTitle,
}) => {
  return (
    <header id="app-header" className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm border-2 border-amber-200">
      {/* Brand & Page Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-sky-400 flex items-center justify-center shadow-sm text-white text-xl sm:text-2xl select-none">
          🎨
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-amber-950 tracking-tight leading-none flex items-center gap-1.5">
            Kids Coloring Book
          </h1>
          <p className="text-xs font-semibold text-amber-800/80 mt-0.5">
            Coloring: <span className="font-extrabold text-amber-900 underline decoration-amber-300">{currentPageTitle}</span>
          </p>
        </div>
      </div>

      {/* Primary Action & Audio Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Switch Page / Choose Picture */}
        <button
          id="btn-choose-picture"
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenPageSelector();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs sm:text-sm font-bold border border-amber-300 shadow-xs transition-transform active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Change Page</span>
        </button>

        {/* Celebrate / Tada! */}
        <button
          id="btn-celebrate"
          type="button"
          onClick={onCelebrate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-xs sm:text-sm font-black shadow-sm transition-transform hover:scale-105 active:scale-95 animate-pulse"
          title="Tada! Confetti Celebration!"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>Tada! 🎉</span>
        </button>

        {/* Download Artwork */}
        <button
          id="btn-download-artwork"
          type="button"
          onClick={() => {
            sounds.playFanfare();
            onDownload();
          }}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs sm:text-sm font-bold border border-emerald-300 transition-colors flex items-center gap-1"
          title="Save your picture"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Print Artwork */}
        <button
          id="btn-print-artwork"
          type="button"
          onClick={onPrint}
          className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 transition-colors"
          title="Print picture"
        >
          <Printer className="w-4 h-4 text-sky-700" />
        </button>

        {/* Background Music & Volume Controller */}
        <div 
          id="bg-music-controls-group"
          className="flex items-center gap-1.5 bg-amber-50/90 border border-amber-300 rounded-xl px-2 py-1 shadow-2xs"
        >
          {/* Music Play/Pause Toggle */}
          <button
            id="btn-toggle-bg-music"
            type="button"
            onClick={onToggleMusic}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
              musicPlaying
                ? 'bg-amber-400 text-amber-950 shadow-xs border border-amber-500 animate-pulse'
                : 'bg-white hover:bg-amber-100 text-slate-600 border border-amber-200'
            }`}
            title={musicPlaying ? 'Pause Background Music' : 'Play Fun Background Music'}
          >
            {musicPlaying ? (
              <Music2 className="w-4 h-4 text-amber-900" />
            ) : (
              <Music className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden md:inline">Music</span>
            <span className="text-[10px] uppercase tracking-wider">{musicPlaying ? 'ON' : 'OFF'}</span>
          </button>

          {/* Background Music Volume Slider */}
          <div className="flex items-center gap-1.5 pl-1">
            <input
              id="bg-music-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
              aria-label="Background music volume"
              title={`Music Volume: ${Math.round(musicVolume * 100)}%`}
              className="w-14 sm:w-20 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] font-bold text-amber-900/80 w-6 text-right tabular-nums">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Sound FX Toggle (Clicks, Pops, Sparkles) */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={onToggleSound}
          className={`flex items-center gap-1 p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
          }`}
          title={soundEnabled ? 'Mute Sound Effects (SFX)' : 'Turn On Sound Effects (SFX)'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-700" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="text-[10px] font-bold hidden sm:inline">SFX</span>
        </button>
      </div>
    </header>
  );
};

