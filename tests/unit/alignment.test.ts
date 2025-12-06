/**
 * Alignment System Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  // Types and constants
  DIRECTION_VECTORS,
  CARDINAL_DIRECTIONS,
  ALL_DIRECTIONS,
  // Grid alignment
  isInBounds,
  normalizePosition,
  getLinePositions,
  checkLineAlignment,
  findAlignmentAt,
  findAllAlignments,
  hasAlignment,
  findAlignmentsThrough,
  countMaxAligned,
  createArrayAccessor,
  getArrayDimensions,
  // Contiguous
  getNeighbors,
  findRegionAt,
  findAllRegions,
  findLargestRegion,
  areConnected,
  getRegionSize,
  isIsolated,
  countRegions,
  getRegionStats,
} from '../../src/core/alignment';

describe('Direction Constants', () => {
  it('should have correct direction vectors', () => {
    expect(DIRECTION_VECTORS.horizontal).toEqual({ row: 0, col: 1 });
    expect(DIRECTION_VECTORS.vertical).toEqual({ row: 1, col: 0 });
    expect(DIRECTION_VECTORS['diagonal-down']).toEqual({ row: 1, col: 1 });
    expect(DIRECTION_VECTORS['diagonal-up']).toEqual({ row: -1, col: 1 });
  });

  it('should have correct number of directions', () => {
    expect(CARDINAL_DIRECTIONS).toHaveLength(4);
    expect(ALL_DIRECTIONS).toHaveLength(8);
  });
});

describe('isInBounds', () => {
  const dimensions = { rows: 5, cols: 5 };

  it('should return true for valid positions', () => {
    expect(isInBounds({ row: 0, col: 0 }, dimensions)).toBe(true);
    expect(isInBounds({ row: 2, col: 2 }, dimensions)).toBe(true);
    expect(isInBounds({ row: 4, col: 4 }, dimensions)).toBe(true);
  });

  it('should return false for out of bounds positions', () => {
    expect(isInBounds({ row: -1, col: 0 }, dimensions)).toBe(false);
    expect(isInBounds({ row: 0, col: -1 }, dimensions)).toBe(false);
    expect(isInBounds({ row: 5, col: 0 }, dimensions)).toBe(false);
    expect(isInBounds({ row: 0, col: 5 }, dimensions)).toBe(false);
  });

  it('should handle wrapping', () => {
    expect(isInBounds({ row: -1, col: 0 }, dimensions, { wrapVertical: true })).toBe(true);
    expect(isInBounds({ row: 0, col: -1 }, dimensions, { wrapHorizontal: true })).toBe(true);
  });
});

describe('normalizePosition', () => {
  const dimensions = { rows: 5, cols: 5 };

  it('should not modify in-bounds positions without wrapping', () => {
    expect(normalizePosition({ row: 2, col: 3 }, dimensions)).toEqual({ row: 2, col: 3 });
  });

  it('should wrap positions with vertical wrapping', () => {
    expect(normalizePosition({ row: -1, col: 0 }, dimensions, { wrapVertical: true })).toEqual({
      row: 4,
      col: 0,
    });
    expect(normalizePosition({ row: 6, col: 0 }, dimensions, { wrapVertical: true })).toEqual({
      row: 1,
      col: 0,
    });
  });

  it('should wrap positions with horizontal wrapping', () => {
    expect(normalizePosition({ row: 0, col: -1 }, dimensions, { wrapHorizontal: true })).toEqual({
      row: 0,
      col: 4,
    });
    expect(normalizePosition({ row: 0, col: 7 }, dimensions, { wrapHorizontal: true })).toEqual({
      row: 0,
      col: 2,
    });
  });
});

describe('getLinePositions', () => {
  const dimensions = { rows: 5, cols: 5 };

  it('should return horizontal line positions', () => {
    const positions = getLinePositions({ row: 0, col: 0 }, 'horizontal', 4, dimensions);
    expect(positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ]);
  });

  it('should return vertical line positions', () => {
    const positions = getLinePositions({ row: 0, col: 0 }, 'vertical', 3, dimensions);
    expect(positions).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ]);
  });

  it('should return diagonal-down line positions', () => {
    const positions = getLinePositions({ row: 0, col: 0 }, 'diagonal-down', 3, dimensions);
    expect(positions).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ]);
  });

  it('should return null if line goes out of bounds', () => {
    const positions = getLinePositions({ row: 0, col: 3 }, 'horizontal', 4, dimensions);
    expect(positions).toBeNull();
  });
});

describe('checkLineAlignment', () => {
  it('should detect alignment of same values', () => {
    const grid = [
      ['X', 'X', 'X', 'X'],
      ['O', 'O', null, null],
    ];
    const getCell = createArrayAccessor(grid);

    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
      ],
      getCell
    );

    expect(result.isAligned).toBe(true);
    expect(result.value).toBe('X');
  });

  it('should not detect alignment with different values', () => {
    const grid = [['X', 'X', 'O', 'X']];
    const getCell = createArrayAccessor(grid);

    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
      ],
      getCell
    );

    expect(result.isAligned).toBe(false);
  });

  it('should not detect alignment with null values', () => {
    const grid = [[null, null, null, null]];
    const getCell = createArrayAccessor(grid);

    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
      ],
      getCell
    );

    expect(result.isAligned).toBe(false);
  });
});

describe('findAlignmentAt', () => {
  it('should find horizontal alignment', () => {
    const grid = [
      ['X', 'X', 'X', 'X', null],
      [null, null, null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = findAlignmentAt({ row: 0, col: 0 }, 'horizontal', dimensions, getCell, {
      requiredLength: 4,
    });

    expect(result).not.toBeNull();
    expect(result?.positions).toHaveLength(4);
    expect(result?.direction).toBe('horizontal');
    expect(result?.value).toBe('X');
  });

  it('should return null when no alignment', () => {
    const grid = [
      ['X', 'O', 'X', 'X', null],
      [null, null, null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = findAlignmentAt({ row: 0, col: 0 }, 'horizontal', dimensions, getCell, {
      requiredLength: 4,
    });

    expect(result).toBeNull();
  });
});

describe('findAllAlignments', () => {
  it('should find all alignments on the grid', () => {
    // Connect Four style grid with a win
    const grid = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, 'X', null, null, null],
      [null, null, 'X', 'O', null, null, null],
      [null, 'X', 'O', 'O', null, null, null],
      ['X', 'O', 'O', 'O', null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = findAllAlignments(dimensions, getCell, { requiredLength: 4 });

    expect(result.hasAlignment).toBe(true);
    // Should find the diagonal X alignment
    const xAlignments = result.alignments.filter((a) => a.value === 'X');
    expect(xAlignments.length).toBeGreaterThan(0);
  });

  it('should return empty when no alignments', () => {
    const grid = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = findAllAlignments(dimensions, getCell, { requiredLength: 3 });

    // The diagonal has X-X-X? Let's check
    // Actually (0,0)=X, (1,1)=X, (2,2)=O so no diagonal
    // But (0,2)=X, (1,1)=X, (2,0)=O so no
    expect(result.hasAlignment).toBe(false);
  });
});

describe('hasAlignment', () => {
  it('should return true when alignment exists', () => {
    const grid = [
      ['X', 'X', 'X'],
      [null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(hasAlignment(dimensions, getCell, { requiredLength: 3 })).toBe(true);
  });

  it('should return false when no alignment exists', () => {
    const grid = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(hasAlignment(dimensions, getCell, { requiredLength: 3 })).toBe(false);
  });
});

describe('findAlignmentsThrough', () => {
  it('should find alignments containing a specific position', () => {
    const grid = [
      ['X', 'X', 'X', 'X'],
      [null, null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = findAlignmentsThrough({ row: 0, col: 2 }, dimensions, getCell, {
      requiredLength: 4,
    });

    expect(result.hasAlignment).toBe(true);
    expect(result.alignments).toHaveLength(1);
  });
});

describe('countMaxAligned', () => {
  it('should count maximum consecutive aligned cells', () => {
    const grid = [
      [null, 'X', null],
      [null, 'X', null],
      [null, 'X', null],
      [null, 'X', null],
      [null, null, null],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const result = countMaxAligned({ row: 2, col: 1 }, dimensions, getCell);

    expect(result.count).toBe(4);
    expect(result.direction).toBe('vertical');
    expect(result.positions).toHaveLength(4);
  });
});

// Contiguous Region Tests
describe('getNeighbors', () => {
  const dimensions = { rows: 3, cols: 3 };

  it('should return 4 neighbors for center cell (4-connected)', () => {
    const neighbors = getNeighbors({ row: 1, col: 1 }, dimensions, 4);
    expect(neighbors).toHaveLength(4);
  });

  it('should return 8 neighbors for center cell (8-connected)', () => {
    const neighbors = getNeighbors({ row: 1, col: 1 }, dimensions, 8);
    expect(neighbors).toHaveLength(8);
  });

  it('should return fewer neighbors for corner cells', () => {
    const neighbors4 = getNeighbors({ row: 0, col: 0 }, dimensions, 4);
    expect(neighbors4).toHaveLength(2);

    const neighbors8 = getNeighbors({ row: 0, col: 0 }, dimensions, 8);
    expect(neighbors8).toHaveLength(3);
  });
});

describe('findRegionAt', () => {
  it('should find a contiguous region', () => {
    const grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const region = findRegionAt({ row: 0, col: 0 }, dimensions, getCell);

    expect(region).not.toBeNull();
    expect(region?.size).toBe(4);
    expect(region?.value).toBe(1);
  });

  it('should return null for empty cell', () => {
    const grid = [
      [null, 1],
      [1, 1],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const region = findRegionAt({ row: 0, col: 0 }, dimensions, getCell);

    expect(region).toBeNull();
  });

  it('should respect 4-connectivity', () => {
    const grid = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    // Center cell should be isolated in 4-connectivity
    const region = findRegionAt({ row: 1, col: 1 }, dimensions, getCell, { connectivity: 4 });

    expect(region?.size).toBe(1);
  });

  it('should connect diagonals in 8-connectivity', () => {
    const grid = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    // All 1s should be connected in 8-connectivity
    const region = findRegionAt({ row: 1, col: 1 }, dimensions, getCell, { connectivity: 8 });

    expect(region?.size).toBe(5);
  });
});

describe('findAllRegions', () => {
  it('should find all distinct regions', () => {
    const grid = [
      [1, 1, 0, 2, 2],
      [1, 0, 0, 2, 2],
      [0, 0, 0, 0, 0],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    // Only count non-zero regions
    const regions = findAllRegions(dimensions, getCell, { connectivity: 4 }, (v) => v !== 0);

    expect(regions).toHaveLength(2); // One region of 1s, one region of 2s
  });
});

describe('findLargestRegion', () => {
  it('should find the largest region', () => {
    const grid = [
      [1, 1, 0, 2],
      [1, 1, 0, 2],
      [1, 1, 0, 2],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const largest = findLargestRegion(dimensions, getCell, { connectivity: 4 }, (v) => v !== 0);

    expect(largest?.value).toBe(1);
    expect(largest?.size).toBe(6);
  });
});

describe('areConnected', () => {
  it('should return true for connected positions', () => {
    const grid = [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(areConnected({ row: 0, col: 0 }, { row: 2, col: 2 }, dimensions, getCell)).toBe(true);
  });

  it('should return false for disconnected positions', () => {
    const grid = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 2 }, dimensions, getCell, { connectivity: 4 })
    ).toBe(false);
  });
});

describe('getRegionSize', () => {
  it('should return correct region size', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(getRegionSize({ row: 0, col: 0 }, dimensions, getCell)).toBe(5);
    expect(getRegionSize({ row: 2, col: 2 }, dimensions, getCell)).toBe(4); // The 0 region
  });
});

describe('isIsolated', () => {
  it('should detect isolated cells', () => {
    const grid = [
      [1, 0, 2],
      [0, 3, 0],
      [4, 0, 5],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(isIsolated({ row: 1, col: 1 }, dimensions, getCell, { connectivity: 4 })).toBe(true);
  });

  it('should return false for non-isolated cells', () => {
    const grid = [
      [1, 1, 0],
      [0, 0, 0],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(isIsolated({ row: 0, col: 0 }, dimensions, getCell)).toBe(false);
  });
});

describe('countRegions', () => {
  it('should count distinct regions', () => {
    const grid = [
      [1, 0, 2],
      [0, 0, 0],
      [3, 0, 4],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    // Count non-zero regions (4 single cells)
    const count = countRegions(dimensions, getCell, { connectivity: 4 }, (v) => v !== 0);
    expect(count).toBe(4);
  });
});

describe('getRegionStats', () => {
  it('should calculate correct statistics', () => {
    const grid = [
      [1, 1, 0, 2, 2, 2],
      [1, 0, 0, 2, 2, 2],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    const stats = getRegionStats(dimensions, getCell, { connectivity: 4 }, (v) => v !== 0);

    expect(stats.count).toBe(2);
    expect(stats.totalSize).toBe(9); // 3 ones + 6 twos
    expect(stats.minSize).toBe(3);
    expect(stats.maxSize).toBe(6);
    expect(stats.averageSize).toBe(4.5);
  });
});

describe('createArrayAccessor and getArrayDimensions', () => {
  it('should create working accessor and dimensions', () => {
    const grid = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const getCell = createArrayAccessor(grid);
    const dimensions = getArrayDimensions(grid);

    expect(dimensions).toEqual({ rows: 2, cols: 3 });
    expect(getCell(0, 0)).toBe(1);
    expect(getCell(1, 2)).toBe(6);
    expect(getCell(-1, 0)).toBeUndefined();
    expect(getCell(0, 5)).toBeUndefined();
  });
});
