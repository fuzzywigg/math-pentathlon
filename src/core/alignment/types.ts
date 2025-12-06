// Alignment Detection Types

/** A position on a 2D grid */
export interface GridPosition {
  row: number;
  col: number;
}

/** A cell value that can be compared for alignment */
export type CellValue = string | number | null;

/** Function to get cell value at a position */
export type CellGetter<T = CellValue> = (row: number, col: number) => T;

/** Direction vectors for alignment checking */
export interface Direction {
  name: string;
  dRow: number;
  dCol: number;
}

/** Standard directions for grid alignment */
export const DIRECTIONS = {
  HORIZONTAL: { name: 'horizontal', dRow: 0, dCol: 1 },
  VERTICAL: { name: 'vertical', dRow: 1, dCol: 0 },
  DIAGONAL_DOWN: { name: 'diagonal-down', dRow: 1, dCol: 1 },
  DIAGONAL_UP: { name: 'diagonal-up', dRow: -1, dCol: 1 },
} as const;

/** All standard directions as array */
export const ALL_DIRECTIONS: Direction[] = Object.values(DIRECTIONS);

/** Configuration for alignment detection */
export interface AlignmentConfig {
  /** Number of pieces needed in a row to win/score */
  targetLength: number;
  /** Grid dimensions */
  rows: number;
  cols: number;
  /** Directions to check (default: all 4) */
  directions?: Direction[];
  /** Whether to wrap around edges (for toroidal boards) */
  wrap?: boolean;
}

/** Result of finding an alignment */
export interface AlignmentResult {
  /** The value that forms the alignment */
  value: CellValue;
  /** Starting position */
  start: GridPosition;
  /** Ending position */
  end: GridPosition;
  /** All positions in the alignment */
  positions: GridPosition[];
  /** Direction of the alignment */
  direction: Direction;
  /** Length of the alignment */
  length: number;
}

/** Result of checking for alignments on a board */
export interface AlignmentCheckResult {
  /** Whether any winning alignments were found */
  hasWinner: boolean;
  /** The winning value (if any) */
  winner: CellValue;
  /** All alignments found (may include multiple) */
  alignments: AlignmentResult[];
}

/** A region of connected cells */
export interface Region {
  /** The value shared by cells in this region */
  value: CellValue;
  /** All positions in the region */
  positions: GridPosition[];
  /** Size of the region */
  size: number;
}

/** Configuration for contiguous region detection */
export interface ContiguousConfig {
  /** Grid dimensions */
  rows: number;
  cols: number;
  /** Whether to include diagonal connections (default: false for 4-way, true for 8-way) */
  includeDiagonals?: boolean;
  /** Whether to wrap around edges */
  wrap?: boolean;
}

/** Neighbor offsets for 4-way connectivity */
export const NEIGHBORS_4WAY: GridPosition[] = [
  { row: -1, col: 0 },  // up
  { row: 1, col: 0 },   // down
  { row: 0, col: -1 },  // left
  { row: 0, col: 1 },   // right
];

/** Neighbor offsets for 8-way connectivity */
export const NEIGHBORS_8WAY: GridPosition[] = [
  ...NEIGHBORS_4WAY,
  { row: -1, col: -1 }, // up-left
  { row: -1, col: 1 },  // up-right
  { row: 1, col: -1 },  // down-left
  { row: 1, col: 1 },   // down-right
];

/** Hex grid neighbor directions (pointy-top) */
export const HEX_NEIGHBORS_EVEN_ROW: GridPosition[] = [
  { row: -1, col: 0 },  // top-left
  { row: -1, col: 1 },  // top-right
  { row: 0, col: -1 },  // left
  { row: 0, col: 1 },   // right
  { row: 1, col: 0 },   // bottom-left
  { row: 1, col: 1 },   // bottom-right
];

export const HEX_NEIGHBORS_ODD_ROW: GridPosition[] = [
  { row: -1, col: -1 }, // top-left
  { row: -1, col: 0 },  // top-right
  { row: 0, col: -1 },  // left
  { row: 0, col: 1 },   // right
  { row: 1, col: -1 },  // bottom-left
  { row: 1, col: 0 },   // bottom-right
];
