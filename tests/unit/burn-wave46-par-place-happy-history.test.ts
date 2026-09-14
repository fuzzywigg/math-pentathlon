/**
 * Wave 46 — Par 55 placeBlock happy history/hand draw leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';

describe('Wave 46 par — place happy', () => {
  it('places selected block, records history, flips seat', () => {
    const state = createInitialState();
    const id = state.hands.player1[0].id;
    const placing = selectBlock(state, id);
    const next = placeBlock(placing, getValidPlacements(placing)[0]);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBlock).toBeNull();
    expect(next.hands.player1.some((b) => b.id === id)).toBe(false);
  });
});
