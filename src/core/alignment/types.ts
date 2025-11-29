/**
 * Alignment System Types
 * Core type definitions for detecting alignments, connections, and patterns
 */

// Position on a grid (0-indexed)
export interface Position {
  row: number;
  col: number;
}

// Direction vectors for alignment detection
export type Direction = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

// Direction vectors as coordinate offsets
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  horizontal: { row: 0, col: 1 },
  vertical: { row: 1, col: 0 },
  'diagonal-down': { row: 1, col: 1 }, // top-left to bottom-right
  'diagonal-up': { row: -1, col: 1 }, // bottom-left to top-right
};

// All 8 directions for neighbor/flood-fill operations
export type FullDirection =
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'nw';

export const FULL_DIRECTION_VECTORS: Record<FullDirection, Position> = {
  n: { row: -1, col: 0 },
  ne: { row: -1, col: 1 },
  e: { row: 0, col: 1 },
  se: { row: 1, col: 1 },
  s: { row: 1, col: 0 },
  sw: { row: 1, col: -1 },
  w: { row: 0, col: -1 },
  nw: { row: -1, col: -1 },
};

// Cardinal directions only (4-connected)
export const CARDINAL_DIRECTIONS: FullDirection[] = ['n', 'e', 's', 'w'];

// All 8 directions (8-connected)
export const ALL_DIRECTIONS: FullDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

// Configuration for N-in-a-row detection
export interface AlignmentConfig {
  requiredLength: number; // How many in a row to detect (e.g., 4 for Connect Four)
  directions?: Direction[]; // Which directions to check (default: all 4)
  wrapHorizontal?: boolean; // Does the board wrap horizontally?
  wrapVertical?: boolean; // Does the board wrap vertically?
}

// Default alignment config
export const DEFAULT_ALIGNMENT_CONFIG: AlignmentConfig = {
  requiredLength: 4,
  directions: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
  wrapHorizontal: false,
  wrapVertical: false,
};

// Result of finding an alignment
export interface AlignmentResult {
  found: boolean;
  positions: Position[]; // Cells that form the alignment
  direction: Direction;
  value: unknown; // The value that was aligned (for multi-value grids)
}

// Result of finding multiple alignments
export interface AlignmentSearchResult {
  alignments: AlignmentResult[];
  hasAlignment: boolean;
}

// Configuration for contiguous region detection
export interface ContiguousConfig {
  connectivity: 4 | 8; // 4-connected (cardinal) or 8-connected (with diagonals)
  minSize?: number; // Minimum region size to report
  maxSize?: number; // Maximum region size to report
}

// Default contiguous config
export const DEFAULT_CONTIGUOUS_CONFIG: ContiguousConfig = {
  connectivity: 4,
  minSize: 1,
};

// A contiguous region of cells
export interface ContiguousRegion {
  positions: Position[];
  size: number;
  value: unknown; // The value shared by all cells in the region
  bounds: {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
  };
}

// Generic cell matcher function
export type CellMatcher<T> = (value: T, row: number, col: number) => boolean;

// Grid accessor function (allows any grid representation)
export type GridAccessor<T> = (row: number, col: number) => T | undefined;

// Grid dimensions
export interface GridDimensions {
  rows: number;
  cols: number;
}

// Visual highlight style
export interface HighlightStyle {
  color: string;
  opacity?: number;
  pulseAnimation?: boolean;
  borderWidth?: number;
}

// Highlight configuration for different alignment types
export const DEFAULT_HIGHLIGHT_STYLES: Record<string, HighlightStyle> = {
  winning: {
    color: '#4caf50',
    opacity: 0.6,
    pulseAnimation: true,
    borderWidth: 3,
  },
  selected: {
    color: '#ffd700',
    opacity: 0.4,
    pulseAnimation: false,
    borderWidth: 2,
  },
  preview: {
    color: '#2196f3',
    opacity: 0.3,
    pulseAnimation: false,
    borderWidth: 1,
  },
  danger: {
    color: '#f44336',
    opacity: 0.5,
    pulseAnimation: true,
    borderWidth: 3,
  },
};
