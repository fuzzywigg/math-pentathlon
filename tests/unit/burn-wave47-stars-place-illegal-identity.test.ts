/**
 * Wave 47 leftover after #214/#215 — Stars & Bars placeCard illegal identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 47 stars deepen 4 — stars — place illegal identity', () => {
  it('placeCard identity without placingCard phase or selection', () => {
    const state = createInitialState();
    expect(placeCard(state, 0, 0)).toBe(state);
    const selecting: StarsState = {
      ...state,
      phase: 'selectingCard',
      selectedCard: null,
    };
    expect(placeCard(selecting, 1, 1)).toBe(selecting);
  });

  it('placeCard identity on occupied cell', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    // player2 turn — select and try occupied center
    state = selectCard(state, state.playerHands.player2[0].id);
    expect(placeCard(state, 2, 2)).toBe(state);
  });

  it('placeCard identity when target not in valid placements', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    state = selectCard(state, state.playerHands.player2[0].id);
    const valids = getValidPlacements(state);
    expect(valids).not.toContainEqual({ row: 0, col: 0 });
    expect(placeCard(state, 0, 0)).toBe(state);
  });
});
