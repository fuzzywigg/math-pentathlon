/**
 * Polyomino System Types
 * Core type definitions for polyomino shapes and operations
 */

// Cell position relative to the shape's origin (typically top-left or centroid)
export interface Cell {
  row: number;
  col: number;
}

// Types of polyominoes by cell count
export type PolyominoOrder = 1 | 2 | 3 | 4 | 5 | 6;

export const POLYOMINO_NAMES: Record<PolyominoOrder, string> = {
  1: 'monomino',
  2: 'domino',
  3: 'tromino',
  4: 'tetromino',
  5: 'pentomino',
  6: 'hexomino',
};

// A polyomino shape definition
export interface Polyomino {
  id: string; // Unique identifier (e.g., 'T', 'L', 'I')
  name: string; // Human-readable name
  order: PolyominoOrder; // Number of cells
  cells: Cell[]; // Cells that make up the shape (normalized to origin)
  color?: string; // Default display color
}

// A polyomino with specific transformation state
export interface TransformedPolyomino extends Polyomino {
  rotation: 0 | 90 | 180 | 270; // Current rotation in degrees
  flipped: boolean; // Whether horizontally flipped
  originalId: string; // Reference to base shape ID
}

// Placement of a polyomino on a grid
export interface PolyominoPlacement {
  polyomino: Polyomino;
  position: Cell; // Top-left corner position on grid
  rotation: 0 | 90 | 180 | 270;
  flipped: boolean;
}

// Bounds of a polyomino shape
export interface PolyominoBounds {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
  width: number;
  height: number;
}

// Visual style options for polyomino rendering
export interface PolyominoStyle {
  cellSize: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  showGrid: boolean;
  gap: number;
}

export const DEFAULT_POLYOMINO_STYLE: PolyominoStyle = {
  cellSize: 40,
  borderWidth: 2,
  borderColor: '#333',
  borderRadius: 4,
  showGrid: true,
  gap: 1,
};

// Colors for polyominoes (based on standard conventions)
export const POLYOMINO_COLORS: Record<string, string> = {
  // Monomino
  O1: '#808080', // Gray

  // Domino
  I2: '#00bcd4', // Cyan

  // Trominoes
  I3: '#2196f3', // Blue
  L3: '#ff9800', // Orange (or V tromino)

  // Tetrominoes (Tetris colors)
  I: '#00bcd4', // Cyan
  O: '#ffeb3b', // Yellow
  T: '#9c27b0', // Purple
  S: '#4caf50', // Green
  Z: '#f44336', // Red
  J: '#3f51b5', // Blue
  L: '#ff9800', // Orange

  // Pentominoes (standard naming)
  F: '#e91e63', // Pink
  I5: '#00bcd4', // Cyan
  L5: '#ff9800', // Orange
  N: '#795548', // Brown
  P: '#9c27b0', // Purple
  T5: '#673ab7', // Deep Purple
  U: '#009688', // Teal
  V: '#8bc34a', // Light Green
  W: '#3f51b5', // Indigo
  X: '#f44336', // Red
  Y: '#ffeb3b', // Yellow
  Z5: '#4caf50', // Green
};

// Standard tetromino definitions
export const TETROMINOES: Polyomino[] = [
  {
    id: 'I',
    name: 'I-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
    color: POLYOMINO_COLORS.I,
  },
  {
    id: 'O',
    name: 'O-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    color: POLYOMINO_COLORS.O,
  },
  {
    id: 'T',
    name: 'T-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
    ],
    color: POLYOMINO_COLORS.T,
  },
  {
    id: 'S',
    name: 'S-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    color: POLYOMINO_COLORS.S,
  },
  {
    id: 'Z',
    name: 'Z-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    color: POLYOMINO_COLORS.Z,
  },
  {
    id: 'J',
    name: 'J-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    color: POLYOMINO_COLORS.J,
  },
  {
    id: 'L',
    name: 'L-tetromino',
    order: 4,
    cells: [
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    color: POLYOMINO_COLORS.L,
  },
];

// Standard pentomino definitions (the 12 free pentominoes)
export const PENTOMINOES: Polyomino[] = [
  {
    id: 'F',
    name: 'F-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
    ],
    color: POLYOMINO_COLORS.F,
  },
  {
    id: 'I5',
    name: 'I-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ],
    color: POLYOMINO_COLORS.I5,
  },
  {
    id: 'L5',
    name: 'L-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
      { row: 3, col: 1 },
    ],
    color: POLYOMINO_COLORS.L5,
  },
  {
    id: 'N',
    name: 'N-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
    ],
    color: POLYOMINO_COLORS.N,
  },
  {
    id: 'P',
    name: 'P-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
    ],
    color: POLYOMINO_COLORS.P,
  },
  {
    id: 'T5',
    name: 'T-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
    ],
    color: POLYOMINO_COLORS.T5,
  },
  {
    id: 'U',
    name: 'U-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    color: POLYOMINO_COLORS.U,
  },
  {
    id: 'V',
    name: 'V-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
    color: POLYOMINO_COLORS.V,
  },
  {
    id: 'W',
    name: 'W-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
    color: POLYOMINO_COLORS.W,
  },
  {
    id: 'X',
    name: 'X-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ],
    color: POLYOMINO_COLORS.X,
  },
  {
    id: 'Y',
    name: 'Y-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 3, col: 1 },
    ],
    color: POLYOMINO_COLORS.Y,
  },
  {
    id: 'Z5',
    name: 'Z-pentomino',
    order: 5,
    cells: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
    color: POLYOMINO_COLORS.Z5,
  },
];

// Get all polyominoes by order
export function getPolyominoesByOrder(order: PolyominoOrder): Polyomino[] {
  switch (order) {
    case 1:
      return [
        {
          id: 'O1',
          name: 'Monomino',
          order: 1,
          cells: [{ row: 0, col: 0 }],
          color: POLYOMINO_COLORS.O1,
        },
      ];
    case 2:
      return [
        {
          id: 'I2',
          name: 'Domino',
          order: 2,
          cells: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
          ],
          color: POLYOMINO_COLORS.I2,
        },
      ];
    case 3:
      return [
        {
          id: 'I3',
          name: 'I-tromino',
          order: 3,
          cells: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
          ],
          color: POLYOMINO_COLORS.I3,
        },
        {
          id: 'L3',
          name: 'L-tromino',
          order: 3,
          cells: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
          ],
          color: POLYOMINO_COLORS.L3,
        },
      ];
    case 4:
      return TETROMINOES;
    case 5:
      return PENTOMINOES;
    case 6:
      // Hexominoes are more complex (35 free hexominoes), not fully defined here
      return [];
    default:
      return [];
  }
}

// Get a specific polyomino by ID
export function getPolyominoById(id: string): Polyomino | undefined {
  const allPolyominoes = [
    ...getPolyominoesByOrder(1),
    ...getPolyominoesByOrder(2),
    ...getPolyominoesByOrder(3),
    ...TETROMINOES,
    ...PENTOMINOES,
  ];
  return allPolyominoes.find((p) => p.id === id);
}
