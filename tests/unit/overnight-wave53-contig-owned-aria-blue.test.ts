/**
 * Overnight HEAVY leftovers after #236 — Contig owned cell aria Blue. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — owned aria', () => {
  it('labels a Blue-owned cell with seat name', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[0]![2]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player1' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    expect(el.querySelector(`[data-value="${value}"]`)?.getAttribute('aria-label')).toBe(
      `${value}, Blue`
    );
  });
});
