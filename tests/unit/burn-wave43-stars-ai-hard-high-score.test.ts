/**
 * Wave 43 — hard AI high-score preference leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import { getAIMove } from '../../src/games/stars-bars/ai';

describe('Wave 43 stars — AI hard high score', () => {
  it('hard pick is among legal placements for chosen card', () => {
    let s = createInitialState();
    const c = s.playerHands.player1[0];
    s = selectCard(s, c.id);
    s = placeCard(s, 2, 2);
    // back to P1 after P2 would need a turn — forge P1 turn with nonempty board
    s = { ...s, currentPlayer: 'player1', phase: 'selectingCard', selectedCard: null };
    const move = getAIMove(s, 'player1', 'hard');
    expect(move).not.toBeNull();
    const withCard = selectCard(s, move!.cardId);
    const valids = getValidPlacements(withCard);
    expect(valids.some((p) => p.row === move!.row && p.col === move!.col)).toBe(
      true
    );
  });
});
