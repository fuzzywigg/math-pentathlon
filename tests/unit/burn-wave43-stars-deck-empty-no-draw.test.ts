/**
 * Wave 43 — empty deck no-draw leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard, placeCard } from '../../src/games/stars-bars/rules';

describe('Wave 43 stars — deck empty no draw', () => {
  it('empty deck → hand shrinks after place', () => {
    let s = createInitialState();
    const handBefore = s.playerHands.player1.length;
    const card = s.playerHands.player1[0];
    s = { ...s, deck: [] };
    s = selectCard(s, card.id);
    const next = placeCard(s, 1, 1);
    expect(next.playerHands.player1.length).toBe(handBefore - 1);
    expect(next.deck).toEqual([]);
  });
});
