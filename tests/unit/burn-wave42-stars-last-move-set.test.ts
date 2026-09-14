/**
 * Wave 42 — Stars & Bars lastMove set after place leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — lastMove set', () => {
  it('lastMove null at start then mirrors placement coords', () => {
    let state = createInitialState();
    expect(state.lastMove).toBeNull();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 4, 2);
    expect(state.lastMove).toEqual({ row: 4, col: 2 });
  });

  it('subsequent place overwrites lastMove', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    expect(state.lastMove).toEqual({ row: 2, col: 2 });
    state = selectCard(state, state.playerHands.player2[0].id);
    state = placeCard(state, 2, 3);
    expect(state.lastMove).toEqual({ row: 2, col: 3 });
  });
});
