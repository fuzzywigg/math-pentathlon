/**
 * Overnight TOKENMAXX — Stars clearSelection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  clearSelection,
} from '../../src/games/stars-bars/rules';

describe('Overnight stars — clearSelection', () => {
  it('clears selected card back to selectingCard', () => {
    const s = createInitialState();
    const sel = selectCard(s, s.playerHands.player1[0].id);
    expect(sel.selectedCard).not.toBeNull();
    const cleared = clearSelection(sel);
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.phase).toBe('selectingCard');
  });
});
