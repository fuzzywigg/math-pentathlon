/**
 * Wave 43 — Hex-a-Gone bank decrements mid multi-block turn. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — midturn bank decrement', () => {
  it('first place drops bank and keeps remaining selection', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    const spot = getValidPlacements(state)[0];
    const next = placeBlock(state, spot.q, spot.r);
    expect(next.bank.hexagon).toBe(INITIAL_BANK.hexagon - 1);
    expect(next.bank.triangle).toBe(INITIAL_BANK.triangle);
    expect(next.phase).toBe('placeBlocks');
    expect(next.turnSelection.blocks).toEqual(['triangle']);
    expect(next.selectedBlockForPlacement).toBe('triangle');
    expect(next.currentPlayer).toBe('player1');
  });
});
