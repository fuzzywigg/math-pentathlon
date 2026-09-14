/**
 * Wave 43 TOKENMAXX — Star Track drawChains phase leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { drawChains } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 43 star-track — draw phase gates', () => {
  it('wrong phase identity; happy path draws two', () => {
    const state = createInitialState();
    expect(drawChains({ ...state, phase: 'selectChain' })).toEqual({
      ...state,
      phase: 'selectChain',
    });
    const next = drawChains(state);
    expect(next.phase).toBe('selectChain');
    expect(next.drawnChains).toHaveLength(2);
    expect(next.chainBucket).toHaveLength(state.chainBucket.length - 2);
  });
});
