/**
 * Overnight TOKENMAXX — Stars empty-valids execute pass leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/stars-bars/rules';
import { getAIMove, executeAITurn } from '../../src/games/stars-bars/ai';

describe('Overnight stars — empty valids pass', () => {
  it('empty hand → null move; execute passes seat', () => {
    const s = createInitialState();
    s.playerHands.player1 = [];
    expect(hasValidMoves(s)).toBe(false);
    expect(getAIMove(s, 'player1', 'easy')).toBeNull();
    const next = executeAITurn(s, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(0);
  });
});
