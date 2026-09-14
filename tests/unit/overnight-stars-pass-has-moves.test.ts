/**
 * Overnight HEAVY after #214/#215 — Stars pass/hasValidMoves leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  hasValidMoves,
  passTurn,
  clearSelection,
  selectCard,
} from '../../src/games/stars-bars/rules';

describe('Overnight stars-bars — pass/hasMoves', () => {
  it('opening has moves; clearSelection resets; empty hand passes', () => {
    const s = createInitialState();
    expect(hasValidMoves(s)).toBe(true);
    const cardId = s.playerHands.player1[0].id;
    const selected = selectCard(s, cardId);
    expect(selected.selectedCard?.id).toBe(cardId);
    expect(clearSelection(selected).selectedCard).toBeNull();
    const empty = {
      ...s,
      playerHands: { ...s.playerHands, player1: [] },
    };
    expect(hasValidMoves(empty)).toBe(false);
    const next = passTurn(empty);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  });
});
