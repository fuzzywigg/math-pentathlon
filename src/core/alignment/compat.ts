/**
 * Alignment Compatibility Shim
 *
 * The test suite (alignment.test.ts) was written against a proposed API that
 * uses ergonomic calling conventions:
 *   - positions as { row, col } objects (not row, col pairs)
 *   - dimensions as { rows, cols } objects (not embedded in config)
 *   - connectivity as a plain number (4 | 8, not a config boolean)
 *   - filter predicates for region queries
 *
 * The implementation uses an internal-style API where those are bundled into
 * a ContiguousConfig / AlignmentConfig object and passed to BFS helpers.
 *
 * This file provides the test-facing API as thin wrappers over the existing
 * implementation — no logic is duplicated, no tests are changed.
 *
 * WHY a separate file instead of editing the modules?
 * - The internal API is used by game controllers and the game-registry.
 *   Changing function signatures there would break production code.
 * - These wrappers are purely additive exports; tree-shaking removes them
 *   from production bundles if unused.
 */

import { GridPosition, CellValue, CellGetter, AlignmentResult, Region } from './types';
import {
  isInBounds as _isInBounds,
  findAlignmentFromCenter,
  findAllAlignments as _findAllAlignments,
} from './grid-alignment';
import {
  getNeighbors as _getNeighbors,
  findRegion,
  findAllRegions as _findAllRegions,
  areConnected as _areConnected,
} from './contiguous';
import { ALL_DIRECTIONS, DIRECTIONS } from './types';

// ─── Dimension helpers ────────────────────────────────────────────────────────

export interface Dimensions {
  rows: number;
  cols: number;
}

/** Build a { rows, cols } dimensions object from any 2D array. */
export function getArrayDimensions<T>(grid: T[][]): Dimensions {
  return {
    rows: grid.length,
    cols: grid.length > 0 ? grid[0].length : 0,
  };
}

/**
 * createArrayAccessor: build a cell getter from a 2D array.
 * - Returns the cell value for in-bounds positions.
 * - Returns undefined for out-of-bounds (matching test expectations for
 *   boundary checks), but internally wraps as null for alignment helpers
 *   that require CellGetter.
 */
export function createArrayAccessor<T extends CellValue>(
  grid: T[][]
): (row: number, col: number) => T | undefined {
  return (row, col) => {
    if (row < 0 || row >= grid.length) return undefined;
    if (col < 0 || col >= (grid[row]?.length ?? 0)) return undefined;
    return grid[row][col];
  };
}



// ─── Direction constants (test-expected names) ─────────────────────────────

/**
 * Direction vectors keyed by semantic name.
 * The module uses DIRECTIONS with dRow/dCol; the test expects { row, col }.
 */
export const DIRECTION_VECTORS: Record<string, { row: number; col: number }> = {
  horizontal:      { row: DIRECTIONS.HORIZONTAL.dRow,      col: DIRECTIONS.HORIZONTAL.dCol },
  vertical:        { row: DIRECTIONS.VERTICAL.dRow,        col: DIRECTIONS.VERTICAL.dCol },
  'diagonal-down': { row: DIRECTIONS.DIAGONAL_DOWN.dRow,   col: DIRECTIONS.DIAGONAL_DOWN.dCol },
  'diagonal-up':   { row: DIRECTIONS.DIAGONAL_UP.dRow,     col: DIRECTIONS.DIAGONAL_UP.dCol },
};

/** 4-directional set (horizontal + vertical, cardinal axes). */
export const CARDINAL_DIRECTIONS = [
  DIRECTIONS.HORIZONTAL,
  DIRECTIONS.VERTICAL,
  { name: 'horizontal-rev', dRow: 0,  dCol: -1 },
  { name: 'vertical-rev',   dRow: -1, dCol: 0  },
];

/**
 * ALL_DIRECTIONS: all 8 directions (4 named + 4 reverses).
 * Shadows the module export which only has 4.
 */
