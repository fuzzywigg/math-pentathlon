/**
 * Wave 49 — Queens renderBoard queen crown leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — queen crown', () => {
  it('draws crown glyph on both queens', () => {
    const s = createInitialState();
    const svg = renderBoard(s, () => undefined);
    const crowns = [...svg.querySelectorAll('text')].filter((t) => t.textContent === '♛');
    expect(crowns.length).toBe(2);
    const outer = CONFIG.NUM_RINGS - 1;
    expect(svg.querySelector(`[data-cell-key="${cellKey(outer, 7)}"]`)).toBeTruthy();
    expect(svg.querySelector(`[data-cell-key="${cellKey(outer, 22)}"]`)).toBeTruthy();
  });
});
