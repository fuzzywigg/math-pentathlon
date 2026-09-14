/**
 * Wave 57 leftover after #267 — Contig valid click only in calculating phase.
 * Distinct from wave53 opening-no-valid (null dice). Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 57 contig — valid only calculating', () => {
  it('dice present but rolling phase: no pointer activate', () => {
    const onClick = vi.fn();
    const el = renderBoard(
      {
        ...createInitialState(),
        currentDice: [1, 2, 3],
        phase: 'rolling',
      },
      onClick
    );
    const marked = el.querySelector('.contig-cell-valid') as HTMLElement | null;
    expect(marked).toBeTruthy();
    expect(marked!.style.cursor).not.toBe('pointer');
    marked!.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
