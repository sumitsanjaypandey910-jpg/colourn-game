import React from 'react';
import { ToolType, BrushSize } from '../types';
import { sounds } from '../utils/audio';
import { 
  Paintbrush, 
  Sparkles, 
  Smile, 
  Eraser, 
  Undo2, 
  Redo2, 
  RotateCcw,
  Rainbow
} from 'lucide-react';
import { StickerItem } from '../data/stickers';

interface ToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  brushSize: BrushSize;
  setBrushSize: (size: BrushSize) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onOpenStickerPicker: () => void;
  selectedSticker: StickerItem | null;
}

const BRUSH_SIZES: { size: BrushSize; label: string; dot: number }[] = [
  { size: 6, label: 'Thin', dot: 8 },
  { size: 14, label: 'Medium', dot: 14 },
  { size: 26, label: 'Chunky', dot: 22 },
  { size: 44, label: 'Jumbo', dot: 30 },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onOpenStickerPicker,
  selectedSticker,
}) => {
  return (
    <div id="main-toolbar" className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-md border-2 border-amber-200">
      {/* Primary Drawing Tools */}
      <div id="drawing-tools-group" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* Crayon Brush */}
        <button
          id="tool-brush-btn"
          type="button"
          onClick={() => {
            sounds.playPop();
            setActiveTool('brush');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTool === 'brush'
              ? 'bg-amber-400 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Crayon Marker (Freehand drawing)"
        >
          <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
          <span>Crayon</span>
        </button>

        {/* Rainbow Brush */}
        <button
          id="tool-rainbow-btn"
          type="button"
          onClick={() => {
            sounds.playSparkle();
            setActiveTool('rainbow');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTool === 'rainbow'
              ? 'bg-gradient-to-r from-pink-400 via-amber-300 to-sky-400 text-slate-900 shadow-inner scale-105 border-2 border-amber-500 font-extrabold'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Rainbow Brush (Draws in rainbow colors!)"
        >
          <Rainbow className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          <span>Rainbow</span>
        </button>

        {/* Sparkle Brush */}
        <button
          id="tool-sparkle-btn"
          type="button"
          onClick={() => {
            sounds.playSparkle();
            setActiveTool('sparkle');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTool === 'sparkle'
              ? 'bg-amber-300 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Sparkle Trail (Draw with fairy dust!)"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          <span>Sparkles</span>
        </button>

        {/* Sticker Stamp */}
        <button
          id="tool-sticker-btn"
          type="button"
          onClick={() => {
            onOpenStickerPicker();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTool === 'sticker'
              ? 'bg-amber-400 text-amber-950 shadow-inner scale-105 border-2 border-amber-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Stickers (Stamp cute emojis and stickers!)"
        >
          {selectedSticker ? (
            <span className="text-base sm:text-lg leading-none">{selectedSticker.emoji}</span>
          ) : (
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
          )}
          <span>Stickers</span>
        </button>

        {/* Eraser */}
        <button
          id="tool-eraser-btn"
          type="button"
          onClick={() => {
            sounds.playSwoosh();
            setActiveTool('eraser');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTool === 'eraser'
              ? 'bg-rose-400 text-white shadow-inner scale-105 border-2 border-rose-500'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
          title="Eraser (Erase drawing marks)"
        >
          <Eraser className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          <span>Eraser</span>
        </button>
      </div>

      {/* Brush Size & Canvas Action Controls */}
      <div id="size-actions-group" className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Brush Size Picker (only when using brushes or eraser) */}
        {activeTool !== 'sticker' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 mr-1 hidden sm:inline">Size:</span>
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.size}
                id={`brush-size-${b.size}`}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setBrushSize(b.size);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                  brushSize === b.size
                    ? 'bg-amber-400 text-amber-950 font-bold scale-110 shadow-xs'
                    : 'hover:bg-amber-200/60 text-slate-600'
                }`}
                title={`${b.label} Size`}
              >
                <div 
                  className="rounded-full bg-current" 
                  style={{ width: `${b.dot}px`, height: `${b.dot}px` }} 
                />
              </button>
            ))}
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            id="btn-undo"
            type="button"
            disabled={!canUndo}
            onClick={() => {
              sounds.playSwoosh();
              onUndo();
            }}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:pointer-events-none text-amber-900 border border-amber-200 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            id="btn-redo"
            type="button"
            disabled={!canRedo}
            onClick={() => {
              sounds.playPop();
              onRedo();
            }}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:pointer-events-none text-amber-900 border border-amber-200 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Clear Canvas */}
        <button
          id="btn-clear-canvas"
          type="button"
          onClick={() => {
            sounds.playSwoosh();
            onClear();
          }}
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-rose-100 hover:text-rose-700 text-amber-900 border border-amber-200 text-xs sm:text-sm font-bold transition-colors"
          title="Clear all drawings and restart page"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
