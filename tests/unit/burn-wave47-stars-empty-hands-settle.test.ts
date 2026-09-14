/**
 * Wave 47 leftover after #214/#215 leftovers D — stars empty hands settle. Tests-only. No product inventing.
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

function forgeEmptyHandsState(
  scores: { player1: number; player2: number },
  lastCard: AttributeCard
): StarsState {
  const base = createInitialState();
  const cells = base.cells.map((row) => row.map((c) => ({ ...c })));
  cells[1][1] = {
    ...cells[1][1],
    card: card({ id: 'seed' }),
    owner: 'player2',
  };
  return {
    ...base,
    cells,
    playerHands: { player1: [lastCard], player2: [] },
    deck: [],
    currentPlayer: 'player1',
    selectedCard: lastCard,
    phase: 'placingCard',
    playerScores: scores,
  };
}

describe('Wave 47 stars deepen 16 — stars — empty hands settle', () => {
  it('both hands empty after place → higher score wins', () => {
    const last = card({ id: 'last' });
    const state = forgeEmptyHandsState({ player1: 10, player2: 7 }, last);
    const next = placeCard(state, 1, 2);
    expect(next.playerHands.player1).toHaveLength(0);
    expect(next.playerHands.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('both hands empty after place with equal scores → tie null', () => {
    const last = card({ id: 'last-tie' });
    const state = forgeEmptyHandsState({ player1: 5, player2: 5 }, last);
    const next = placeCard(state, 1, 2);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('both hands empty after place → player2 higher score wins', () => {
    const last = card({ id: 'last-lose' });
    const state = forgeEmptyHandsState({ player1: 3, player2: 9 }, last);
    const next = placeCard(state, 1, 2);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });
});
