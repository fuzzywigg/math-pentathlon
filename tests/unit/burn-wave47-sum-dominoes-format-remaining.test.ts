/**
 * Wave 47 leftover after #214/#215 — Sum Dominoes formatMove / getRemainingCount leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  formatMove,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';
import { type Domino, type SDMove } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 47 sum deepen 3 — sum-dominoes — format remaining', () => {
  it('formatMove embeds faces and sum equation', () => {
    const d = makeDomino('f', 2, 5);
    const move: SDMove = {
      player: 'player1',
      domino: d,
      position: { row: 4, col: 5 },
      orientation: 'vertical',
      matchedFace: 2,
      adjacentFace: 4,
      diceSum: 6,
      moveNumber: 1,
    };
    expect(formatMove(move)).toBe('[2|5] (2+4=6)');
  });

  it('getRemainingCount tracks forged empty and full hands', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(state.hands.player1.length);
    const emptied = {
      ...state,
      hands: { player1: [], player2: state.hands.player2 },
    };
    expect(getRemainingCount(emptied, 'player1')).toBe(0);
    expect(getRemainingCount(emptied, 'player2')).toBe(state.hands.player2.length);
  });

  it('formatMove works for doubles', () => {
    const d = makeDomino('dbl', 4, 4);
    expect(
      formatMove({
        player: 'player2',
        domino: d,
        position: { row: 1, col: 1 },
        orientation: 'horizontal',
        matchedFace: 4,
        adjacentFace: 3,
        diceSum: 7,
        moveNumber: 9,
      })
    ).toBe('[4|4] (4+3=7)');
  });
});
