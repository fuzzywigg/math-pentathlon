/**
 * Wave 59 Contig/SD residual — Contig owned Blue aria. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — owned Blue aria', () => {
  it('owned player1 cell aria includes Blue', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    const cell = cells.get(1)!;
    cells.set(1, { ...cell, owner: 'player1' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    const owned = el.querySelector('.contig-cell-p1') as HTMLElement;
    expect(owned.getAttribute('aria-label') || '').toMatch(/Blue/);
  });
});
