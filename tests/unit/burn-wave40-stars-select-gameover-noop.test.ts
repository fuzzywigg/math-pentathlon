/**
 * Wave 40 — Stars-Bars gameOver / ghost select / occupied place rejects.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
  passTurn,
} from '../../src/games/stars-bars/rules';

describe('Wave 40 stars-bars — gameOver / place rejects', () => {
  it('gameOver selectCard and passTurn are identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const hand = state.playerHands.player1;
    expect(selectCard(state, hand[0]?.id ?? 'x')).toBe(state);
    expect(passTurn(state)).toBe(state);
  });

  it('selectCard ghost id → identity', () => {
    const state = createInitialState();
    expect(selectCard(state, 'ghost-card')).toBe(state);
  });

  it('placeCard on occupied cell → identity', () => {
    const state = createInitialState();
    const cardId = state.playerHands.player1[0].id;
    const selected = selectCard(state, cardId);
    const placed = placeCard(selected, 0, 0);
    expect(placed).not.toBe(selected);

    // Next player places; re-select and try occupied (0,0)
    if (placed.phase === 'selectingCard' || placed.phase === 'placingCard') {
      const nextHand = placed.playerHands[placed.currentPlayer];
      if (nextHand.length > 0) {
        const sel2 = selectCard(placed, nextHand[0].id);
        expect(placeCard(sel2, 0, 0)).toBe(sel2);
      }
    }
  });
});
