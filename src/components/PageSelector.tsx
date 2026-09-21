import React from 'react';
import { COLORING_PAGES } from '../data/coloringPages';
import { ColoringPage } from '../types';
import { sounds } from '../utils/audio';
import { X, Sparkles } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="page-selector-card"
        className="bg-amber-50/95 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl border-4 border-amber-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-200 rounded-2xl text-amber-900 text-xl">
              🎨
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                Choose a Coloring Page!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-800">
                Pick your favorite adventure! All pages start colourless for unlimited creative coloring.
              </p>
            </div>
          </div>
          <button
            id="close-page-selector-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grid of Pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4 overflow-y-auto pr-1">
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
                className={`group text-left p-4 rounded-2xl border-3 transition-all duration-200 flex flex-col justify-between bg-white relative overflow-hidden ${
                  isCurrent
                    ? 'border-amber-500 ring-4 ring-amber-400/40 shadow-lg scale-102'
                    : 'border-amber-200 hover:border-amber-400 hover:shadow-md hover:scale-102'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" /> Now Playing
                  </span>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {page.thumbnailSvg}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-amber-700">
                      {page.title}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      {page.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1">
                  {page.description}
                </p>

                <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Start Coloring</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t-2 border-amber-200 flex justify-end">
          <button
            id="done-page-selector-btn"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm transition-transform active:scale-95"
          >
            Keep Coloring
          </button>
        </div>
      </div>
    </div>
  );
};
