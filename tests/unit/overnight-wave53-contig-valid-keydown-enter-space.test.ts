/**
 * Overnight HEAVY leftovers after #236 — Contig valid cell Enter/Space. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — valid keydown', () => {
  it('Enter and Space on a valid cell fire onCellClick', () => {
    const state = {
      ...createInitialState(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const valid = el.querySelector('.contig-cell-valid') as HTMLElement;
    const value = Number(valid.dataset.value);

    valid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(value);

    onClick.mockClear();
    valid.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(value);
  });
});
