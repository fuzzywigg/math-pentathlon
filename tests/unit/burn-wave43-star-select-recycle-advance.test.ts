/**
 * Wave 43 TOKENMAXX — Star Track select recycle + advance leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { drawChains, selectChain } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 43 star-track — select recycle advance', () => {
  it('uses chosen chain, recycles unused, flips seat', () => {
    let state = createInitialState();
    const before = state.chainBucket.length;
    state = drawChains(state);
    const drawn = state.drawnChains!;
    const next = selectChain(state, 0);
    expect(next.selectedChain).toEqual(drawn[0]);
    expect(next.drawnChains).toBeNull();
    expect(next.player1Position).toBe(drawn[0].length);
    expect(next.chainBucket).toContainEqual(drawn[1]);
    expect(next.chainBucket.length).toBe(before - 1); // drew 2, returned 1
    expect(next.phase).toBe('drawChains');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });
});
