/**
 * Wave 49 — Queens piece aria owner leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — aria owner', () => {
  it('labels p1 queen as Blue Queen', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const key = cellKey(outer, 7);
    const svg = renderBoard(createInitialState(), () => undefined);
    const label = svg.querySelector(`[data-cell-key="${key}"]`)?.getAttribute('aria-label') || '';
    expect(label).toMatch(/Blue/i);
    expect(label).toMatch(/Queen/i);
  });
});