export const ALL_DIRECTIONS_8 = [
  DIRECTIONS.HORIZONTAL,
  DIRECTIONS.VERTICAL,
  DIRECTIONS.DIAGONAL_DOWN,
  DIRECTIONS.DIAGONAL_UP,
  { name: 'horizontal-rev',    dRow: 0,  dCol: -1 },
  { name: 'vertical-rev',      dRow: -1, dCol: 0  },
  { name: 'diagonal-down-rev', dRow: -1, dCol: -1 },
  { name: 'diagonal-up-rev',   dRow: 1,  dCol: -1 },
];

// ─── isInBounds ergonomic wrapper ───────────────────────────────────────────────

/**
 * isInBounds: test-facing wrapper that accepts (pos, dimensions, wrapOptions).
 * When wrap options are supplied, a position that wraps into valid range is
 * considered in-bounds.
 * Shadows the internal isInBounds(row, col, rows, cols) signature.
 */
export function isInBounds(
  pos: GridPosition,
  dimensions: Dimensions,
  wrapOptions: WrapOptions = {}
): boolean {
  let { row, col } = pos;
  const { rows, cols } = dimensions;

  if (wrapOptions.wrapVertical) {
    row = ((row % rows) + rows) % rows;
  }
  if (wrapOptions.wrapHorizontal) {
    col = ((col % cols) + cols) % cols;
  }

  return row >= 0 && row < rows && col >= 0 && col < cols;
}

// ─── Grid-position normalisation ──────────────────────────────────────────────

export interface WrapOptions {
  wrapVertical?: boolean;
  wrapHorizontal?: boolean;
}

/**
 * normalizePosition: clamp or wrap a position to fit within dimensions.
 * Without wrap options, returns the position unchanged (in-bounds check is
 * the caller's responsibility, matching the test expectations).
 */
export function normalizePosition(
  pos: GridPosition,
  dimensions: Dimensions,
  options: WrapOptions = {}
): GridPosition {
  let { row, col } = pos;
  const { rows, cols } = dimensions;

  if (options.wrapVertical) {
    row = ((row % rows) + rows) % rows;
  }
  if (options.wrapHorizontal) {
    col = ((col % cols) + cols) % cols;
  }

  return { row, col };
}

// ─── Line helpers ─────────────────────────────────────────────────────────────

type DirectionName = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

const DIR_DELTAS: Record<DirectionName, { dRow: number; dCol: number }> = {
  'horizontal':      { dRow: 0,  dCol: 1  },
  'vertical':        { dRow: 1,  dCol: 0  },
  'diagonal-down':   { dRow: 1,  dCol: 1  },
  'diagonal-up':     { dRow: -1, dCol: 1  },
};

/**
 * getLinePositions: return the N consecutive positions starting at `start`
 * moving in `direction`. Returns null if any position goes out of bounds.
 */
export function getLinePositions(
  start: GridPosition,
  direction: DirectionName,
  length: number,
  dimensions: Dimensions
): GridPosition[] | null {
  const { dRow, dCol } = DIR_DELTAS[direction];
  const positions: GridPosition[] = [];

  for (let i = 0; i < length; i++) {
    const pos = { row: start.row + i * dRow, col: start.col + i * dCol };
    if (pos.row < 0 || pos.row >= dimensions.rows || pos.col < 0 || pos.col >= dimensions.cols) {
      return null;
    }
    positions.push(pos);
  }

  return positions;
}

// ─── Alignment query wrappers ─────────────────────────────────────────────────

export interface AlignmentOptions {
  requiredLength?: number;
}

export interface AlignmentCheckResult {
  hasAlignment: boolean;
  alignments: AlignmentResult[];
}

/**
 * checkLineAlignment: check whether a specific line of positions all share
 * the same non-null value.
 */
export interface LineAlignmentResult {
  isAligned: boolean;
  value: CellValue;
}

