/**
 * Overnight HEAVY leftovers after #236 — Contig expr-points adjacent leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BOARD_NUMBERS,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — expr points', () => {
  it('shows +N pts when a listed result is adjacent to an owned chip', () => {
    const base = createInitialState();
    const seedValue = BOARD_NUMBERS[0]![0]!;
    const adj = getAdjacentPositions(0, 0)[0]!;
    const targetValue = BOARD_NUMBERS[adj.row]![adj.col]!;
    const cells = new Map(base.cells);
    cells.set(seedValue, { ...cells.get(seedValue)!, owner: 'player1' });

    let found = false;
    for (let a = 1; a <= 6 && !found; a++) {
      for (let b = 1; b <= 6 && !found; b++) {
        for (let c = 1; c <= 6 && !found; c++) {
          const trial = {
            ...base,
            cells,
            phase: 'calculating' as const,
            currentDice: [a, b, c] as [number, number, number],
          };
          if (calculatePoints(trial, targetValue) <= 0) continue;
          const el = renderExpressionSelector(trial, () => undefined, () => undefined);
          const option = [...el.querySelectorAll('.contig-expr-option')].find(
            (opt) => opt.querySelector('.expr-result')?.textContent === String(targetValue)
          );
          const pts = option?.querySelector('.expr-points')?.textContent ?? '';
          if (pts.startsWith('+')) {
            expect(pts).toMatch(/^\+\d+ pts?$/);
            found = true;
          }
        }
      }
    }
    expect(found).toBe(true);
  });
});
