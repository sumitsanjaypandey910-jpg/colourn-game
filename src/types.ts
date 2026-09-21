import type { ReactNode } from 'react';

export type ToolType = 'brush' | 'rainbow' | 'sparkle' | 'sticker' | 'eraser';

export type BrushSize = 6 | 14 | 26 | 44;

export interface ColorOption {
  name: string;
  value: string;
  border?: string;
}

export interface PlacedSticker {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface ColoringPage {
  id: string;
  title: string;
  category: 'animals' | 'fantasy' | 'space' | 'treats' | 'nature' | 'blank';
  description: string;
  thumbnailSvg: string;
  defaultColors?: Record<string, string>;
  viewBox: string;
  renderSvg: (fills: Record<string, string>, onSectionClick: (sectionId: string) => void) => ReactNode;
}

export interface DrawingStroke {
  tool: ToolType;
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

export interface CanvasHistoryItem {
  svgFills: Record<string, string>;
  strokes: DrawingStroke[];
  stickers: PlacedSticker[];
}
