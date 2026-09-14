/**
 * Wave 47 leftover after #214/#215 leftovers D — stars multi-adj breakdown N-way + M-way. Tests-only. No product inventing.
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

describe('Wave 47 stars deepen 17 — stars — multi-adj breakdown', () => {
  it('breakdown matches N-way + M-way pattern for three neighbors', () => {
    const n22 = card({ id: 'n22', shape: 'square' }); // 1 vs place base
    const n23 = card({ id: 'n23', color: 'blue', size: 'large' }); // 2
    const n32 = card({
      id: 'n32',
      shape: 'triangle',
      color: 'yellow',
      size: 'large',
      thickness: 'thick',
    }); // 4
    const place = card({ id: 'place' });

    const d22 = countDifferences(place, n22);
    const d23 = countDifferences(place, n23);
    const d32 = countDifferences(place, n32);

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
    };

    const next = placeCard(state, 3, 3);
    const breakdown = next.moveHistory.at(-1)!.breakdown;
    expect(breakdown).toBe(`${d22}-way + ${d23}-way + ${d32}-way`);
    expect(breakdown).toMatch(/^\d+-way( \+ \d+-way)+$/);
  });
});
