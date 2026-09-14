/**
 * Wave 49 — Queens selected piece orange stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — selected stroke', () => {
  it('marks selected cell stroke orange width 3', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const key = cellKey(outer, 7);
    const s = { ...createInitialState(), selectedPiece: key };
    const svg = renderBoard(s, () => undefined);
    const g = svg.querySelector(`[data-cell-key="${key}"]`)!;
    const hex = g.querySelector('path')!;
    expect(hex.getAttribute('stroke')).toBe('#ff9800');
    expect(hex.getAttribute('stroke-width')).toBe('3');
    expect(g.getAttribute('aria-label') || '').toMatch(/selected/i);
  });
});
