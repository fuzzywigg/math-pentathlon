/**
 * Wave 25 — hex contiguous win / block / path scenarios (raw contiguous.ts).
 * Simulates Hex-style connection games without inventing product features.
 * Distinct from wave 21 hex-region smoke and wave 24 N-in-a-row.
 */
import { describe, it, expect } from 'vitest';

import {
  getHexNeighbors,
  findRegion,
  findAllRegions,
  findRegionsForValue,
  getLargestRegion,
  areConnected,
  regionConnectsEdges,
  findPath,
  countRegionsByValue,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
} from '../../src/core/alignment/types';

function empty(size: number): (CellValue | null)[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
}

function setup(board: (CellValue | null)[][]) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const config: ContiguousConfig = { rows, cols };
  const getCell: CellGetter = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
    return board[r][c];
  };
  return { board, getCell, config };
}

function blueWins(
  getCell: CellGetter,
  config: ContiguousConfig
): boolean {
  return findRegionsForValue('B', getCell, config, getHexNeighbors).some(
    (r) => regionConnectsEdges(r, 'top', 'bottom', config)
  );
}

function redWins(
  getCell: CellGetter,
  config: ContiguousConfig
): boolean {
  return findRegionsForValue('R', getCell, config, getHexNeighbors).some(
    (r) => regionConnectsEdges(r, 'left', 'right', config)
  );
}

describe('Wave 25 contig-hex-win — Blue top-bottom', () => {
  it('full left column is Blue win on hex neighbors', () => {
    const board = empty(5);
    for (let r = 0; r < 5; r++) board[r][0] = 'B';
    const { getCell, config } = setup(board);
    expect(blueWins(getCell, config)).toBe(true);
    expect(redWins(getCell, config)).toBe(false);
  });

  it('full right column is Blue win', () => {
    const board = empty(5);
    for (let r = 0; r < 5; r++) board[r][4] = 'B';
    const { getCell, config } = setup(board);
    expect(blueWins(getCell, config)).toBe(true);
  });

  it('broken column with gap is not Blue win', () => {
    const board = empty(5);
    for (let r = 0; r < 5; r++) {
      if (r !== 2) board[r][1] = 'B';
    }
    const { getCell, config } = setup(board);
    expect(blueWins(getCell, config)).toBe(false);
    expect(countRegionsByValue(getCell, config, getHexNeighbors).get('B')).toBe(
      2
    );
  });

  it('gap filled merges and can win', () => {
    const board = empty(5);
    for (let r = 0; r < 5; r++) {
      if (r !== 2) board[r][1] = 'B';
    }
    const { getCell, config, board: b } = setup(board);
    expect(blueWins(getCell, config)).toBe(false);
    b[2][1] = 'B';
    expect(blueWins(getCell, config)).toBe(true);
    expect(getLargestRegion('B', getCell, config, getHexNeighbors)!.size).toBe(
      5
    );
  });
});

describe('Wave 25 contig-hex-win — Red left-right', () => {
  it('full mid row is Red win', () => {
    const board = empty(5);
    for (let c = 0; c < 5; c++) board[2][c] = 'R';
    const { getCell, config } = setup(board);
    expect(redWins(getCell, config)).toBe(true);
    expect(blueWins(getCell, config)).toBe(false);
  });

  it('partial row is not Red win', () => {
    const board = empty(5);
    for (let c = 0; c < 4; c++) board[2][c] = 'R';
    const { getCell, config } = setup(board);
    expect(redWins(getCell, config)).toBe(false);
  });

  it('opponent stone on row blocks Red unless hex path goes around', () => {
    const board = empty(5);
    for (let c = 0; c < 5; c++) board[2][c] = 'R';
    board[2][2] = 'B';
    const { getCell, config } = setup(board);
    // Straight row broken; may or may not have hex bypass on adjacent rows
    const reds = findRegionsForValue('R', getCell, config, getHexNeighbors);
    expect(reds.length).toBeGreaterThanOrEqual(1);
    // With blocker in middle and no bypass stones, should not connect L-R
    expect(redWins(getCell, config)).toBe(false);
  });
});

describe('Wave 25 contig-hex-win — mixed board bookkeeping', () => {
  it('findAllRegions with hex fn accounts for both colors', () => {
    const board = empty(4);
    board[0][0] = 'B';
    board[0][1] = 'B';
    board[1][0] = 'R';
    board[3][3] = 'R';
    const { getCell, config } = setup(board);
    const regions = findAllRegions(getCell, config, getHexNeighbors);
    const blues = regions.filter((r) => r.value === 'B');
    const reds = regions.filter((r) => r.value === 'R');
    expect(blues.reduce((s, r) => s + r.size, 0)).toBe(2);
    expect(reds.reduce((s, r) => s + r.size, 0)).toBe(2);
    expect(reds.length).toBe(2);
  });

  it('areConnected / findPath agree for hex Blue chain', () => {
    const board = empty(5);
    board[0][0] = 'B';
    board[1][0] = 'B';
    board[2][0] = 'B';
    const { getCell, config } = setup(board);
    const start = { row: 0, col: 0 };
    const end = { row: 2, col: 0 };
    expect(
      areConnected(start, end, getCell, config, getHexNeighbors)
    ).toBe(true);
    const path = findPath(start, end, getCell, config, getHexNeighbors);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual(start);
    expect(path![path!.length - 1]).toEqual(end);
  });

  it('empty board has no winners and zero region counts', () => {
    const { getCell, config } = setup(empty(6));
    expect(blueWins(getCell, config)).toBe(false);
    expect(redWins(getCell, config)).toBe(false);
    expect(countRegionsByValue(getCell, config, getHexNeighbors).size).toBe(0);
    expect(findAllRegions(getCell, config, getHexNeighbors)).toEqual([]);
  });

  it('single stone never wins on size>1 board', () => {
    const board = empty(5);
    board[2][2] = 'B';
    const { getCell, config } = setup(board);
    expect(blueWins(getCell, config)).toBe(false);
    expect(findRegion(2, 2, getCell, config, getHexNeighbors)!.size).toBe(1);
  });
});
