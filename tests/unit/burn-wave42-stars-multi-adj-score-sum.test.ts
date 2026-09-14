/**
 * Wave 42 leftovers D — stars multi-adj score sum. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  countDifferences,
  type AttributeCard,
  type StarsState,
} from '../../src/games/stars-bars/types';
import {
  createInitialState,
  placeCard,
} from '../../src/games/stars-bars/rules';

function card(partial: Partial<AttributeCard> & { id: string }): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

describe('Wave 42 stars — multi-adj score sum', () => {
  it('placing at (3,3) with three forged neighbors scores sum of countDifferences', () => {
    const n22 = card({ id: 'n22' }); // 0 diffs vs base place card unless we vary place
    const n23 = card({ id: 'n23', shape: 'square' }); // 1
    const n32 = card({
      id: 'n32',
      shape: 'triangle',
      color: 'blue',
      size: 'large',
    }); // 3
    const place = card({
      id: 'place',
      shape: 'hexagon',
      color: 'yellow',
      size: 'large',
      thickness: 'thick',
    });

    const expected =
      countDifferences(place, n22) +
      countDifferences(place, n23) +
      countDifferences(place, n32);

    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[2][2] = { ...cells[2][2], card: n22, owner: 'player2' };
    cells[2][3] = { ...cells[2][3], card: n23, owner: 'player2' };
    cells[3][2] = { ...cells[3][2], card: n32, owner: 'player2' };

    const state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [place], player2: [card({ id: 'p2' })] },
      deck: [],
      currentPlayer: 'player1',
      selectedCard: place,
      phase: 'placingCard',
      playerScores: { player1: 0, player2: 0 },
    };

    const next = placeCard(state, 3, 3);
    expect(next.playerScores.player1).toBe(expected);
    expect(next.moveHistory.at(-1)!.score).toBe(expected);
    expect(next.cells[3][3].card?.id).toBe('place');
  });
});
