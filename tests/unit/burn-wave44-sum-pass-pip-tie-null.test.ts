/**
 * Wave 44 — Sum Dominoes double-pass pip tie leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { Domino } from '../../src/games/sum-dominoes/types';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — pass pip tie null', () => {
  it('equal pips yield null winner on double pass', () => {
    const tile = (id: string, owner: Domino['owner']): Domino => ({
      id,
      face1: 3,
      face2: 3,
      owner,
      orientation: 'horizontal',
    });
    let s = {
      ...createInitialState(),
      phase: 'passing' as const,
      passCount: 1,
      hands: {
        player1: [tile('a', 'player1')],
        player2: [tile('b', 'player2')],
      },
    };
    s = passTurn(s);
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBeNull();
  });
});
