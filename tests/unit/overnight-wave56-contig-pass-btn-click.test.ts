/**
 * Wave 56 leftover after #243 — Contig pass button click residual.
 * Copy covered in wave53; onPass wiring was not. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 56 contig — pass btn click', () => {
  it('invokes onPass once from .contig-pass-btn', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    const onPass = vi.fn();
    const el = renderExpressionSelector(
      {
        ...base,
        cells,
        phase: 'calculating',
        currentDice: [1, 1, 1],
      },
      () => undefined,
      onPass
    );
    el.querySelector('.contig-pass-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(onPass).toHaveBeenCalledTimes(1);
  });
});
