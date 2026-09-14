/**
 * Wave 43 — reselect while placing leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard } from '../../src/games/stars-bars/rules';

describe('Wave 43 stars — reselect while placing', () => {
  it('second selectCard from hand replaces selection', () => {
    let s = createInitialState();
    const [a, b] = s.playerHands.player1;
    s = selectCard(s, a.id);
    expect(s.selectedCard?.id).toBe(a.id);
    s = selectCard(s, b.id);
    expect(s.selectedCard?.id).toBe(b.id);
    expect(s.phase).toBe('placingCard');
  });
});
