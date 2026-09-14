/**
 * Wave 41 — Contig 60 expression / valid-placement leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getAllPossibleResults,
  getValidPlacements,
  getAdjacentPositions,
  BOARD_NUMBERS,
  createBoard,
  getOpponent,
  CONFIG,
} from '../../src/games/contig-60/types';
import type { ContigState, Player } from '../../src/games/contig-60/types';

function claim(
  state: ContigState,
  values: number[],
  owner: Player
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    const cell = cells.get(value)!;
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

describe('Wave 41 Contig — expression matrices', () => {
  it.each([
    [[1, 1, 1], [1, 2, 3]],
    [[2, 3, 4], [24, 9, 5]],
    [[6, 6, 6], [216, 18, 6]],
    [[1, 2, 3], [6, 5, 1]],
  ] as const)('dice %j yields integer results including %j samples', (dice, samples) => {
    const results = getAllPossibleResults([...dice] as [number, number, number]);
    const values = results.map((r) => r.result);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => Number.isInteger(r.result) && r.result > 0)).toBe(
      true
    );
    for (const s of samples) {
      expect(values).toContain(s);
    }
  });

  it('division-only paths stay integer; duplicate results collapse to one expression', () => {
    const results = getAllPossibleResults([2, 2, 4]);
    const byResult = new Map(results.map((r) => [r.result, r.expression]));
    expect(byResult.size).toBe(results.length);
    expect(results.every((r) => typeof r.expression === 'string')).toBe(true);
    expect(byResult.has(1) || byResult.has(2) || byResult.has(8)).toBe(true);
  });
});

describe('Wave 41 Contig — valid placements / adjacency', () => {
  it('filters owned cells and off-board numbers', () => {
    let state = createInitialState();
    const dice: [number, number, number] = [2, 3, 4];
    const before = getValidPlacements(state, dice).map((p) => p.result);
    expect(before.length).toBeGreaterThan(0);
    state = claim(state, before.slice(0, Math.min(3, before.length)), 'player2');
    const after = getValidPlacements(state, dice).map((p) => p.result);
    for (const taken of before.slice(0, Math.min(3, before.length))) {
      expect(after).not.toContain(taken);
    }
  });

  it('empty dice-reachable set when every matching cell owned', () => {
    const dice: [number, number, number] = [1, 1, 1];
    let state = createInitialState();
    const all = getValidPlacements(state, dice).map((p) => p.result);
    state = claim(state, all, 'player1');
    expect(getValidPlacements(state, dice)).toEqual([]);
  });

  it('BOARD_NUMBERS / createBoard / getOpponent / edge adjacency matrix', () => {
    expect(BOARD_NUMBERS).toHaveLength(CONFIG.GRID_ROWS);
    expect(BOARD_NUMBERS[0]).toHaveLength(CONFIG.GRID_COLS);
    const { cells, grid } = createBoard();
    expect(cells.size).toBe(60);
    expect(grid[0][0]).toBe(1);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getAdjacentPositions(0, 0)).toHaveLength(3);
    expect(getAdjacentPositions(5, 9)).toHaveLength(3);
    expect(getAdjacentPositions(2, 4)).toHaveLength(8);
  });
});
