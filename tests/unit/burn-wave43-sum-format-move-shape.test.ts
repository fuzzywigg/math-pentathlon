/**
 * Wave 43 — Sum Dominoes formatMove string shape leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/sum-dominoes/rules';
import type { Domino, SDMove } from '../../src/games/sum-dominoes/types';

describe('Wave 43 sum-dominoes — formatMove', () => {
  it('includes faces and dice equation', () => {
    const domino: Domino = {
      id: 'd',
      face1: 2,
      face2: 5,
      owner: 'player1',
      orientation: 'vertical',
    };
    const move: SDMove = {
      player: 'player1',
      domino,
      position: { row: 4, col: 5 },
      orientation: 'vertical',
      matchedFace: 2,
      adjacentFace: 5,
      diceSum: 7,
      moveNumber: 3,
    };
    expect(formatMove(move)).toBe('[2|5] (2+5=7)');
  });
});
