import React from 'react';
import { STICKER_ITEMS, StickerItem } from '../data/stickers';
import { sounds } from '../utils/audio';
import { Sparkles, X } from 'lucide-react';

interface StickerPickerProps {
  selectedSticker: StickerItem | null;
  onSelectSticker: (sticker: StickerItem | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  selectedSticker,
  onSelectSticker,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="sticker-picker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="sticker-picker-card"
        className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-w-lg w-full shadow-2xl border-3 sm:border-4 border-amber-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 sm:pb-3 border-b-2 border-amber-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 rounded-xl text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 leading-tight">Choose a Sticker!</h3>
              <p className="text-[11px] sm:text-xs text-amber-800/80 leading-tight">Tap any sticker, then tap your picture to stamp it!</p>
            </div>
          </div>
          <button
            id="close-sticker-picker-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y py-2 pr-1 grid grid-cols-4 gap-2 sm:gap-3"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {STICKER_ITEMS.map((st) => {
            const isSelected = selectedSticker?.id === st.id;
            return (
              <button
                key={st.id}
                id={`sticker-btn-${st.id}`}
                type="button"
                onClick={() => {
                  sounds.playSparkle();
                  onSelectSticker(st);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-150 group cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md scale-105 ring-2 ring-amber-400'
                    : 'border-slate-100 bg-slate-50 hover:bg-amber-50/60 hover:border-amber-200'
                }`}
              >
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                  {st.emoji}
                </span>
                <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-full">
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-amber-100 flex justify-end shrink-0">
          <button
            id="dismiss-sticker-picker-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs transition-transform active:scale-95"
          >
            Ready to Stamp!
          </button>
        </div>
      </div>
    </div>
  );
};
