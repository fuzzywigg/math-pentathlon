/**
 * Wave 42 — Stars & Bars deck depletes on place draws. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — deck deplete draw', () => {
  it('place draws one from deck and keeps hand size 5', () => {
    let state = createInitialState();
    const beforeDeck = state.deck.length;
    const cardId = state.playerHands.player1[0].id;
    state = selectCard(state, cardId);
    state = placeCard(state, 2, 2);
    expect(state.deck.length).toBe(beforeDeck - 1);
    expect(state.playerHands.player1).toHaveLength(5);
    expect(state.playerHands.player1.some((c) => c.id === cardId)).toBe(false);
  });

  it('empty deck place shrinks hand without refill', () => {
    let state = createInitialState();
    const emptyDeck: StarsState = { ...state, deck: [] };
    const beforeHand = emptyDeck.playerHands.player1.length;
    state = selectCard(emptyDeck, emptyDeck.playerHands.player1[0].id);
    state = placeCard(state, 1, 1);
    expect(state.deck).toHaveLength(0);
    expect(state.playerHands.player1).toHaveLength(beforeHand - 1);
  });
});
