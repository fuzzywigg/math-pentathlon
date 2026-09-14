/**
 * Wave 44 — Sum Dominoes formatMove zero and max edge strings. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatMove } from '../../src/games/sum-dominoes/rules';
import { type Domino, type SDMove } from '../../src/games/sum-dominoes/types';

function sd(
  face1: number,
  face2: number,
  matchedFace: number,
  adjacentFace: number,
  diceSum: number
): SDMove {
  const domino: Domino = {
    id: `d-${face1}-${face2}`,
    face1,
    face2,
    owner: 'player1',
    orientation: 'vertical',
  };
  return {
    player: 'player1',
    domino,
    position: { row: 3, col: 3 },
    orientation: 'vertical',
    matchedFace,
    adjacentFace,
    diceSum,
    moveNumber: 4,
  };
}

describe('Wave 44 sum-dominoes — formatMove edge strings', () => {
  it('formats blank|blank double zero', () => {
    expect(formatMove(sd(0, 0, 0, 2, 2))).toBe('[0|0] (0+2=2)');
  });

  it('formats mixed blank high face', () => {
    expect(formatMove(sd(0, 6, 6, 6, 12))).toBe('[0|6] (6+6=12)');
  });

  it('formats consecutive integers equation', () => {
    expect(formatMove(sd(3, 4, 3, 5, 8))).toBe('[3|4] (3+5=8)');
  });

  it('keeps bracket pipe and paren sum delimiters', () => {
    const text = formatMove(sd(1, 2, 1, 1, 2));
    expect(text.startsWith('[')).toBe(true);
    expect(text).toContain('|');
    expect(text).toContain('] (');
    expect(text.endsWith(')')).toBe(true);
    expect(text).toBe('[1|2] (1+1=2)');
  });
});
