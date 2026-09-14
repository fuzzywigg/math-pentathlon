/**
 * Wave 43 — P2 medium execute place leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { executeAITurn } from '../../src/games/stars-bars/ai';

describe('Wave 43 stars — AI P2 medium place', () => {
  it('P2 medium move places and returns seat to P1', () => {
    let s = createInitialState();
    const c = s.playerHands.player1[0];
    s = selectCard(s, c.id);
    s = placeCard(s, 2, 2);
    expect(s.currentPlayer).toBe('player2');
    const next = executeAITurn(s, 'player2', 'medium');
    expect(next.moveHistory.length).toBeGreaterThan(s.moveHistory.length);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player1');
    }
  });
});
