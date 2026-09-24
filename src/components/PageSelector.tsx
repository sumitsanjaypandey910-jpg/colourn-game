import React from 'react';
import { COLORING_PAGES } from '../data/coloringPages';
import { ColoringPage } from '../types';
import { sounds } from '../utils/audio';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PageSelectorProps {
  currentPageId: string;
  onSelectPage: (page: ColoringPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  currentPageId,
  onSelectPage,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="page-selector-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="page-selector-card"
        className="bg-amber-50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-3xl w-full shadow-2xl border-3 sm:border-4 border-amber-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header - Saves vertical space on landscape phones */}
        <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b-2 border-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-xl text-white text-base sm:text-lg flex items-center justify-center shadow-2xs shrink-0">
              🎨
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
                  Choose a Coloring Page!
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/90 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300">
                  {COLORING_PAGES.length} Designs
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-amber-800 leading-tight">
                Pick any picture to start coloring with crayons and stickers!
              </p>
            </div>
          </div>
          <button
            id="close-page-selector-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-950 flex items-center justify-center transition-colors shadow-2xs shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Grid of Pages: flex-1 min-h-0 with touch-pan-y and smooth scrolling */}
        <div
          id="page-selector-scroll-list"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y py-2 pr-1 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 gap-2.5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {COLORING_PAGES.map((page) => {
            const isCurrent = page.id === currentPageId;
            return (
              <button
                key={page.id}
                id={`select-page-${page.id}`}
                type="button"
                onClick={() => {
                  sounds.playFanfare();
                  onSelectPage(page);
                  onClose();
                }}
                className={`group w-full text-left p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-150 flex items-center gap-2.5 sm:gap-3 bg-white relative shrink-0 min-h-[68px] sm:min-h-[76px] cursor-pointer active:scale-[0.98] ${
                  isCurrent
                    ? 'border-amber-500 ring-2 sm:ring-3 ring-amber-400/50 shadow-md bg-amber-50/70'
                    : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-xs'
                }`}
              >
                {/* Large Thumbnail Emoji/Icon */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/70 flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-amber-200">
                  {page.thumbnailSvg}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-black text-slate-900 text-xs sm:text-sm leading-tight group-hover:text-amber-800 truncate">
                      {page.title}
                    </h3>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200/70">
                      {page.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold line-clamp-1 mt-0.5">
                    {page.description}
                  </p>
                </div>

                {/* Status Indicator Button */}
                <div className="shrink-0 flex items-center">
                  {isCurrent ? (
                    <span className="px-2 sm:px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 font-black text-[11px] sm:text-xs flex items-center gap-1 border border-amber-500 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span className="hidden sm:inline">Playing</span>
                    </span>
                  ) : (
                    <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-amber-100 group-hover:bg-amber-400 text-amber-900 group-hover:text-amber-950 font-black text-[11px] sm:text-xs border border-amber-300 transition-colors flex items-center gap-1">
                      <span>Color</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Footer */}
        <div className="pt-2 sm:pt-2.5 border-t-2 border-amber-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-amber-800/80 truncate pr-2 hidden sm:inline">
            ✨ All pages start colourless for unlimited creativity!
          </span>
          <button
            id="done-page-selector-btn"
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs transition-transform active:scale-95"
          >
            Keep Coloring
          </button>
        </div>
      </div>
    </div>
  );
};
