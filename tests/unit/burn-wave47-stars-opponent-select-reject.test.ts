/**
 * Wave 47 leftover after #214/#215 — Stars & Bars selectCard opponent hand reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
  clearSelection,
} from '../../src/games/stars-bars/rules';

describe('Wave 47 stars deepen 2 — stars — opponent hand select reject', () => {
  it('selectCard identity for opponent card id while player1 to move', () => {
    const state = createInitialState();
    const oppCard = state.playerHands.player2[0];
    expect(selectCard(state, oppCard.id)).toBe(state);
  });

  it('after pass of seat, former hand card is now selectable', () => {
    let state = createInitialState();
    const p1Card = state.playerHands.player1[0];
    state = selectCard(state, p1Card.id);
    state = placeCard(state, 2, 2);
    expect(state.currentPlayer).toBe('player2');
    // p1's remaining cards are not in p2 hand
    const leftover = state.playerHands.player1[0];
    expect(selectCard(state, leftover.id)).toBe(state);
    const own = state.playerHands.player2[0];
    const next = selectCard(state, own.id);
    expect(next.selectedCard?.id).toBe(own.id);
    expect(clearSelection(next).phase).toBe('selectingCard');
  });
});
