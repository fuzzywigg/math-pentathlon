/**
 * Wave 44 — Star Track selectChain win clamp leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH, ChainLink } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — select win clamp', () => {
  it('reaching TRACK_LENGTH wins and clamps position', () => {
    const c1: ChainLink = { id: 1, length: 6 };
    const c2: ChainLink = { id: 2, length: 1 };
    const s = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      player1Position: TRACK_LENGTH - 2,
      drawnChains: [c1, c2] as [ChainLink, ChainLink],
    };
    const next = selectChain(s, 0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.player1Position).toBe(TRACK_LENGTH);
  });
});
