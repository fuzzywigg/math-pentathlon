/**
 * Wave 49 leftover after #221/#226/#227 — Queens center cell present. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — center cell', () => {
  it('includes ring-0 center cell key', () => {
    const state = createInitialState();
    const svg = renderBoard(state, () => undefined);
    const center = cellKey(0, 0);
    expect(svg.querySelector(`[data-cell-key="${center}"]`)).toBeTruthy();
  });
});
