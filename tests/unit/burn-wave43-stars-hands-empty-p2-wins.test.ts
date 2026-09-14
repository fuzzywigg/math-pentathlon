/**
 * Wave 43 — both hands empty P2 higher win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import type { AttributeCard } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — hands empty P2 wins', () => {
  it('last P1 card with empty deck and empty P2 hand → P2 wins if ahead', () => {
    let s = createInitialState();
    const last: AttributeCard = s.playerHands.player1[0];
    s = {
      ...s,
      deck: [],
      playerHands: {
        player1: [last],
        player2: [],
      },
      playerScores: { player1: 3, player2: 10 },
    };
    s = selectCard(s, last.id);
    const next = placeCard(s, 0, 0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });
});
