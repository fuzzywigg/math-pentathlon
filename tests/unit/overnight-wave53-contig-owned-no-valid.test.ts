/**
 * Overnight HEAVY leftovers after #236 — Contig owned cells skip valid class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — owned skips valid', () => {
  it('does not mark an owned result as contig-cell-valid', () => {
    const dice: [number, number, number] = [1, 2, 3];
    const base = {
      ...createInitialState(),
      currentDice: dice,
      phase: 'calculating' as const,
    };
    const hit = getValidPlacements(base, dice)[0];
    expect(hit).toBeTruthy();
    const cells = new Map(base.cells);
    cells.set(hit!.result, { ...cells.get(hit!.result)!, owner: 'player1' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    const cell = el.querySelector(`[data-value="${hit!.result}"]`);
    expect(cell?.classList.contains('contig-cell-p1')).toBe(true);
    expect(cell?.classList.contains('contig-cell-valid')).toBe(false);
  });
});
