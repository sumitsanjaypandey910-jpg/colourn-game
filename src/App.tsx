/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COLORING_PAGES } from './data/coloringPages';
import { ColoringPage, ToolType, BrushSize, DrawingStroke, PlacedSticker, CanvasHistoryItem } from './types';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { ColorPalette, COLOR_OPTIONS } from './components/ColorPalette';
import { CanvasArea } from './components/CanvasArea';
import { StickerPicker } from './components/StickerPicker';
import { PageSelector } from './components/PageSelector';
import { StickerItem, STICKER_ITEMS } from './data/stickers';
import { sounds, music } from './utils/audio';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<ColoringPage>(COLORING_PAGES[0]);
  const [activeTool, setActiveTool] = useState<ToolType>('bucket');
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0].value);
  const [brushSize, setBrushSize] = useState<BrushSize>(14);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(STICKER_ITEMS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.45);

  // Modals
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);

  // Canvas State
  const [svgFills, setSvgFills] = useState<Record<string, string>>({});
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);

  // Undo/Redo History
  const [history, setHistory] = useState<CanvasHistoryItem[]>([
    { svgFills: {}, strokes: [], stickers: [] },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // DOM Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Push new state to undo/redo history
  const pushHistory = useCallback((newFills: Record<string, string>, newStrokes: DrawingStroke[], newStickers: PlacedSticker[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const next = [...sliced, { svgFills: newFills, strokes: newStrokes, stickers: newStickers }];
      if (next.length > 30) next.shift(); // keep last 30 actions
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  // Handle SVG fills update
  const handleSvgFillChange = (newFills: Record<string, string>) => {
    setSvgFills(newFills);
    pushHistory(newFills, strokes, stickers);
  };

  // Handle drawing strokes update
  const handleStrokesChange = (newStrokes: DrawingStroke[]) => {
    setStrokes(newStrokes);
    pushHistory(svgFills, newStrokes, stickers);
  };

  // Handle stickers update
  const handleStickersChange = (newStickers: PlacedSticker[]) => {
    setStickers(newStickers);
    pushHistory(svgFills, strokes, newStickers);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const targetState = history[nextIdx];
      setSvgFills(targetState.svgFills);
      setStrokes(targetState.strokes);
      setStickers(targetState.stickers);
      setHistoryIndex(nextIdx);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const targetState = history[nextIdx];
      setSvgFills(targetState.svgFills);
      setStrokes(targetState.strokes);
      setStickers(targetState.stickers);
      setHistoryIndex(nextIdx);
    }
  };

  // Reset/Clear canvas for this page back to colourless objective
  const handleClear = () => {
    sounds.playSwoosh();
    setSvgFills({});
    setStrokes([]);
    setStickers([]);
    pushHistory({}, [], []);
  };

  // Switch Coloring Page
  const handleSelectPage = (page: ColoringPage) => {
    setCurrentPage(page);
    setSvgFills({});
    setStrokes([]);
    setStickers([]);
    setHistory([{ svgFills: {}, strokes: [], stickers: [] }]);
    setHistoryIndex(0);
  };

  // Toggle Sound FX
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sounds.enabled = nextVal;
  };

  // Toggle Background Music
  const handleToggleMusic = () => {
    const isNowPlaying = music.toggle();
    setMusicPlaying(isNowPlaying);
  };

  // Adjust Background Music Volume
  const handleMusicVolumeChange = (vol: number) => {
    setMusicVolume(vol);
    music.setVolume(vol);
  };

  // Stop music if page is closed or unmounted
  useEffect(() => {
    return () => {
      music.stop();
    };
  }, []);

  // Celebrate with colorful confetti fanfare
  const handleCelebrate = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    // Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  };

  // Download artwork combining SVG, Canvas strokes, and Stickers
  const handleDownload = () => {
    if (!svgRef.current || !canvasRef.current) return;

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1200;
      exportCanvas.height = 900;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Clean background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1200, 900);

      // Serialize SVG
      const svgEl = svgRef.current;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // 1. Draw SVG vector layer
        ctx.drawImage(img, 0, 0, 1200, 900);
        URL.revokeObjectURL(blobURL);

        // 2. Draw freehand drawing canvas layer
        if (canvasRef.current) {
          ctx.drawImage(canvasRef.current, 0, 0, 1200, 900);
        }

        // 3. Draw stickers
        stickers.forEach((st) => {
          ctx.save();
          const mappedX = (st.x / 800) * 1200;
          const mappedY = (st.y / 600) * 900;
          const mappedSize = st.size * 1.5;

          ctx.translate(mappedX, mappedY);
          ctx.rotate((st.rotation * Math.PI) / 180);
          ctx.font = `${mappedSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(st.emoji, 0, 0);
          ctx.restore();
        });

        // 4. Little decorative border frame & credit
        ctx.save();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 1188, 888);

        ctx.font = 'bold 22px "Nunito", sans-serif';
        ctx.fillStyle = '#78350F';
        ctx.textAlign = 'right';
        ctx.fillText(`🎨 ${currentPage.title} • Made with Kids Coloring Game`, 1170, 870);
        ctx.restore();

        // 5. Trigger download
        const dataURL = exportCanvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${currentPage.title.toLowerCase().replace(/\s+/g, '-')}-artwork.png`;
        downloadLink.href = dataURL;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = blobURL;
    } catch (err) {
      console.error('Could not download image:', err);
    }
  };

  // Print artwork
  const handlePrint = () => {
    window.print();
  };

  // Colored parts count for objective feedback
  const coloredCount = Object.values(svgFills).filter(
    (c: string) => Boolean(c) && c.toUpperCase() !== '#FFFFFF'
  ).length;
  const isColourless = coloredCount === 0 && strokes.length === 0 && stickers.length === 0;

  // Kid guidance text based on active tool
  const getToolGuidance = () => {
    switch (activeTool) {
      case 'bucket':
        return '👉 Tap any shape or section of the picture to magically fill it with color!';
      case 'brush':
        return '🖍️ Draw, doodle, and color freely on the page with your crayon!';
      case 'rainbow':
        return '🌈 Draw glowing rainbow strokes that change color as you paint!';
      case 'sparkle':
        return '✨ Draw magical sparkle trails with glittering stars!';
      case 'sticker':
        return `⭐ Tap anywhere on your picture to stamp the ${selectedSticker?.name || 'sticker'}!`;
      case 'eraser':
        return '🧽 Drag over crayon lines to erase them!';
      default:
        return 'Pick a color and have fun!';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50/60 p-2 sm:p-4 md:p-6 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-3 sm:space-y-4">
        {/* Header with Title & Action Controls */}
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          musicPlaying={musicPlaying}
          onToggleMusic={handleToggleMusic}
          musicVolume={musicVolume}
          onMusicVolumeChange={handleMusicVolumeChange}
          onCelebrate={handleCelebrate}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onOpenPageSelector={() => setIsPageSelectorOpen(true)}
          currentPageTitle={currentPage.title}
        />

        {/* Toolbar (Tools, Brush Sizes, Undo/Redo, Clear) */}
        <Toolbar
          activeTool={activeTool}
          setActiveTool={(tool) => {
            setActiveTool(tool);
            if (tool === 'sticker') {
              setIsStickerPickerOpen(true);
            }
          }}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onClear={handleClear}
          onOpenStickerPicker={() => setIsStickerPickerOpen(true)}
          selectedSticker={selectedSticker}
        />

        {/* Objective Tracker & Unlimited Coloring Banner */}
        <div 
          id="objective-banner" 
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-gradient-to-r from-amber-100 via-orange-100/80 to-yellow-100 border-2 border-amber-300 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-amber-950 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl select-none animate-bounce">
              {isColourless ? '🎯' : '🌟'}
            </span>
            <div>
              {isColourless ? (
                <span>
                  <strong className="text-amber-900 font-black">First Objective:</strong> This picture starts colourless! Pick a color and tap shapes or draw with crayons to add your colors!
                </span>
              ) : (
                <span>
                  <strong className="text-amber-900 font-black">Unlimited Coloring Mode:</strong> {coloredCount} parts colored! Keep drawing, filling, and stamping freely!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            {isColourless ? (
              <span className="px-3 py-1 rounded-full bg-white/90 border border-amber-400 text-amber-900 font-extrabold text-xs shadow-2xs">
                Colourless Picture
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs shadow-2xs flex items-center gap-1">
                <span>🎨 {coloredCount} parts colored</span>
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-amber-200/90 border border-amber-300 text-amber-950 font-bold text-xs">
              Unlimited
            </span>
          </div>
        </div>

        {/* Active Tool Tip / Instruction Banner for Kids */}
        <div className="bg-white/80 border border-amber-200 px-4 py-2 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">💡</span>
            <span>{getToolGuidance()}</span>
          </div>
          {activeTool === 'sticker' && selectedSticker && (
            <button
              type="button"
              onClick={() => setIsStickerPickerOpen(true)}
              className="text-xs font-black underline hover:text-amber-700 ml-2"
            >
              Change Sticker
            </button>
          )}
        </div>

        {/* Interactive Canvas Area */}
        <CanvasArea
          page={currentPage}
          activeTool={activeTool}
          selectedColor={selectedColor}
          brushSize={brushSize}
          selectedSticker={selectedSticker}
          svgFills={svgFills}
          onSvgFillChange={handleSvgFillChange}
          strokes={strokes}
          onStrokesChange={handleStrokesChange}
          stickers={stickers}
          onStickersChange={handleStickersChange}
          canvasContainerRef={canvasContainerRef}
          svgRef={svgRef}
          canvasRef={canvasRef}
        />

        {/* Crayon Color Palette */}
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={(color) => {
            setSelectedColor(color);
            // If currently in eraser or sticker, switch back to bucket or brush for immediate coloring convenience
            if (activeTool === 'eraser') {
              setActiveTool('brush');
            }
          }}
        />
      </div>

      {/* Footer watermark & reassurance */}
      <footer className="mt-6 text-center text-xs font-bold text-amber-900/60 pb-2 flex items-center justify-center gap-1">
        <span>Made for creative kids & toddlers</span>
        <span>•</span>
        <span>Tap Tada! 🎉 anytime to celebrate your art</span>
      </footer>

      {/* Sticker Picker Modal */}
      <StickerPicker
        selectedSticker={selectedSticker}
        onSelectSticker={(st) => {
          setSelectedSticker(st);
          if (st) setActiveTool('sticker');
        }}
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
      />

      {/* Coloring Page Selector Modal */}
      <PageSelector
        currentPageId={currentPage.id}
        onSelectPage={handleSelectPage}
        isOpen={isPageSelectorOpen}
        onClose={() => setIsPageSelectorOpen(false)}
      />
    </div>
  );
}
