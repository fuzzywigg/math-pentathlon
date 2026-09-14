/**
 * Wave 59 Contig/SD residual — Contig no-moves panel copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — no-moves copy', () => {
  it('shows No valid moves with these dice! when jammed', () => {
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
  });
});
