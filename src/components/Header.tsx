import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Download, 
  Sparkles, 
  Music, 
  Music2, 
  Undo2, 
  Redo2, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
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
  onPrint?: () => void;
  onOpenPageSelector: () => void;
  currentPageTitle: string;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  isColourless: boolean;
  strokesCount: number;
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
  onOpenPageSelector,
  currentPageTitle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  isColourless,
  strokesCount,
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  return (
    <header
      id="app-header"
      className="h-12 sm:h-13 w-full bg-white/95 backdrop-blur-sm px-2 sm:px-3 rounded-xl sm:rounded-2xl border-2 border-amber-200 shadow-xs flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 select-none"
    >
      {/* Left: BIG Prominent Choose Design Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          id="btn-choose-picture"
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenPageSelector();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black border-2 border-amber-600 shadow-md transition-transform active:scale-95 hover:scale-102 cursor-pointer"
          title="Pick another colouring design"
        >
          <span className="text-base sm:text-xl shrink-0">🎨</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-900">
              More Designs
            </span>
            <span className="text-xs sm:text-sm font-black truncate max-w-[85px] sm:max-w-[140px] text-amber-950">
              {currentPageTitle}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950 stroke-[3] shrink-0 ml-0.5" />
        </button>
      </div>

      {/* Middle: Kid-friendly status / Objective Pill */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs truncate">
        <span>{isColourless ? '🎯 Objective: Start colourless & color freely!' : `🌟 ${strokesCount} crayon strokes painted!`}</span>
      </div>

      {/* Right: History, Audio, Tada & Save Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Undo */}
        <button
          id="btn-undo"
          type="button"
          disabled={!canUndo}
          onClick={() => {
            sounds.playSwoosh();
            onUndo();
          }}
          className="p-1.5 sm:p-2 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-30 disabled:pointer-events-none text-amber-900 border border-amber-200 transition-colors"
          title="Undo last stroke"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          id="btn-redo"
          type="button"
          disabled={!canRedo}
          onClick={() => {
            sounds.playPop();
            onRedo();
          }}
          className="p-1.5 sm:p-2 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-30 disabled:pointer-events-none text-amber-900 border border-amber-200 transition-colors"
          title="Redo stroke"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Clear/Reset Canvas */}
        <button
          id="btn-clear-canvas"
          type="button"
          onClick={() => {
            sounds.playSwoosh();
            onClear();
          }}
          className="p-1.5 sm:p-2 rounded-xl bg-amber-50 hover:bg-rose-100 text-amber-900 hover:text-rose-700 border border-amber-200 transition-colors"
          title="Reset canvas back to clean colourless picture"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-amber-200 mx-0.5" />

        {/* Music Button with Volume Popover */}
        <div className="relative">
          <button
            id="btn-toggle-bg-music"
            type="button"
            onClick={onToggleMusic}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowVolumePopup(!showVolumePopup);
            }}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
              musicPlaying
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-slate-500 border-amber-200'
            }`}
            title={musicPlaying ? 'Music is ON (Tap to pause)' : 'Music is OFF (Tap to play)'}
          >
            {musicPlaying ? <Music2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
          </button>

          {/* Quick Volume Slider toggle button */}
          <button
            type="button"
            onClick={() => setShowVolumePopup(!showVolumePopup)}
            className="hidden sm:inline-block ml-0.5 text-[9px] font-bold text-amber-800 hover:text-amber-950 px-1 py-0.5 rounded bg-amber-100/60"
            title="Adjust music volume"
          >
            {Math.round(musicVolume * 100)}%
          </button>

          {/* Floating Volume Slider on mobile or when clicked */}
          {showVolumePopup && (
            <div className="absolute right-0 top-12 z-50 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center gap-2 min-w-[160px]">
              <span className="text-xs font-bold text-amber-900">Vol:</span>
              <input
                id="bg-music-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                className="w-24 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <span className="text-[10px] font-bold text-amber-900 tabular-nums">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* SFX Toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={onToggleSound}
          className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
          }`}
          title={soundEnabled ? 'Mute Sound Effects' : 'Turn on Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Tada Celebrate Button */}
        <button
          id="btn-celebrate"
          type="button"
          onClick={onCelebrate}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-xs font-black shadow-xs transition-transform hover:scale-105 active:scale-95"
          title="Tada! Confetti celebration!"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
          <span className="hidden sm:inline">Tada! 🎉</span>
          <span className="sm:hidden">🎉</span>
        </button>

        {/* Save/Download Artwork */}
        <button
          id="btn-download-artwork"
          type="button"
          onClick={() => {
            sounds.playFanfare();
            onDownload();
          }}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-black border border-emerald-300 transition-transform active:scale-95 flex items-center gap-1"
          title="Save your picture as image"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>
    </header>
  );
};
