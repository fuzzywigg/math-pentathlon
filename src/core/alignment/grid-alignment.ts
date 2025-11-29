/**
 * Grid Alignment Detection
 * N-in-a-row detection for standard rectangular grids
 */

import type {
  Position,
  Direction,
  AlignmentConfig,
  AlignmentResult,
  AlignmentSearchResult,
  GridAccessor,
  GridDimensions,
  CellMatcher,
} from './types';
import { DIRECTION_VECTORS, DEFAULT_ALIGNMENT_CONFIG } from './types';

/**
 * Check if a position is within grid bounds
 */
export function isInBounds(
  pos: Position,
  dimensions: GridDimensions,
  config?: Pick<AlignmentConfig, 'wrapHorizontal' | 'wrapVertical'>
): boolean {
  if (config?.wrapHorizontal && config?.wrapVertical) {
    return true; // All positions valid with full wrapping
  }

  const rowValid = config?.wrapVertical || (pos.row >= 0 && pos.row < dimensions.rows);
  const colValid = config?.wrapHorizontal || (pos.col >= 0 && pos.col < dimensions.cols);

  return rowValid && colValid;
}

/**
 * Normalize a position for wrapping grids
 */
export function normalizePosition(
  pos: Position,
  dimensions: GridDimensions,
  config?: Pick<AlignmentConfig, 'wrapHorizontal' | 'wrapVertical'>
): Position {
  let { row, col } = pos;

  if (config?.wrapVertical) {
    row = ((row % dimensions.rows) + dimensions.rows) % dimensions.rows;
  }
  if (config?.wrapHorizontal) {
    col = ((col % dimensions.cols) + dimensions.cols) % dimensions.cols;
  }

  return { row, col };
}

/**
 * Get positions in a line starting from a position in a direction
 */
export function getLinePositions(
  start: Position,
  direction: Direction,
  length: number,
  dimensions: GridDimensions,
  config?: Pick<AlignmentConfig, 'wrapHorizontal' | 'wrapVertical'>
): Position[] | null {
  const vector = DIRECTION_VECTORS[direction];
  const positions: Position[] = [];

  for (let i = 0; i < length; i++) {
    const pos: Position = {
      row: start.row + vector.row * i,
      col: start.col + vector.col * i,
    };

    const normalized = normalizePosition(pos, dimensions, config);

    if (!isInBounds(normalized, dimensions, config)) {
      return null; // Line goes out of bounds
    }

    positions.push(normalized);
  }

  return positions;
}

/**
 * Check if a specific line forms an alignment (all same non-null value)
 */
export function checkLineAlignment<T>(
  positions: Position[],
  getCell: GridAccessor<T>,
  matcher?: CellMatcher<T>
): { isAligned: boolean; value: T | undefined } {
  if (positions.length === 0) {
    return { isAligned: false, value: undefined };
  }

  const firstValue = getCell(positions[0].row, positions[0].col);

  // Empty cells don't count as alignment
  if (firstValue === null || firstValue === undefined) {
    return { isAligned: false, value: undefined };
  }

  // Check if custom matcher rejects the first value
  if (matcher && !matcher(firstValue, positions[0].row, positions[0].col)) {
    return { isAligned: false, value: undefined };
  }

  // Check all positions have the same value
  for (let i = 1; i < positions.length; i++) {
    const value = getCell(positions[i].row, positions[i].col);

    if (value === null || value === undefined) {
      return { isAligned: false, value: undefined };
    }

    if (matcher && !matcher(value, positions[i].row, positions[i].col)) {
      return { isAligned: false, value: undefined };
    }

    // Compare values (handles primitives and objects with equality)
    if (value !== firstValue) {
      // For objects, try JSON comparison
      if (typeof value === 'object' && typeof firstValue === 'object') {
        if (JSON.stringify(value) !== JSON.stringify(firstValue)) {
          return { isAligned: false, value: undefined };
        }
      } else {
        return { isAligned: false, value: undefined };
      }
    }
  }

  return { isAligned: true, value: firstValue };
}

/**
 * Find an alignment starting from a specific position in a specific direction
 */
export function findAlignmentAt<T>(
  start: Position,
  direction: Direction,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: AlignmentConfig = DEFAULT_ALIGNMENT_CONFIG,
  matcher?: CellMatcher<T>
): AlignmentResult | null {
  const positions = getLinePositions(start, direction, config.requiredLength, dimensions, config);

  if (!positions) {
    return null;
  }

  const { isAligned, value } = checkLineAlignment(positions, getCell, matcher);

  if (!isAligned) {
    return null;
  }

  return {
    found: true,
    positions,
    direction,
    value,
  };
}

/**
 * Find all alignments on the grid
 */
export function findAllAlignments<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: AlignmentConfig = DEFAULT_ALIGNMENT_CONFIG,
  matcher?: CellMatcher<T>
): AlignmentSearchResult {
  const alignments: AlignmentResult[] = [];
  const directions = config.directions || DEFAULT_ALIGNMENT_CONFIG.directions!;

  // Check every starting position
  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.cols; col++) {
      const start: Position = { row, col };

      for (const direction of directions) {
        const result = findAlignmentAt(start, direction, dimensions, getCell, config, matcher);
        if (result) {
          alignments.push(result);
        }
      }
    }
  }

  return {
    alignments,
    hasAlignment: alignments.length > 0,
  };
}