export function checkLineAlignment(
  positions: GridPosition[],
  getCell: (row: number, col: number) => CellValue | undefined
): LineAlignmentResult {
  if (positions.length === 0) return { isAligned: false, value: null };
  const first = getCell(positions[0].row, positions[0].col);
  if (first === null || first === undefined) return { isAligned: false, value: null };
  const aligned = positions.every(p => {
    const v = getCell(p.row, p.col);
    return v !== null && v !== undefined && v === first;
  });
  return { isAligned: aligned, value: aligned ? first : null };
}

/**
 * findAlignmentAt: find a single alignment of `requiredLength` starting at
 * `pos` in the given direction. Returns null if no alignment found.
 */
export function findAlignmentAt(
  pos: GridPosition,
  direction: DirectionName,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: AlignmentOptions = {}
): AlignmentResult | null {
  const { requiredLength = 4 } = options;

  // Map direction name to the internal Direction object
  const dirKey = direction.toUpperCase().replace(/-/g, '_') as keyof typeof DIRECTIONS;
  const dir = DIRECTIONS[dirKey] ?? Object.values(DIRECTIONS).find(d => d.name === direction);
  if (!dir) return null;

  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };

  const result = findAlignmentFromCenter(pos.row, pos.col, dir, safeGet, {
    targetLength: requiredLength,
    rows: dimensions.rows,
    cols: dimensions.cols,
  });

  if (!result) return null;

  // The test expects result.direction to be the direction name string,
  // not the Direction object. Map it.
  return {
    ...result,
    direction: result.direction.name as unknown as typeof result.direction,
  };
}

/**
 * findAllAlignments: scan entire grid and return all alignments of
 * `requiredLength`.
 */
export function findAllAlignments(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: AlignmentOptions = {}
): AlignmentCheckResult {
  const { requiredLength = 4 } = options;
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };

  // Internal findAllAlignments returns AlignmentResult[], not the check shape
  const alignments = _findAllAlignments(safeGet, {
    targetLength: requiredLength,
    rows: dimensions.rows,
    cols: dimensions.cols,
  });

  return {
    hasAlignment: alignments.length > 0,
    alignments,
  };
}

/**
 * hasAlignment: returns true if any alignment of `requiredLength` exists.
 */
export function hasAlignment(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: AlignmentOptions = {}
): boolean {
  return findAllAlignments(dimensions, getCell, options).hasAlignment;
}

/**
 * findAlignmentsThrough: find all alignments that pass through a specific position.
 */
export function findAlignmentsThrough(
  pos: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: AlignmentOptions = {}
): AlignmentCheckResult {
  const { requiredLength = 4 } = options;
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };

  const alignments: AlignmentResult[] = [];

  for (const dir of ALL_DIRECTIONS) {
    const result = findAlignmentFromCenter(pos.row, pos.col, dir, safeGet, {
      targetLength: requiredLength,
      rows: dimensions.rows,
      cols: dimensions.cols,
    });
    if (result) {
      // Deduplicate: only add if this set of positions isn't already recorded
      const key = result.positions.map(p => `${p.row},${p.col}`).sort().join('|');
      if (!alignments.some(a => a.positions.map(p => `${p.row},${p.col}`).sort().join('|') === key)) {
        alignments.push(result);
      }
    }
  }

  return { hasAlignment: alignments.length > 0, alignments };
}

/**
 * countMaxAligned: find the direction and count of the longest run of the
 * same value through `pos`.
 */
export function countMaxAligned(
  pos: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined
): { count: number; direction: string; positions: GridPosition[] } {
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };

  let best: AlignmentResult | null = null;

  for (const dir of ALL_DIRECTIONS) {
    const result = findAlignmentFromCenter(pos.row, pos.col, dir, safeGet, {
      targetLength: 1,
      rows: dimensions.rows,
      cols: dimensions.cols,
    });
    if (result && (!best || result.length > best.length)) {
      best = result;
    }
  }

  if (!best) return { count: 1, direction: 'horizontal', positions: [pos] };

  return {
    count: best.length,
    direction: best.direction.name,
    positions: best.positions,
  };
}

// ─── Contiguous region wrappers ───────────────────────────────────────────────

export interface ConnectivityOptions {
  connectivity?: 4 | 8;
}

