/**
 * Wave 44 — Sum Dominoes formatMove face/sum variants. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatMove } from '../../src/games/sum-dominoes/rules';
import { type Domino, type SDMove } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

function move(partial: Partial<SDMove> & { domino: Domino }): SDMove {
  return {
    player: 'player1',
    position: { row: 5, col: 4 },
    orientation: 'horizontal',
    matchedFace: partial.domino.face1,
    adjacentFace: 6,
    diceSum: partial.domino.face1 + 6,
    moveNumber: 1,
    ...partial,
  };
}

describe('Wave 44 sum-dominoes — formatMove variants', () => {
  it('formats zero-face tiles with equation', () => {
    expect(formatMove(move({ domino: makeDomino('z', 0, 3), matchedFace: 0, adjacentFace: 7, diceSum: 7 }))).toBe(
      '[0|3] (0+7=7)'
    );
  });

  it('formats asymmetric faces with flipped match side', () => {
    expect(
      formatMove(
        move({
          domino: makeDomino('a', 1, 5),
          matchedFace: 5,
          adjacentFace: 4,
          diceSum: 9,
          orientation: 'vertical',
        })
      )
    ).toBe('[1|5] (5+4=9)');
  });

  it('formats double-six max pip equation', () => {
    expect(
      formatMove(
        move({
          player: 'player2',
          domino: makeDomino('d6', 6, 6),
          matchedFace: 6,
          adjacentFace: 6,
          diceSum: 12,
          moveNumber: 22,
        })
      )
    ).toBe('[6|6] (6+6=12)');
  });

  it('ignores position/player fields in display string', () => {
    const a = formatMove(
      move({
        player: 'player1',
        domino: makeDomino('x', 2, 2),
        position: { row: 0, col: 0 },
        matchedFace: 2,
        adjacentFace: 5,
        diceSum: 7,
      })
    );
    const b = formatMove(
      move({
        player: 'player2',
        domino: makeDomino('x', 2, 2),
        position: { row: 10, col: 10 },
        matchedFace: 2,
        adjacentFace: 5,
        diceSum: 7,
      })
    );
    expect(a).toBe(b);
    expect(a).toBe('[2|2] (2+5=7)');
  });
});
