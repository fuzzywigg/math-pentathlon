/**
 * Wave 42 leftovers D — stars star x2 multi-adj. Tests-only. No product inventing.
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

describe('Wave 42 stars — star x2 multi-adj', () => {
  it('place on star with 2+ adj → 2*sum and breakdown contains star x2', () => {
    // Neighbors around center star (2,2)
    const a = card({ id: 'a', shape: 'square' }); // 1
    const b = card({ id: 'b', color: 'blue', size: 'large' }); // 2
    const place = card({ id: 'place', thickness: 'thick' }); // diffs vs a/b

    const sum =
      countDifferences(place, a) + countDifferences(place, b);

    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[1][1] = { ...cells[1][1], card: a, owner: 'player2' };
    cells[1][2] = { ...cells[1][2], card: b, owner: 'player2' };
    expect(cells[2][2].isStar).toBe(true);
    expect(cells[2][2].card).toBeNull();

    const state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: [place], player2: [card({ id: 'p2' })] },
      deck: [],
      currentPlayer: 'player1',
      selectedCard: place,
      phase: 'placingCard',
    };

    const next = placeCard(state, 2, 2);
    expect(sum).toBeGreaterThan(0);
    expect(next.moveHistory.at(-1)!.score).toBe(sum * 2);
    expect(next.moveHistory.at(-1)!.breakdown).toContain('star x2');
    expect(next.playerScores.player1).toBe(sum * 2);
  });
});
