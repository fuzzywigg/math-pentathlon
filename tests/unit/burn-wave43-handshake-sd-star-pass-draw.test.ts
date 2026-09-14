/**
 * Wave 43 TOKENMAXX — SD pass-settle × Star draw-exhaust handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as sdInit, passTurn } from '../../src/games/sum-dominoes/rules';
import { drawChains } from '../../src/games/star-track/rules';
import { createInitialState as starInit } from '../../src/games/star-track/types';
import type { Domino } from '../../src/games/sum-dominoes/types';

describe('Wave 43 handshake — sd pass × star exhaust', () => {
  it('both can settle draws with null winners', () => {
    const d = (id: string, a: number, b: number): Domino => ({
      id,
      face1: a,
      face2: b,
      owner: 'player1',
      orientation: 'horizontal',
    });
    const sd = passTurn({
      ...sdInit(),
      phase: 'passing',
      passCount: 1,
      hands: { player1: [d('a', 2, 2)], player2: [d('b', 1, 3)] },
    });
    const star = drawChains({
      ...starInit(),
      chainBucket: [],
      player1Position: 5,
      player2Position: 5,
    });
    expect(sd.phase).toBe('gameOver');
    expect(sd.winner).toBeNull();
    expect(star.phase).toBe('gameOver');
    expect(star.winner).toBeNull();
  });
});
