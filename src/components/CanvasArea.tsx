import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage, ToolType, BrushSize, DrawingStroke, PlacedSticker } from '../types';
import { StickerItem } from '../data/stickers';
import { sounds } from '../utils/audio';
import { Trash2, RotateCw, Sparkles } from 'lucide-react';

interface CanvasAreaProps {
  page: ColoringPage;
  activeTool: ToolType;
  selectedColor: string;
  brushSize: BrushSize;
  selectedSticker: StickerItem | null;
  svgFills: Record<string, string>;
  onSvgFillChange: (fills: Record<string, string>) => void;
  strokes: DrawingStroke[];
  onStrokesChange: (strokes: DrawingStroke[]) => void;
  stickers: PlacedSticker[];
  onStickersChange: (stickers: PlacedSticker[]) => void;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  page,
  activeTool,
  selectedColor,
  brushSize,
  selectedSticker,
  svgFills,
  onSvgFillChange,
  strokes,
  onStrokesChange,
  stickers,
  onStickersChange,
  canvasContainerRef,
  svgRef,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
  const [rainbowHue, setRainbowHue] = useState(0);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [sparkleBursts, setSparkleBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Dragging sticker state
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initStickerX: number; initStickerY: number } | null>(null);

  // Sparkle burst effect at click location
  const triggerSparkleBurst = (x: number, y: number) => {
    const burstId = Date.now() + Math.random();
    setSparkleBursts((prev) => [...prev, { id: burstId, x, y }]);
    setTimeout(() => {
      setSparkleBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 800);
  };

  // Convert client pointer event coordinates to SVG 800x600 space
  const getCanvasCoordinates = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    if (!canvasContainerRef.current) return { x: 0, y: 0 };
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    return {
      x: Math.max(0, Math.min(800, (e.clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(600, (e.clientY - rect.top) * scaleY)),
    };
  }, [canvasContainerRef]);

  // Redraw all strokes on HTML5 canvas
  const renderAllStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 600);

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

