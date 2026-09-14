/**
 * Wave 58 Contig/SD residual — Sum formatMove catalog shape. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — formatMove', () => {
  it('formats faces and matched sum equation', () => {
    const text = formatMove({
      player: 'player1',
      domino: {
        id: 'd',
        face1: 3,
        face2: 5,
        owner: 'player1',
        orientation: 'horizontal',
      },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
      matchedFace: 3,
      adjacentFace: 5,
      diceSum: 8,
      moveNumber: 1,
    });
    expect(text).toBe('[3|5] (3+5=8)');
  });
});
