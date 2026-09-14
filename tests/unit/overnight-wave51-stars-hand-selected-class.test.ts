/**
 * Overnight HEAVY leftovers after #234 — Stars selected hand card class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard } from '../../src/games/stars-bars/rules';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — hand selected', () => {
  it('adds selected class to chosen hand card', () => {
    const base = createInitialState();
    const card = base.playerHands.player1[0]!;
    const state = selectCard(base, card.id);
    const el = renderPlayerHand(state, 'player1', () => undefined);
    expect(el.querySelector('.stars-card.selected')).toBeTruthy();
  });
});
