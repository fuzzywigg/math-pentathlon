/**
 * Wave 56 leftover after #243 — Contig owned cell aria Red residual.
 * Blue aria covered in wave53; Red seat label was not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 56 contig — owned aria Red', () => {
  it('labels a Red-owned cell with seat name', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[0]![3]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player2' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    expect(el.querySelector(`[data-value="${value}"]`)?.getAttribute('aria-label')).toBe(
      `${value}, Red`
    );
  });
});
