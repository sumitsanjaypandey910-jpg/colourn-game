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
  const activeColorObj = COLOR_OPTIONS.find(c => c.value.toLowerCase() === selectedColor.toLowerCase()) || {
    name: 'Custom Magic',
    value: selectedColor,
  };

  return (
    <div id="color-palette-container" className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-md border-2 border-amber-200">
      {/* Active Color Name Pill */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
            Current Crayon:
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/15 inline-block"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs sm:text-sm font-black text-amber-950">
              {activeColorObj.name}
            </span>
          </div>
        </div>
      </div>

      {/* Crayon / Paint Pot Grid */}
      <div 
        id="crayons-scroll-row"
        className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 px-1 scrollbar-thin scrollbar-thumb-amber-300"
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
              className={`group relative flex-shrink-0 flex flex-col items-center focus:outline-none transition-all duration-200 ${
                isSelected ? '-translate-y-1.5 scale-110' : 'hover:-translate-y-0.5 hover:scale-105'
              }`}
            >
              {/* Crayon Tip (Triangle) */}
              <div
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 -mb-1 rotate-45 rounded-xs transition-transform"
                style={{
                  backgroundColor: c.value,
                  borderTop: c.border ? `1px solid ${c.border}` : '1px solid rgba(0,0,0,0.15)',
                  borderLeft: c.border ? `1px solid ${c.border}` : '1px solid rgba(0,0,0,0.15)',
                }}
              />
              
              {/* Crayon Body */}
              <div
                className={`w-7 sm:w-8.5 h-11 sm:h-13 rounded-t-sm rounded-b-md shadow-sm flex flex-col justify-between items-center py-1 transition-all ${
                  isSelected
                    ? 'ring-3 ring-amber-500 ring-offset-2 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: c.value,
                  border: c.border ? `2px solid ${c.border}` : '1px solid rgba(0,0,0,0.15)',
                }}
              >
                {/* Decorative Crayon Paper Label Stripe */}
                <div className="w-full h-2.5 bg-black/15 my-auto" />
              </div>

              {/* Selection Star indicator */}
              {isSelected && (
                <span className="absolute -top-2 -right-1 text-xs select-none animate-bounce">
                  ✨
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
