/**
 * Overnight HEAVY after #214/#215 — Stars select/clear phase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard, clearSelection } from '../../src/games/stars-bars/rules';

describe('Overnight stars-bars — select/clear phase', () => {
  it('select enters placingCard; clear returns selectingCard', () => {
    const s = createInitialState();
    const id = s.playerHands.player1[0].id;
    const selected = selectCard(s, id);
    expect(selected.phase).toBe('placingCard');
    expect(selected.selectedCard?.id).toBe(id);
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingCard');
    expect(cleared.selectedCard).toBeNull();
  });
});
