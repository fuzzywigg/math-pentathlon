/**
 * Wave 42 — Stars & Bars placeCard occupied / OOB / wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — place reject identity', () => {
  it('wrong phase with selectedCard still identity', () => {
    const state = createInitialState();
    const card = state.playerHands.player1[0];
    const wrong: StarsState = {
      ...state,
      phase: 'selectingCard',
      selectedCard: card,
    };
    expect(placeCard(wrong, 2, 2)).toBe(wrong);
  });

  it('occupied cell identity after prior place', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 4, 4);
    state = selectCard(state, state.playerHands.player2[0].id);
    expect(placeCard(state, 4, 4)).toBe(state);
  });

  it('OOB indices throw when cell lookup fails', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    expect(() => placeCard(state, -1, 0)).toThrow();
    expect(() => placeCard(state, 0, 5)).toThrow();
  });
});
