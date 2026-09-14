/**
 * Wave 43 — Stars select/clear/first placement leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectCard,
  clearSelection,
  getValidPlacements,
  placeCard,
  hasValidMoves,
  passTurn,
} from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — select/place first', () => {
  it('select own card; ghost identity; clear restores selecting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const card = s.playerHands.player1[0];
    const selected = selectCard(s, card.id);
    expect(selected.phase).toBe('placingCard');
    expect(selected.selectedCard?.id).toBe(card.id);
    expect(selectCard(s, 'ghost')).toBe(s);
    const over = { ...s, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(selectCard(over, card.id)).toBe(over);
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingCard');
    expect(cleared.selectedCard).toBeNull();
  });

  it('empty board: all 25 placements valid; place records first-card score 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getValidPlacements(s)).toHaveLength(25);
    expect(hasValidMoves(s)).toBe(true);
    const card = s.playerHands.player1[0];
    const selected = selectCard(s, card.id);
    const next = placeCard(selected, 2, 2);
    expect(next.cells[2][2].card?.id).toBe(card.id);
    expect(next.playerScores.player1).toBe(0);
    expect(next.moveHistory[0].breakdown).toMatch(/first card/);
    expect(next.currentPlayer).toBe('player2');
    expect(next.playerHands.player1).toHaveLength(5); // drew replacement
  });

  it('place occupied / wrong phase identity; pass flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(placeCard(s, 0, 0)).toBe(s);
    const passed = passTurn(s);
    expect(passed.currentPlayer).toBe('player2');
    expect(passTurn({ ...s, phase: 'gameOver', winner: 'player1' }).phase).toBe('gameOver');
  });
});
