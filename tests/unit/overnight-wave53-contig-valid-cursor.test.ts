/**
 * Overnight HEAVY leftovers after #236 — Contig valid cursor leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — valid cursor', () => {
  it('sets pointer cursor only on valid calculating cells', () => {
    const el = renderBoard(
      {
        ...createInitialState(),
        currentDice: [1, 2, 3],
        phase: 'calculating',
      },
      () => undefined
    );
    const valid = el.querySelector('.contig-cell-valid') as HTMLElement;
    const empty = el.querySelector('.contig-cell:not(.contig-cell-valid)') as HTMLElement;
    expect(valid.style.cursor).toBe('pointer');
    expect(empty.style.cursor).not.toBe('pointer');
  });
});
