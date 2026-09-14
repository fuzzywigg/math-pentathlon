/**
 * Overnight HEAVY leftovers after #236 — Contig valid-placement aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — valid aria', () => {
  it('appends valid placement to empty valid cells', () => {
    const el = renderBoard(
      {
        ...createInitialState(),
        currentDice: [1, 2, 3],
        phase: 'calculating',
      },
      () => undefined
    );
    const valid = el.querySelector('.contig-cell-valid');
    expect(valid?.getAttribute('aria-label')).toMatch(/empty, valid placement$/);
  });
});
