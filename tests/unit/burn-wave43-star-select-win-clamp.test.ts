/**
 * Wave 43 TOKENMAXX — Star Track select win clamp leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectChain } from '../../src/games/star-track/rules';
import {
  createInitialState,
  TRACK_LENGTH,
  type ChainLink,
} from '../../src/games/star-track/types';

describe('Wave 43 star-track — select win clamp', () => {
  it('overshoot clamps to TRACK_LENGTH and settles winner', () => {
    const c1: ChainLink = { length: 6, id: 1 };
    const c2: ChainLink = { length: 1, id: 2 };
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      player1Position: TRACK_LENGTH - 2,
      drawnChains: [c1, c2] as [ChainLink, ChainLink],
      chainBucket: [],
    };
    const next = selectChain(state, 0);
    expect(next.player1Position).toBe(TRACK_LENGTH);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player1');
  });
});
