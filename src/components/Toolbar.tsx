import React from 'react';
import { ToolType, BrushSize } from '../types';
import { sounds } from '../utils/audio';
import { 
  Paintbrush, 
  Sparkles, 
  Smile, 
  Eraser, 
  Rainbow 
} from 'lucide-react';
import { StickerItem } from '../data/stickers';

interface ToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  brushSize: BrushSize;
  setBrushSize: (size: BrushSize) => void;
  onOpenStickerPicker: () => void;
  selectedSticker: StickerItem | null;
  onOpenPageSelector?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onClear?: () => void;
}

const BRUSH_SIZES: { size: BrushSize; label: string; dot: number }[] = [
  { size: 6, label: 'Fine', dot: 6 },
  { size: 14, label: 'Medium', dot: 10 },
  { size: 26, label: 'Chunky', dot: 15 },
  { size: 44, label: 'Jumbo', dot: 20 },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  onOpenStickerPicker,
  selectedSticker,
  onOpenPageSelector,
}) => {
  return (
    <div
      id="main-toolbar"
      className="w-12 sm:w-14 md:w-16 h-full flex flex-col justify-between items-center py-1.5 sm:py-2 px-1 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-amber-200 shadow-sm shrink-0 select-none overflow-hidden"
    >
      {/* Primary Drawing Tool Buttons */}
      <div id="drawing-tools-group" className="flex flex-col items-center gap-1.5 w-full">
        {/* Big Change Page / Designs Trigger */}
        {onOpenPageSelector && (
          <button
            id="toolbar-open-pages-btn"
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenPageSelector();
            }}
            className="w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-amber-950 border-2 border-amber-600 shadow-xs hover:scale-105 active:scale-95 transition-all font-black mb-0.5"
            title="Choose more coloring pages"
          >
            <span className="text-sm leading-none">📖</span>
            <span className="text-[8px] sm:text-[9px] font-black leading-none mt-0.5">Pages</span>
          </button>
        )}

        {/* Crayon Brush */}
        <button
          id="tool-brush-btn"
          type="button"
          onClick={() => {
            sounds.playPop();
            setActiveTool('brush');
          }}
          className={`w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTool === 'brush'
              ? 'bg-amber-400 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Crayon Marker (Draw and color freely)"
        >
          <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
          <span className="text-[9px] font-black leading-none mt-0.5 hidden sm:inline">Crayon</span>
        </button>

        {/* Rainbow Brush */}
        <button
          id="tool-rainbow-btn"
          type="button"
          onClick={() => {
            sounds.playSparkle();
            setActiveTool('rainbow');
          }}
          className={`w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTool === 'rainbow'
              ? 'bg-gradient-to-tr from-pink-400 via-amber-300 to-sky-400 text-slate-900 shadow-inner scale-105 border-2 border-amber-500 font-extrabold'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Rainbow Brush (Draw with rainbow strokes)"
        >
          <Rainbow className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          <span className="text-[9px] font-black leading-none mt-0.5 hidden sm:inline">Rainbow</span>
        </button>

        {/* Sparkle Brush */}
        <button
          id="tool-sparkle-btn"
          type="button"
          onClick={() => {
            sounds.playSparkle();
            setActiveTool('sparkle');
          }}
          className={`w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTool === 'sparkle'
              ? 'bg-amber-300 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Sparkle Magic Trail"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          <span className="text-[9px] font-black leading-none mt-0.5 hidden sm:inline">Sparkle</span>
        </button>

        {/* Sticker Stamp */}
        <button
          id="tool-sticker-btn"
          type="button"
          onClick={() => {
            if (activeTool === 'sticker') {
              onOpenStickerPicker();
            } else {
              sounds.playPop();
              setActiveTool('sticker');
            }
          }}
          className={`w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTool === 'sticker'
              ? 'bg-amber-400 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Stamp fun stickers (Tap again to choose sticker)"
        >
          {selectedSticker ? (
            <span className="text-base sm:text-lg leading-none">{selectedSticker.emoji}</span>
          ) : (
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
          )}
          <span className="text-[9px] font-black leading-none mt-0.5 hidden sm:inline">Sticker</span>
        </button>

        {/* Eraser */}
        <button
          id="tool-eraser-btn"
          type="button"
          onClick={() => {
            sounds.playSwoosh();
            setActiveTool('eraser');
          }}
          className={`w-full aspect-square max-w-[42px] max-h-[42px] rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTool === 'eraser'
              ? 'bg-rose-400 text-white shadow-inner scale-105 border-2 border-rose-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Eraser (Clean up crayon strokes)"
        >
          <Eraser className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          <span className="text-[9px] font-black leading-none mt-0.5 hidden sm:inline">Eraser</span>
        </button>
      </div>

      {/* Brush Size Picker */}
      <div id="brush-size-group" className="w-full flex flex-col items-center pt-1.5 border-t border-amber-200/90 gap-1">
        <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider leading-none">
          Size
        </span>
        <div className="flex flex-col items-center gap-1 w-full">
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.size}
              id={`brush-size-${b.size}`}
              type="button"
              onClick={() => {
                sounds.playPop();
                setBrushSize(b.size);
              }}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all ${
                brushSize === b.size
                  ? 'bg-amber-400 text-amber-950 font-bold scale-110 shadow-2xs border border-amber-500'
                  : 'hover:bg-amber-100 text-amber-800'
              }`}
              title={`${b.label} brush size`}
            >
              <div 
                className="rounded-full bg-amber-950" 
                style={{ width: `${b.dot}px`, height: `${b.dot}px` }} 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
