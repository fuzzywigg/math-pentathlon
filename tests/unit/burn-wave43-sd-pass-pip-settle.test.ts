/**
 * Wave 43 TOKENMAXX — Sum Dominoes mutual-pass pip settle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';
import type { Domino, SumDominoesState } from '../../src/games/sum-dominoes/types';

function d(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

function passing(partial: Partial<SumDominoesState>): SumDominoesState {
  return {
    ...createInitialState(),
    phase: 'passing',
    passCount: 1,
    ...partial,
  };
}

describe('Wave 43 sum-dominoes — pass pip settle', () => {
  it('wrong phase identity', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
  });

  it('first pass flips seat; second settles by fewer pips', () => {
    const first = passing({
      passCount: 0,
      hands: {
        player1: [d('a', 6, 6)],
        player2: [d('b', 1, 1)],
      },
    });
    const mid = passTurn(first);
    expect(mid.phase).toBe('rolling');
    expect(mid.currentPlayer).toBe('player2');
    expect(mid.passCount).toBe(1);

    const end = passTurn({ ...mid, phase: 'passing' });
    expect(end.phase).toBe('gameOver');
    expect(end.winner).toBe('player2'); // 2 pips < 12
  });

  it('equal pips → draw null winner', () => {
    const state = passing({
      hands: {
        player1: [d('a', 3, 3)],
        player2: [d('b', 2, 4)],
      },
    });
    const end = passTurn(state);
    expect(end.phase).toBe('gameOver');
    expect(end.winner).toBeNull();
  });

  it('p1 fewer pips wins', () => {
    const state = passing({
      hands: {
        player1: [d('a', 0, 1)],
        player2: [d('b', 6, 6)],
      },
    });
    expect(passTurn(state).winner).toBe('player1');
  });
});
