/**
 * Overnight HEAVY leftovers after #236 — Contig valid cell click value. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — valid click', () => {
  it('clicks .contig-cell-valid with the cell number', () => {
    const dice: [number, number, number] = [1, 2, 3];
    const state = {
      ...createInitialState(),
      currentDice: dice,
      phase: 'calculating' as const,
    };
    expect(getValidPlacements(state, dice).length).toBeGreaterThan(0);
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const valid = el.querySelector('.contig-cell-valid') as HTMLElement;
    expect(valid).toBeTruthy();
    valid.click();
    expect(onClick).toHaveBeenCalledWith(Number(valid.dataset.value));
  });
});
