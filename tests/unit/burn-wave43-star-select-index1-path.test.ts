/**
 * Wave 43 TOKENMAXX — Star Track select index-1 path leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { drawChains, selectChain } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 43 star-track — select index 1', () => {
  it('choosing second drawn chain advances by that length', () => {
    let state = createInitialState();
    state = drawChains(state);
    const drawn = state.drawnChains!;
    const next = selectChain(state, 1);
    expect(next.selectedChain).toEqual(drawn[1]);
    expect(next.player1Position).toBe(drawn[1].length);
    expect(next.chainBucket).toContainEqual(drawn[0]);
  });
});
