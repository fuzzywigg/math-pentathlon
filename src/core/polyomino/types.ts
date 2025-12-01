// Polyomino System - Types and Shape Definitions
// Supports pattern blocks for Hex-a-Gone! and Jumpin' Jeannie

/** A single cell position within a shape */
export interface Cell {
  row: number;
  col: number;
}

/** Shape orientation (0°, 90°, 180°, 270°) */
export type Rotation = 0 | 90 | 180 | 270;

/** A polyomino shape definition */
export interface PolyominoShape {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Cells that make up the shape (relative to origin 0,0) */
  cells: Cell[];
  /** Color for rendering */
  color: string;
  /** Whether the shape can be rotated */
  canRotate: boolean;
  /** Whether the shape can be flipped/reflected */
  canFlip: boolean;
  /** Number of cells (size) */
  size: number;
}

/** A polyomino instance placed on the board */
export interface PlacedPolyomino {
  /** Reference to shape definition */
  shapeId: string;
  /** Position on board (anchor cell) */
  position: Cell;
  /** Current rotation */
  rotation: Rotation;
  /** Whether flipped horizontally */
  flipped: boolean;
  /** Player who placed it (optional) */
  playerId?: number;
}

/** Board cell state */
export interface BoardCell {
  /** Whether cell is occupied */
  occupied: boolean;
  /** ID of polyomino occupying this cell */
  polyominoId?: string;
  /** Player who owns this cell */
  playerId?: number;
  /** Whether cell is valid for placement */
  valid: boolean;
}

/** Polyomino placement result */
export interface PlacementResult {
  valid: boolean;
  cells: Cell[];
  reason?: string;
}

/** Configuration for polyomino rendering */
export interface PolyominoRenderConfig {
  cellSize: number;
  padding: number;
  showGrid: boolean;
  highlightColor?: string;
  invalidColor?: string;
}

// =============================================================================
// Standard Polyomino Sets
// =============================================================================

/** Standard tetrominoes (4-cell shapes from Tetris) */
export const TETROMINOES: PolyominoShape[] = [
  {
    id: 'I',
    name: 'I-piece',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }],
    color: '#00bcd4',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
  {
    id: 'O',
    name: 'O-piece',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    color: '#ffeb3b',
    canRotate: false,
    canFlip: false,
    size: 4,
  },
  {
    id: 'T',
    name: 'T-piece',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }],
    color: '#9c27b0',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
  {
    id: 'S',
    name: 'S-piece',
    cells: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    color: '#4caf50',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
  {
    id: 'Z',
    name: 'Z-piece',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    color: '#f44336',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
  {
    id: 'J',
    name: 'J-piece',
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    color: '#3f51b5',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
  {
    id: 'L',
    name: 'L-piece',
    cells: [{ row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    color: '#ff9800',
    canRotate: true,
    canFlip: false,
    size: 4,
  },
];

/** Hex-a-Gone! pattern blocks (based on pattern block set) */
export const HEX_PATTERN_BLOCKS: PolyominoShape[] = [
  {
    id: 'hexagon',
    name: 'Hexagon',
    // Hexagon covers 6 triangular cells (represented as a larger unit)
    cells: [{ row: 0, col: 0 }],
    color: '#ffeb3b', // Yellow
    canRotate: false,
    canFlip: false,
    size: 6,
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    // Trapezoid covers 3 triangular cells
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
    color: '#f44336', // Red
    canRotate: true,
    canFlip: true,
    size: 3,
  },
  {
    id: 'rhombus',
    name: 'Rhombus',
    // Rhombus covers 2 triangular cells
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
    color: '#2196f3', // Blue
    canRotate: true,
    canFlip: false,
    size: 2,
  },
  {
    id: 'triangle',
    name: 'Triangle',
    // Single triangular cell
    cells: [{ row: 0, col: 0 }],
    color: '#4caf50', // Green
    canRotate: true,
    canFlip: false,
    size: 1,
  },
  {
    id: 'square',
    name: 'Square',
    // Square covers 2 triangular cells (different orientation than rhombus)
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
    color: '#ff9800', // Orange
    canRotate: true,
    canFlip: false,
    size: 2,
  },
];

/** Pentominoes (5-cell shapes for advanced puzzles) */
export const PENTOMINOES: PolyominoShape[] = [
  {
    id: 'F',
    name: 'F-pentomino',
    cells: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
    color: '#e91e63',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
  {
    id: 'I5',
    name: 'I-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
    color: '#00bcd4',
    canRotate: true,
    canFlip: false,
    size: 5,
  },
  {
    id: 'L5',
    name: 'L-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 3, col: 1 }],
    color: '#ff9800',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
  {
    id: 'N',
    name: 'N-pentomino',
    cells: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 3, col: 0 }],
    color: '#795548',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
  {
    id: 'P',
    name: 'P-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
    color: '#9c27b0',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
  {
    id: 'T5',
    name: 'T-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
    color: '#607d8b',
    canRotate: true,
    canFlip: false,
    size: 5,
  },
  {
    id: 'U',
    name: 'U-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    color: '#3f51b5',
    canRotate: true,
    canFlip: false,
    size: 5,
  },
  {
    id: 'V',
    name: 'V-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
    color: '#009688',
    canRotate: true,
    canFlip: false,
    size: 5,
  },
  {
    id: 'W',
    name: 'W-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
    color: '#8bc34a',
    canRotate: true,
    canFlip: false,
    size: 5,
  },
  {
    id: 'X',
    name: 'X-pentomino',
    cells: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }],
    color: '#f44336',
    canRotate: false,
    canFlip: false,
    size: 5,
  },
  {
    id: 'Y',
    name: 'Y-pentomino',
    cells: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 3, col: 1 }],
    color: '#ffeb3b',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
  {
    id: 'Z5',
    name: 'Z-pentomino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
    color: '#4caf50',
    canRotate: true,
    canFlip: true,
    size: 5,
  },
];

/** Simple shapes (1-3 cells) for beginners */
export const SIMPLE_SHAPES: PolyominoShape[] = [
  {
    id: 'monomino',
    name: 'Single',
    cells: [{ row: 0, col: 0 }],
    color: '#9e9e9e',
    canRotate: false,
    canFlip: false,
    size: 1,
  },
  {
    id: 'domino',
    name: 'Domino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
    color: '#607d8b',
    canRotate: true,
    canFlip: false,
    size: 2,
  },
  {
    id: 'tromino-I',
    name: 'I-tromino',
    cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
    color: '#00bcd4',
    canRotate: true,
    canFlip: false,
    size: 3,
  },
  {
    id: 'tromino-L',
    name: 'L-tromino',
    cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    color: '#ff9800',
    canRotate: true,
    canFlip: true,
    size: 3,
  },
];

/** Get all shapes in a set by ID */
export function getShapeById(id: string, set: PolyominoShape[]): PolyominoShape | undefined {
  return set.find(s => s.id === id);
}

/** Get shapes by size */
export function getShapesBySize(size: number, set: PolyominoShape[]): PolyominoShape[] {
  return set.filter(s => s.size === size);
}
