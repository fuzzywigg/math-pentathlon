/**
 * Wave 40 — Stars-bars gameOver / ghost select / occupied place identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  passTurn,
  placeCard,
} from '../../src/games/stars-bars/rules';

describe('Wave 40 stars — select/pass gameOver + place occupied', () => {
  it('selectCard / passTurn identity when gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const cardId = state.playerHands.player1[0].id;
    expect(selectCard(state, cardId)).toBe(state);
    expect(passTurn(state)).toBe(state);
  });

  it('selectCard identity for ghost cardId', () => {
    const state = createInitialState();
    expect(selectCard(state, 'no-such-card')).toBe(state);
  });

  it('placeCard identity on occupied cell (place once then again)', () => {
    let state = createInitialState();
    const first = state.playerHands.player1[0];
    state = selectCard(state, first.id);
    state = placeCard(state, 0, 0);
    expect(state.cells[0][0].card).not.toBeNull();

    const second = state.playerHands[state.currentPlayer][0];
    state = selectCard(state, second.id);
    expect(state.phase).toBe('placingCard');
    const next = placeCard(state, 0, 0);
    expect(next).toBe(state);
  });
});
