/**
 * Overnight TOKENMAXX — Stars passTurn clears selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard, passTurn } from '../../src/games/stars-bars/rules';

describe('Overnight stars — pass clears', () => {
  it('pass flips seat and clears selection', () => {
    const s = createInitialState();
    const sel = selectCard(s, s.playerHands.player1[0].id);
    expect(sel.selectedCard).not.toBeNull();
    const next = passTurn(sel);
    expect(next.selectedCard).toBeNull();
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).not.toBe('gameOver');
  });
});
