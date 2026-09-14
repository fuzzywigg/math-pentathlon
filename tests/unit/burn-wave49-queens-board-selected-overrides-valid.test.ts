/**
 * Wave 49 — Queens selected stroke overrides valid fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — selected overrides', () => {
  it('keeps orange stroke on selected even when also listed valid', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const key = cellKey(outer, 7);
    const s = { ...createInitialState(), selectedPiece: key };
    const svg = renderBoard(s, () => undefined);
    const hex = svg.querySelector(`[data-cell-key="${key}"] path`)!;
    expect(hex.getAttribute('stroke')).toBe('#ff9800');
    expect(hex.getAttribute('stroke-width')).toBe('3');
  });
});
