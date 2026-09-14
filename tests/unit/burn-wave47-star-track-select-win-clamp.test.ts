/**
 * Wave 47 leftover after #214/#215 — Star Track selectChain win clamp + unused return + turn swap.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { drawChains, selectChain, isGameOver } from '../../src/games/star-track/rules';

describe('Wave 47 star-track deepen 5 — Star Track — select win clamp', () => {
  it('selectChain identity wrong phase', () => {
    const state = createInitialState();
    expect(selectChain(state, 0)).toBe(state);
  });

  it('selecting chain advances position and returns unused to bucket', () => {
    let state = drawChains(createInitialState());
    const drawn = state.drawnChains!;
    const unused = drawn[1];
    const bucketBefore = state.chainBucket.length;
    state = selectChain(state, 0);
    expect(state.drawnChains).toBeNull();
    expect(state.chainBucket.length).toBe(bucketBefore + 1);
    expect(state.chainBucket.some((c) => c.id === unused.id)).toBe(true);
    expect(state.player1Position).toBe(drawn[0].length);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('drawChains');
    expect(state.moveHistory).toHaveLength(1);
  });

  it('clamp to TRACK_LENGTH and declare winner when reaching goal', () => {
    let state = createInitialState();
    state = {
      ...state,
      player1Position: TRACK_LENGTH - 1,
      phase: 'selectChain',
      drawnChains: [
        { length: 6, id: 100 },
        { length: 1, id: 101 },
      ],
      chainBucket: [{ length: 2, id: 102 }],
    };
    state = selectChain(state, 0);
    expect(state.player1Position).toBe(TRACK_LENGTH);
    expect(state.winner).toBe('player1');
    expect(state.phase).toBe('gameOver');
    expect(isGameOver(state)).toBe(true);
    expect(state.currentPlayer).toBe('player1');
  });

  it('exact fit also wins', () => {
    let state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 3,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 3 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
    };
    state = selectChain(state, 0);
    expect(state.winner).toBe('player1');
    expect(state.player1Position).toBe(TRACK_LENGTH);
  });

  it('select index 1 uses second chain', () => {
    let state = drawChains(createInitialState());
    const chosen = state.drawnChains![1];
    state = selectChain(state, 1);
    expect(state.selectedChain?.id).toBe(chosen.id);
    expect(state.player1Position).toBe(chosen.length);
  });
});
