/**
 * Wave 42 — Stars & Bars placeCard first-card score + seat switch. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — first card switch seat', () => {
  it('first place scores 0 with first-card breakdown', () => {
    let state = createInitialState();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    state = placeCard(state, 3, 3);
    expect(state.moveHistory[0].score).toBe(0);
    expect(state.moveHistory[0].breakdown).toBe('first card');
    expect(state.playerScores.player1).toBe(0);
  });

  it('first place switches to player2 and clears selection', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 1, 2);
    expect(state.currentPlayer).toBe('player2');
    expect(state.selectedCard).toBeNull();
    expect(state.phase).toBe('selectingCard');
    expect(state.winner).toBeNull();
  });
});
