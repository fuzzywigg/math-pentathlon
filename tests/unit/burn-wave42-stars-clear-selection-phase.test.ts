/**
 * Wave 42 leftovers D — stars clearSelection phase. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  clearSelection,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — clearSelection phase', () => {
  it('clearSelection resets to selectingCard and clears selectedCard', () => {
    const state = createInitialState();
    const card = state.playerHands.player1[0];
    const selected = selectCard(state, card.id);
    expect(selected.phase).toBe('placingCard');
    expect(selected.selectedCard?.id).toBe(card.id);

    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingCard');
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.currentPlayer).toBe(selected.currentPlayer);
  });
});
