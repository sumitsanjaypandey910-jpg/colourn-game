import React from 'react';
import { ColorOption } from '../types';
import { sounds } from '../utils/audio';

export const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Strawberry Red', value: '#EF4444' },
  { name: 'Tangerine Orange', value: '#F97316' },
  { name: 'Sunshine Yellow', value: '#FBBF24' },
  { name: 'Lime Zest', value: '#84CC16' },
  { name: 'Jungle Green', value: '#10B981' },
  { name: 'Aqua Mint', value: '#06B6D4' },
  { name: 'Sky Blue', value: '#38BDF8' },
  { name: 'Ocean Blue', value: '#2563EB' },
  { name: 'Grape Purple', value: '#8B5CF6' },
  { name: 'Sweet Lilac', value: '#C084FC' },
  { name: 'Bubblegum Pink', value: '#EC4899' },
  { name: 'Fairy Peach', value: '#FDA4AF' },
  { name: 'Chocolate Brown', value: '#854D0E' },
  { name: 'Elephant Gray', value: '#94A3B8' },
  { name: 'Night Owl Black', value: '#1E293B' },
  { name: 'Fluffy White', value: '#FFFFFF', border: '#CBD5E1' },
];

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  const activeColorObj = COLOR_OPTIONS.find(
    (c) => c.value.toLowerCase() === selectedColor.toLowerCase()
  ) || {
    name: 'Custom Magic',
    value: selectedColor,
  };

  return (
    <div
      id="color-palette-dock"
      className="w-18 sm:w-22 md:w-24 h-full flex flex-col justify-between bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border-2 border-amber-200 shadow-sm shrink-0 select-none overflow-hidden"
    >
      {/* Active Crayon Swatch Banner */}
      <div className="flex flex-col items-center justify-center pb-1 border-b border-amber-200/90 shrink-0">
        <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider leading-none mb-1">
          Color
        </span>
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-black/20 shadow-xs inline-block"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-[10px] sm:text-xs font-black text-amber-950 truncate max-w-[45px] sm:max-w-[55px]">
            {activeColorObj.name.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* 2-Column Grid of All 16 Colors (NO SCROLLING - always 100% visible on screen) */}
      <div
        id="color-crayons-grid"
        className="grid grid-cols-2 gap-1 sm:gap-1.5 flex-1 min-h-0 py-1 items-center justify-items-center overflow-hidden"
      >
        {COLOR_OPTIONS.map((c, index) => {
          const isSelected = selectedColor.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              key={c.value}
              id={`color-btn-${index}`}
              type="button"
              aria-label={`Select ${c.name}`}
              onClick={() => {
                sounds.playColorPick(index);
                onSelectColor(c.value);
              }}
              className={`relative flex items-center justify-center w-6.5 h-6.5 sm:w-8 sm:h-8 md:w-8.5 md:h-8.5 rounded-full transition-transform active:scale-90 focus:outline-none ${
                isSelected
                  ? 'scale-115 ring-2 sm:ring-3 ring-amber-500 ring-offset-1 sm:ring-offset-2 z-10 shadow-md'
                  : 'hover:scale-105 shadow-2xs'
              }`}
              style={{
                backgroundColor: c.value,
                border: c.border ? `2px solid ${c.border}` : '1.5px solid rgba(0,0,0,0.18)',
              }}
              title={c.name}
            >
              {/* Inner highlight ring */}
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-black/10 via-transparent to-white/40 pointer-events-none" />

              {/* Sparkle badge on selected color */}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1 text-[10px] select-none pointer-events-none animate-bounce">
                  ✨
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="pt-0.5 border-t border-amber-200/90 text-center shrink-0">
        <span className="text-[9px] font-black text-amber-700/80 leading-none">
          16 Colors
        </span>
      </div>
    </div>
  );
};
