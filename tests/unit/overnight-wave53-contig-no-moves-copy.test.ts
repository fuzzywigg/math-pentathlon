/**
 * Overnight HEAVY leftovers after #236 — Contig no-moves copy leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — no-moves copy', () => {
  it('shows Pass Turn chrome when every cell is owned', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    const el = renderExpressionSelector(
      {
        ...base,
        cells,
        phase: 'calculating',
        currentDice: [1, 1, 1],
      },
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('.contig-no-moves p')?.textContent).toBe(
      'No valid moves with these dice!'
    );
    expect(el.querySelector('.contig-pass-btn')?.textContent).toBe('Pass Turn');
    expect(el.querySelector('.contig-expr-option')).toBeNull();
  });
});
