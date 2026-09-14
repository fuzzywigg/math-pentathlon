/**
 * Wave 42 — Stars & Bars clearSelection after select leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  clearSelection,
  placeCard,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — clear after select', () => {
  it('clearSelection undoes placingCard without mutating board', () => {
    const state = createInitialState();
    const card = state.playerHands.player1[0];
    const selected = selectCard(state, card.id);
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingCard');
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.cells).toBe(selected.cells);
    expect(cleared.playerHands.player1).toHaveLength(5);
  });

  it('re-select after clear can place successfully', () => {
    let state = createInitialState();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    state = clearSelection(state);
    state = selectCard(state, card.id);
    state = placeCard(state, 2, 2);
    expect(state.cells[2][2].card?.id).toBe(card.id);
    expect(state.currentPlayer).toBe('player2');
  });
});