    for (const stroke of allStrokes) {
      if (stroke.points.length < 1) continue;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.size;

      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      ctx.beginPath();
      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = stroke.points[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // If sparkle tool, render sparkle star particles along stroke
      if (stroke.tool === 'sparkle') {
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < stroke.points.length; i += 4) {
          const p = stroke.points[i];
          drawLittleStar(ctx, p.x, p.y, stroke.size * 0.7, '#FEF08A');
        }
      }

      ctx.restore();
    }
  }, [strokes, currentStroke, canvasRef]);

  const drawLittleStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) => {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        Math.cos(((18 + i * 72) * Math.PI) / 180) * r + cx,
        -Math.sin(((18 + i * 72) * Math.PI) / 180) * r + cy
      );
      ctx.lineTo(
        Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2) + cx,
        -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2) + cy
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    renderAllStrokes();
  }, [renderAllStrokes]);

  // Drawing event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking on a sticker while not in sticker tool, we can select/drag it
    if (draggingStickerId) return;

    const coords = getCanvasCoordinates(e);

    if (activeTool === 'sticker' && selectedSticker) {
      sounds.playStickerStamp();
      const newSticker: PlacedSticker = {
        id: `sticker-${Date.now()}-${Math.random()}`,
        emoji: selectedSticker.emoji,
        name: selectedSticker.name,
        x: coords.x,
        y: coords.y,
        size: 54,
        rotation: Math.floor(Math.random() * 20) - 10,
      };
      onStickersChange([...stickers, newSticker]);
      setSelectedStickerId(newSticker.id);
      triggerSparkleBurst(coords.x, coords.y);
      return;
    }

    // Freehand drawing tools: brush, rainbow, sparkle, eraser
    setIsDrawing(true);
    let strokeColor = selectedColor;

    if (activeTool === 'rainbow') {
      strokeColor = `hsl(${rainbowHue}, 90%, 55%)`;
      setRainbowHue((prev) => (prev + 30) % 360);
    } else if (activeTool === 'sparkle') {
      strokeColor = '#FBBF24';
      sounds.playSparkle();
    }

    const stroke: DrawingStroke = {
      tool: activeTool,
      color: strokeColor,
      size: brushSize,
      points: [coords],
    };
    setCurrentStroke(stroke);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Handle sticker dragging
    if (draggingStickerId && dragStartRef.current) {
      const coords = getCanvasCoordinates(e);
      const dx = coords.x - dragStartRef.current.startX;
      const dy = coords.y - dragStartRef.current.startY;
      onStickersChange(
        stickers.map((st) =>
          st.id === draggingStickerId
            ? {
                ...st,
                x: Math.max(30, Math.min(770, dragStartRef.current!.initStickerX + dx)),
                y: Math.max(30, Math.min(570, dragStartRef.current!.initStickerY + dy)),
              }
            : st
        )
      );
      return;
    }

    if (!isDrawing || !currentStroke) return;

    const coords = getCanvasCoordinates(e);
    const lastPoint = currentStroke.points[currentStroke.points.length - 1];
    const dist = Math.hypot(coords.x - lastPoint.x, coords.y - lastPoint.y);

    if (dist < 3) return; // Debounce microscopic movements

    let strokeColor = currentStroke.color;
    if (currentStroke.tool === 'rainbow') {
      strokeColor = `hsl(${rainbowHue}, 90%, 55%)`;
      setRainbowHue((prev) => (prev + 12) % 360);
    }

    setCurrentStroke({
      ...currentStroke,
      color: strokeColor,
      points: [...currentStroke.points, coords],
    });
  };

  const handlePointerUp = () => {
    if (draggingStickerId) {
      setDraggingStickerId(null);
      dragStartRef.current = null;
    }

    if (isDrawing && currentStroke) {
      onStrokesChange([...strokes, currentStroke]);
      setCurrentStroke(null);
      setIsDrawing(false);
    }
  };

  // Sticker actions
  const handleDeleteSticker = (id: string) => {
    sounds.playSwoosh();
    onStickersChange(stickers.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const handleRotateSticker = (id: string) => {
    sounds.playPop();
    onStickersChange(
      stickers.map((s) =>
        s.id === id ? { ...s, rotation: (s.rotation + 45) % 360 } : s
      )
    );
  };

  const handleResizeSticker = (id: string) => {
    sounds.playPop();
    onStickersChange(
      stickers.map((s) => {
        if (s.id === id) {
          const nextSize = s.size === 54 ? 74 : s.size === 74 ? 96 : 54;
          return { ...s, size: nextSize };
        }
        return s;
      })
    );
  };

  return (
    <div
      id="coloring-canvas-wrapper"
      className="relative w-full max-w-4xl mx-auto aspect-[4/3] bg-white rounded-3xl shadow-xl border-4 border-amber-300 overflow-hidden select-none touch-none cursor-crosshair transition-all"
    >
      <div
        ref={canvasContainerRef}
        id="interactive-stage"
        className="relative w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Layer 1: Base SVG Line Art - 100% colourless outlines ready for player coloring */}
        <svg
          ref={svgRef}
          id="coloring-svg-layer"
          viewBox={page.viewBox}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {page.renderSvg(svgFills)}
        </svg>

        {/* Layer 2: Freehand Drawing HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          id="freehand-drawing-canvas"
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply"
        />

        {/* Layer 3: Interactive Placed Stickers */}
        <div id="stickers-container" className="absolute inset-0 pointer-events-none">
          {stickers.map((st) => {
            const isSelected = selectedStickerId === st.id;
            return (
              <div
                key={st.id}
                id={`placed-sticker-${st.id}`}
                className="absolute pointer-events-auto group cursor-grab active:cursor-grabbing"
                style={{
                  left: `${(st.x / 800) * 100}%`,
                  top: `${(st.y / 600) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${st.rotation}deg)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelectedStickerId(st.id);
                  setDraggingStickerId(st.id);
                  const coords = getCanvasCoordinates(e);
                  dragStartRef.current = {
                    startX: coords.x,
                    startY: coords.y,
                    initStickerX: st.x,
                    initStickerY: st.y,
                  };
                }}
              >
                <div
                  className={`relative flex items-center justify-center select-none transition-transform ${
                    isSelected ? 'ring-2 ring-amber-500 rounded-2xl p-1 bg-amber-100/30 shadow-md' : 'hover:scale-110'
                  }`}
                  style={{ fontSize: `${st.size}px`, lineHeight: 1 }}
                >
                  {st.emoji}

                  {/* Sticker mini control bubble when selected */}
                  {isSelected && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg border border-amber-300 pointer-events-auto z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleRotateSticker(st.id)}
                        className="p-1 rounded-full hover:bg-amber-100 text-amber-800"
                        title="Rotate Sticker"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResizeSticker(st.id)}
                        className="p-1 rounded-full hover:bg-amber-100 text-amber-800 text-[11px] font-black"
                        title="Change Size"
                      >
                        Aa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSticker(st.id)}
                        className="p-1 rounded-full hover:bg-rose-100 text-rose-600"
                        title="Remove Sticker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sparkle Burst Animation Overlay */}
        {sparkleBursts.map((sb) => (
          <div
            key={sb.id}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping text-amber-400"
            style={{
              left: `${(sb.x / 800) * 100}%`,
              top: `${(sb.y / 600) * 100}%`,
            }}
          >
            <Sparkles className="w-9 h-9 text-amber-400 drop-shadow-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
