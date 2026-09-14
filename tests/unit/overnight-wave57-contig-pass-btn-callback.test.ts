/**
 * Wave 57 leftover after #267 — Contig Pass Turn onPass callback. Tests-only.
 * Distinct from wave53 Pass Turn text-only leftover.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 57 contig — pass btn callback', () => {
  it('Pass Turn click invokes onPass once when no moves', () => {
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
    (el.querySelector('.contig-pass-btn') as HTMLButtonElement).click();
    expect(onPass).toHaveBeenCalledTimes(1);
  });
});