function toContiguousConfig(dimensions: Dimensions, options: ConnectivityOptions = {}) {
  return {
    rows: dimensions.rows,
    cols: dimensions.cols,
    includeDiagonals: (options.connectivity ?? 4) === 8,
  };
}

/**
 * getNeighbors: return valid neighbors of `pos` using 4- or 8-connectivity.
 * Test signature: (pos, dimensions, connectivity) where connectivity is 4 | 8.
 */
export function getNeighbors(
  pos: GridPosition,
  dimensions: Dimensions,
  connectivity: 4 | 8 = 4
): GridPosition[] {
  return _getNeighbors(pos.row, pos.col, toContiguousConfig(dimensions, { connectivity }));
}

/**
 * findRegionAt: find the contiguous region containing `pos`.
 * Returns null if pos is null/empty or out of bounds.
 */
export function findRegionAt(
  pos: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {}
): Region | null {
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };
  return findRegion(pos.row, pos.col, safeGet, toContiguousConfig(dimensions, options));
}

/**
 * findAllRegions: find all distinct contiguous regions, optionally filtered
 * by a predicate on cell value.
 */
export function findAllRegions(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {},
  filter?: (value: CellValue) => boolean
): Region[] {
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };

  const all = _findAllRegions(safeGet, toContiguousConfig(dimensions, options));
  return filter ? all.filter(r => filter(r.value)) : all;
}

/**
 * findLargestRegion: return the largest region, optionally filtered by predicate.
 */
export function findLargestRegion(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {},
  filter?: (value: CellValue) => boolean
): Region | null {
  const regions = findAllRegions(dimensions, getCell, options, filter);
  if (regions.length === 0) return null;
  return regions.reduce((a, b) => b.size > a.size ? b : a);
}

/**
 * areConnected: check if two positions belong to the same contiguous region.
 */
export function areConnected(
  pos1: GridPosition,
  pos2: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {}
): boolean {
  const safeGet: CellGetter = (r, c) => {
    const v = getCell(r, c);
    return (v === undefined ? null : v) as CellValue;
  };
  return _areConnected(pos1, pos2, safeGet, toContiguousConfig(dimensions, options));
}

/**
 * getRegionSize: return the size of the region at `pos`. Returns 0 if pos is empty.
 * Note: the test expects getRegionSize for a null/0 cell to return the size of
 * the contiguous null/0 region (since null values form their own regions).
 */
export function getRegionSize(
  pos: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined
): number {
  const region = findRegionAt(pos, dimensions, getCell);
  return region?.size ?? 0;
}

/**
 * isIsolated: return true if `pos` has no same-value neighbors (region size = 1).
 */
export function isIsolated(
  pos: GridPosition,
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {}
): boolean {
  const region = findRegionAt(pos, dimensions, getCell, options);
  return (region?.size ?? 0) === 1;
}

/**
 * countRegions: count distinct regions, optionally filtered by predicate.
 */
export function countRegions(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {},
  filter?: (value: CellValue) => boolean
): number {
  return findAllRegions(dimensions, getCell, options, filter).length;
}

export interface RegionStats {
  count: number;
  totalSize: number;
  minSize: number;
  maxSize: number;
  averageSize: number;
}

/**
 * getRegionStats: compute summary statistics across all regions.
 */
export function getRegionStats(
  dimensions: Dimensions,
  getCell: (row: number, col: number) => CellValue | undefined,
  options: ConnectivityOptions = {},
  filter?: (value: CellValue) => boolean
): RegionStats {
  const regions = findAllRegions(dimensions, getCell, options, filter);

  if (regions.length === 0) {
    return { count: 0, totalSize: 0, minSize: 0, maxSize: 0, averageSize: 0 };
  }

  const sizes = regions.map(r => r.size);
  const totalSize = sizes.reduce((a, b) => a + b, 0);

  return {
    count: regions.length,
    totalSize,
    minSize: Math.min(...sizes),
    maxSize: Math.max(...sizes),
    averageSize: totalSize / regions.length,
  };
}
