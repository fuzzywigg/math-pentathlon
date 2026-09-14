/**
 * Wave 47 leftover after #214/#215 — Stars & Bars selectCard / clearSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  clearSelection,
} from '../../src/games/stars-bars/rules';

describe('Wave 47 stars deepen 6 — stars — select / clear', () => {
  it('selectCard identity on gameOver and missing card id', () => {
    const base = createInitialState();
    const over = { ...base, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(selectCard(over, base.playerHands.player1[0].id)).toBe(over);
    expect(selectCard(base, 'ghost-card-id')).toBe(base);
  });

  it('selectCard stores card and advances to placingCard', () => {
    const state = createInitialState();
    const card = state.playerHands.player1[0];
    const next = selectCard(state, card.id);
    expect(next).not.toBe(state);
    expect(next.selectedCard).toEqual(card);
    expect(next.phase).toBe('placingCard');
  });

  it('clearSelection resets selectedCard and phase to selectingCard', () => {
    const state = createInitialState();
    const selected = selectCard(state, state.playerHands.player1[0].id);
    const cleared = clearSelection(selected);
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.phase).toBe('selectingCard');
  });
});
