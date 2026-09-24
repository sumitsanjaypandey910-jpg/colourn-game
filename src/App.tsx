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

export default function App() {
  const [currentPage, setCurrentPage] = useState<ColoringPage>(COLORING_PAGES[0]);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0].value);
  const [brushSize, setBrushSize] = useState<BrushSize>(14);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(STICKER_ITEMS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.45);

  // Modals
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);

  // Mobile portrait orientation detector
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [showRotateTip, setShowRotateTip] = useState<boolean>(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

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

        // 2. Draw freehand drawing canvas layer with multiply blend mode
        if (canvasRef.current) {
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(canvasRef.current, 0, 0, 1200, 900);
          ctx.restore();
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

  // Player progress & coloring count
  const strokesCount = strokes.length;
  const stickersCount = stickers.length;
  const isColourless = strokesCount === 0 && stickersCount === 0;

  return (
    <div
      id="coloring-app-root"
      className="h-screen h-[100dvh] w-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex flex-col p-1 sm:p-2 font-sans text-amber-950"
    >
      {/* Mobile Portrait Orientation Helper */}
      {isPortrait && showRotateTip && (
        <div className="shrink-0 bg-amber-400 border border-amber-500 text-amber-950 px-2.5 py-1 text-xs font-black rounded-lg flex items-center justify-between mb-1 shadow-xs animate-pulse select-none">
          <div className="flex items-center gap-1.5 truncate">
            <span>🔄</span>
            <span className="truncate">Rotate phone sideways for the BIGGEST coloring canvas!</span>
          </div>
          <button
            type="button"
            onClick={() => setShowRotateTip(false)}
            className="text-amber-950 text-xs px-1.5 py-0.5 ml-2 hover:bg-amber-500 rounded font-bold"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sleek Top Header Bar */}
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
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onClear={handleClear}
        isColourless={isColourless}
        strokesCount={strokesCount}
      />

      {/* Main Horizontal Game Stage: Left Tools + Center Big Canvas + Right Colors */}
      <div
        id="game-horizontal-stage"
        className="flex-1 min-h-0 w-full flex flex-row items-stretch gap-1 sm:gap-2 mt-1 sm:mt-1.5 overflow-hidden select-none"
      >
        {/* Left Toolbar (Tools & Brush Sizes) */}
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
          onOpenStickerPicker={() => setIsStickerPickerOpen(true)}
          selectedSticker={selectedSticker}
          onOpenPageSelector={() => setIsPageSelectorOpen(true)}
        />

        {/* Center: Big Coloring Canvas Area */}
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

        {/* Right: Colors Palette Dock (2-columns, all 16 colors visible, NO SCROLLING!) */}
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={(color) => {
            setSelectedColor(color);
            if (activeTool === 'eraser') {
              setActiveTool('brush');
            }
          }}
        />
      </div>

      {/* Modals */}
      <StickerPicker
        selectedSticker={selectedSticker}
        onSelectSticker={(st) => {
          setSelectedSticker(st);
          if (st) setActiveTool('sticker');
        }}
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
      />

      <PageSelector
        currentPageId={currentPage.id}
        onSelectPage={handleSelectPage}
        isOpen={isPageSelectorOpen}
        onClose={() => setIsPageSelectorOpen(false)}
      />
    </div>
  );
}
