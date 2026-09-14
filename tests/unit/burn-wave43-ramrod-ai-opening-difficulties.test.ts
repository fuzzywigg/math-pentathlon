/**
 * Wave 43 — Ramrod AI opening difficulties place a rod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn, getAIMove } from '../../src/games/ramrod/ai';

describe('Wave 43 ramrod — AI opening difficulties', () => {
  it('easy/medium/hard return moves and execute flips seat', () => {
    const open = createInitialState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      expect(getAIMove(open, 'player1', d)).not.toBeNull();
    }
    const next = executeAITurn(open, 'player1', 'medium');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(1);
  });
});
