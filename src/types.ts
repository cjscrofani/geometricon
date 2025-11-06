export interface IconOptions {
  size?: number;
  backgroundColor?: string | null;

  // Complexity-based generation
  useComplexity?: boolean; // Default: true

  // Override shape count (ignores complexity if set)
  shapeCount?: number; // Fixed number
  shapeCountMin?: number; // Min shapes (random between min-max)
  shapeCountMax?: number; // Max shapes

  // Shape type selection
  allowedShapes?: ('circle' | 'square' | 'triangle' | 'hexagon' | 'diamond')[]; // Default: all

  // Composition mode for visual harmony
  composition?: 'centered' | 'radial' | 'split' | 'frame' | 'random'; // Default: centered

  // Color customization
  color?: string; // Single fixed color for all shapes
  colorPalette?: string[]; // Custom array of colors to choose from
  colorScheme?: 'pastel' | 'vibrant' | 'warm' | 'cool' | 'monochrome' | 'earth' | 'ocean' | 'sunset'; // Preset color schemes
  saturationMin?: number; // Default: 40
  saturationMax?: number; // Default: 65
  lightnessMin?: number; // Default: 70
  lightnessMax?: number; // Default: 88
  opacityMin?: number; // Default: 0.65
  opacityMax?: number; // Default: 0.9

  // Gradient options
  useGradients?: boolean; // Use gradients instead of solid colors (default: false)
}

export interface Point {
  x: number;
  y: number;
}

export interface Gradient {
  id: string;
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number; // For linear gradients (in degrees)
}

export interface Shape {
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond';
  color: string;
  opacity: number;
  position: Point;
  rotation?: number;
  size: number; // Size of the shape
  radius?: number; // For circles
  width?: number; // For rectangles/squares
  height?: number; // For rectangles
  gradientId?: string; // Reference to gradient ID if using gradients
}

export interface IconData {
  backgroundColor: string;
  shapes: Shape[];
  size: number;
  gradients?: Gradient[]; // Gradient definitions for SVG
}
