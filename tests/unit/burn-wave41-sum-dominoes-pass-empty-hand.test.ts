/**
 * Wave 41 — Sum Dominoes passTurn / empty-hand leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';
import { type Domino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

describe('Wave 41 sum-dominoes — passTurn empty hand', () => {
  it('passTurn identity outside passing phase', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
    const placing: SumDominoesState = { ...state, phase: 'placing', currentDice: [1, 1] };
    expect(passTurn(placing)).toBe(placing);
    const over: SumDominoesState = { ...state, phase: 'gameOver' };
    expect(passTurn(over)).toBe(over);
  });

  it('single pass flips player and returns to rolling', () => {
    const base = createInitialState();
    const passing: SumDominoesState = {
      ...base,
      phase: 'passing',
      currentDice: [6, 6],
      passCount: 0,
      hands: {
        player1: [],
        player2: [makeDomino('p2', 1, 2, 'player2')],
      },
    };
    expect(getRemainingCount(passing, 'player1')).toBe(0);
    const next = passTurn(passing);
    expect(next).not.toBe(passing);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.passCount).toBe(1);
    expect(next.currentDice).toBeNull();
  });

  it('double pass settles by pip count (empty hand wins)', () => {
    const base = createInitialState();
    const stuck: SumDominoesState = {
      ...base,
      phase: 'passing',
      passCount: 1,
      hands: {
        player1: [],
        player2: [makeDomino('heavy', 6, 6, 'player2')],
      },
    };
    const next = passTurn(stuck);
    expect(next.phase).toBe('gameOver');
    expect(next.passCount).toBe(2);
    expect(next.winner).toBe('player1');
  });
});
