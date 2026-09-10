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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="sticker-picker-card"
        className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border-4 border-amber-300 transform scale-100 transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 rounded-2xl text-amber-600">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl font-black text-amber-950">Choose a Fun Sticker!</h3>
              <p className="text-xs text-amber-800/80">Tap any sticker, then tap your picture to place it!</p>
            </div>
          </div>
          <button
            id="close-sticker-picker-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 py-4 max-h-[60vh] overflow-y-auto">
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
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-150 group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md scale-105'
                    : 'border-slate-100 bg-slate-50 hover:bg-amber-50/60 hover:border-amber-200 hover:scale-105'
                }`}
              >
                <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform">
                  {st.emoji}
                </span>
                <span className="text-[11px] font-bold text-slate-700 mt-1 truncate max-w-full">
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            id="dismiss-sticker-picker-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm transition-transform active:scale-95"
          >
            Ready to Stamp!
          </button>
        </div>
      </div>
    </div>
  );
};
