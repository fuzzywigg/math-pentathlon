/**
 * Wave 51 leftover after #233 — Hex-a-Gone valid placement cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection, getValidPlacements } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — valid cells', () => {
  it('marks hex-a-gone-cell-valid for placeBlocks valids', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = commitSelection(state);
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    const container = document.createElement('div');
    renderBoard(state, container);
    expect(container.querySelectorAll('.hex-a-gone-cell-valid').length).toBe(valids.length);
  });
});
