/**
 * Wave 47 leftover after #214/#215 leftovers D — stars deck exhaust no refill. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import type { AttributeCard, StarsState } from '../../src/games/stars-bars/types';
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

describe('Wave 47 stars deepen 14 — stars — deck exhaust no refill', () => {
  it('empty deck place keeps hand length-1 (no draw)', () => {
    const place = card({ id: 'only' });
    const base = createInitialState();
    const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
    cells[2][2] = {
      ...cells[2][2],
      card: card({ id: 'seed' }),
      owner: 'player2',
    };

    const handBefore = [place, card({ id: 'keep' })];
    const state: StarsState = {
      ...base,
      cells,
      playerHands: { player1: handBefore, player2: [card({ id: 'p2' })] },
      deck: [],
      currentPlayer: 'player1',
      selectedCard: place,
      phase: 'placingCard',
    };

    const next = placeCard(state, 2, 3);
    expect(next.deck).toHaveLength(0);
    expect(next.playerHands.player1).toHaveLength(handBefore.length - 1);
    expect(next.playerHands.player1.map((c) => c.id)).toEqual(['keep']);
  });
});
