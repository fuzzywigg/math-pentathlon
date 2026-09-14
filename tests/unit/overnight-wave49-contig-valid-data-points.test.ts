/**
 * Wave 49 — Contig data-points on scoring valids leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getAdjacentPositions,
  BOARD_NUMBERS,
} from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 49 contig — valid data-points', () => {
  it('stamps data-points when adjacent owned cell scores', () => {
    const base = createInitialState();
    const seedValue = BOARD_NUMBERS[0]![0]!;
    const adj = getAdjacentPositions(0, 0)[0]!;
    const targetValue = BOARD_NUMBERS[adj.row]![adj.col]!;

    const cells = new Map(base.cells);
    const seedCell = cells.get(seedValue)!;
    cells.set(seedValue, { ...seedCell, owner: 'player1' });

    const state = {
      ...base,
      cells,
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
    };

    expect(calculatePoints(state, targetValue)).toBeGreaterThan(0);

    let found = false;
    for (let a = 1; a <= 6 && !found; a++) {
      for (let b = 1; b <= 6 && !found; b++) {
        for (let c = 1; c <= 6 && !found; c++) {
          const trial = {
            ...state,
            currentDice: [a, b, c] as [number, number, number],
          };
          const rendered = renderBoard(trial, () => undefined);
          const hit = rendered.querySelector(
            `.contig-cell-valid[data-value="${targetValue}"][data-points]`
          );
          if (hit) {
            expect(hit.getAttribute('data-points')).toMatch(/^\+/);
            found = true;
          }
        }
      }
    }
    expect(found).toBe(true);
  });
});
