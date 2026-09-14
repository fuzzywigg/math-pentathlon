/**
 * Wave 43 TOKENMAXX — Sum Dominoes formatMove/remaining leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, formatMove, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import type { Domino, SDMove } from '../../src/games/sum-dominoes/types';

describe('Wave 43 sum-dominoes — format/remaining', () => {
  it('formatMove shows faces and sum equation', () => {
    const domino: Domino = {
      id: 'd',
      face1: 3,
      face2: 4,
      owner: 'player1',
      orientation: 'horizontal',
    };
    const move: SDMove = {
      player: 'player1',
      domino,
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
      matchedFace: 3,
      adjacentFace: 4,
      diceSum: 7,
      moveNumber: 1,
    };
    expect(formatMove(move)).toBe('[3|4] (3+4=7)');
  });

  it('getRemainingCount mirrors hand lengths', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(state.hands.player1.length);
    expect(getRemainingCount(state, 'player2')).toBe(state.hands.player2.length);
  });
});
