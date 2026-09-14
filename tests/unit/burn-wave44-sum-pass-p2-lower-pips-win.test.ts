/**
 * Wave 44 — Sum Dominoes p2 lower-pip settle leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { Domino } from '../../src/games/sum-dominoes/types';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — p2 lower pips win', () => {
  it('player2 wins when fewer pips after double pass', () => {
    const s = {
      ...createInitialState(),
      phase: 'passing' as const,
      passCount: 1,
      hands: {
        player1: [
          { id: 'a', face1: 6, face2: 6, owner: 'player1', orientation: 'horizontal' } as Domino,
        ],
        player2: [
          { id: 'b', face1: 1, face2: 0, owner: 'player2', orientation: 'horizontal' } as Domino,
        ],
      },
    };
    const ended = passTurn(s);
    expect(ended.winner).toBe('player2');
    expect(ended.phase).toBe('gameOver');
  });
});
