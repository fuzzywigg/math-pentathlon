/**
 * Wave 47 leftover after #214/#215 — Star Track drawChains when bucket nearly empty leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

describe('Wave 47 star-track deepen 13 — Star Track — thin bucket draw', () => {
  it('draw+select advances when bucket has few chains left', () => {
    let state = createInitialState();
    // Drain most of the bucket by forging a short remaining list
    state = {
      ...state,
      chainBucket: [
        { length: 3 as const, id: 100 },
        { length: 2 as const, id: 101 },
        { length: 1 as const, id: 102 },
      ],
    };
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(state.drawnChains).toHaveLength(2);
    state = selectChain(state, 0);
    expect(state.currentPlayer).toBe('player2');
  });
});
