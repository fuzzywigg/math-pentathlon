/**
 * Wave 51 leftover after #233 — Stars-Bars hand selected class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard } from '../../src/games/stars-bars/rules';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — hand selected', () => {
  it('adds .selected on chosen card', () => {
    const base = createInitialState();
    const card = base.playerHands.player1[0];
    const state = selectCard(base, card.id);
    const el = renderPlayerHand(state, 'player1', () => undefined);
    expect(el.querySelectorAll('.stars-card.selected').length).toBe(1);
  });
});
