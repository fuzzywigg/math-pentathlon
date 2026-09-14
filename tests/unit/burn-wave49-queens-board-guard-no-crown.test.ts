/**
 * Wave 49 — Queens guards omit crown leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — guard chrome', () => {
  it('guard cell has circle but no crown text', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const key = cellKey(outer, 1);
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector(`[data-cell-key="${key}"]`)!;
    expect(g.querySelector('circle')).toBeTruthy();
    expect([...g.querySelectorAll('text')].some((t) => t.textContent === '♛')).toBe(false);
  });
});