/**
 * Check if there's any alignment on the grid (early exit on first find)
 */
export function hasAlignment<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: AlignmentConfig = DEFAULT_ALIGNMENT_CONFIG,
  matcher?: CellMatcher<T>
): boolean {
  const directions = config.directions || DEFAULT_ALIGNMENT_CONFIG.directions!;

  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.cols; col++) {
      const start: Position = { row, col };

      for (const direction of directions) {
        const result = findAlignmentAt(start, direction, dimensions, getCell, config, matcher);
        if (result) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Find alignments containing a specific position
 * Useful for checking if a move creates a winning condition
 */
export function findAlignmentsThrough<T>(
  position: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: AlignmentConfig = DEFAULT_ALIGNMENT_CONFIG,
  matcher?: CellMatcher<T>
): AlignmentSearchResult {
  const alignments: AlignmentResult[] = [];
  const directions = config.directions || DEFAULT_ALIGNMENT_CONFIG.directions!;
  const length = config.requiredLength;

  for (const direction of directions) {
    const vector = DIRECTION_VECTORS[direction];

    // Check all possible starting positions that would include our target position
    for (let offset = 0; offset < length; offset++) {
      const start: Position = {
        row: position.row - vector.row * offset,
        col: position.col - vector.col * offset,
      };

      const normalized = normalizePosition(start, dimensions, config);
      const result = findAlignmentAt(normalized, direction, dimensions, getCell, config, matcher);

      if (result) {
        // Verify the alignment actually contains our position
        const containsPosition = result.positions.some(
          (p) => p.row === position.row && p.col === position.col
        );
        if (containsPosition) {
          alignments.push(result);
        }
      }
    }
  }

  // Remove duplicates (same positions)
  const unique = alignments.filter(
    (alignment, index, self) =>
      index ===
      self.findIndex(
        (a) =>
          a.direction === alignment.direction &&
          a.positions[0].row === alignment.positions[0].row &&
          a.positions[0].col === alignment.positions[0].col
      )
  );

  return {
    alignments: unique,
    hasAlignment: unique.length > 0,
  };
}

/**
 * Count how many cells are aligned in each direction from a position
 * Returns the maximum consecutive count in any direction
 */
export function countMaxAligned<T>(
  position: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config?: Pick<AlignmentConfig, 'directions' | 'wrapHorizontal' | 'wrapVertical'>,
  matcher?: CellMatcher<T>
): { direction: Direction; count: number; positions: Position[] } {
  const directions = config?.directions || (['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'] as Direction[]);
  const targetValue = getCell(position.row, position.col);

  if (targetValue === null || targetValue === undefined) {
    return { direction: 'horizontal', count: 0, positions: [] };
  }

  let maxResult = { direction: 'horizontal' as Direction, count: 0, positions: [] as Position[] };

  for (const direction of directions) {
    const vector = DIRECTION_VECTORS[direction];
    const positions: Position[] = [position];

    // Count forward
    let pos = { row: position.row + vector.row, col: position.col + vector.col };
    while (isInBounds(pos, dimensions, config)) {
      const normalized = normalizePosition(pos, dimensions, config);
      const value = getCell(normalized.row, normalized.col);

      if (value === null || value === undefined || value !== targetValue) {
        break;
      }
      if (matcher && !matcher(value, normalized.row, normalized.col)) {
        break;
      }

      positions.push(normalized);
      pos = { row: pos.row + vector.row, col: pos.col + vector.col };
    }

    // Count backward
    pos = { row: position.row - vector.row, col: position.col - vector.col };
    while (isInBounds(pos, dimensions, config)) {
      const normalized = normalizePosition(pos, dimensions, config);
      const value = getCell(normalized.row, normalized.col);

      if (value === null || value === undefined || value !== targetValue) {
        break;
      }
      if (matcher && !matcher(value, normalized.row, normalized.col)) {
        break;
      }

      positions.unshift(normalized);
      pos = { row: pos.row - vector.row, col: pos.col - vector.col };
    }

    if (positions.length > maxResult.count) {
      maxResult = { direction, count: positions.length, positions };
    }
  }

  return maxResult;
}

/**
 * Helper to create a grid accessor from a 2D array
 */
export function createArrayAccessor<T>(grid: T[][]): GridAccessor<T> {
  return (row: number, col: number): T | undefined => {
    if (row < 0 || row >= grid.length) return undefined;
    if (col < 0 || col >= grid[row].length) return undefined;
    return grid[row][col];
  };
}

/**
 * Helper to get dimensions from a 2D array
 */
export function getArrayDimensions<T>(grid: T[][]): GridDimensions {
  return {
    rows: grid.length,
    cols: grid.length > 0 ? grid[0].length : 0,
  };
}
