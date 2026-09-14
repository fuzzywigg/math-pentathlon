/**
 * Wave 51 leftover after #233 — Hex-a-Gone p1 fill + BLOCK_COLORS. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BLOCK_COLORS } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — p1 fill', () => {
  it('applies p1 class and BLOCK_COLORS fill after place', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = commitSelection(state);
    const spot = getValidPlacements(state)[0];
    state = placeBlock(state, spot.q, spot.r);
    const container = document.createElement('div');
    renderBoard(state, container);
    const filled = container.querySelector(
      `.hex-a-gone-cell-p1[data-q="${spot.q}"][data-r="${spot.r}"]`
    );
    expect(filled).toBeTruthy();
    expect(filled?.getAttribute('fill')).toBe(BLOCK_COLORS.triangle);
  });
});
