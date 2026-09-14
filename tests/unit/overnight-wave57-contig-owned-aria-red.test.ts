/**
 * Wave 57 leftover after #267 — Contig owned cell aria Red. Tests-only.
 * Distinct from wave53 Blue-owned aria.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 57 contig — owned aria Red', () => {
  it('labels a Red-owned cell with seat name', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[0]![2]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player2' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    expect(el.querySelector(`[data-value="${value}"]`)?.getAttribute('aria-label')).toBe(
      `${value}, Red`
    );
  });
});
