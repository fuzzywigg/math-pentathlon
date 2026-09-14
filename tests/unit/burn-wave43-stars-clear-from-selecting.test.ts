/**
 * Wave 43 — clearSelection from selectingCard leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard, clearSelection } from '../../src/games/stars-bars/rules';

describe('Wave 43 stars — clear from selecting', () => {
  it('clearSelection returns selectingCard with null card', () => {
    let s = createInitialState();
    s = selectCard(s, s.playerHands.player1[0].id);
    const cleared = clearSelection(s);
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.phase).toBe('selectingCard');
  });
});
