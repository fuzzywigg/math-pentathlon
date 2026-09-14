/**
 * Wave 47 leftover after #214/#215 — Star Track select clamp at TRACK_LENGTH overshoot.
 * Complements bucket-exhaust files. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { selectChain, isGameOver, getProgress } from '../../src/games/star-track/rules';

describe('Wave 47 star-track deepen 4 — star-track — overshoot clamp', () => {
  it('selectChain clamps past TRACK_LENGTH and wins', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      player1Position: TRACK_LENGTH - 1,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
    };
    const next = selectChain(state, 0);
    expect(next.player1Position).toBe(TRACK_LENGTH);
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
    expect(isGameOver(next)).toBe(true);
    expect(getProgress(next, 'player1')).toBe(100);
  });
});
