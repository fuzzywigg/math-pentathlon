/**
 * Wave 43 — Stars AI null gates + execute difficulties. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/stars-bars/rules';
import { getAIMove, isAITurn, executeAITurn } from '../../src/games/stars-bars/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — AI null/execute', () => {
  it('null wrong seat / gameOver; move for difficulties', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIMove(s, 'player2')).toBeNull();
    expect(getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1')).toBeNull();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(s.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(true);
    }
  });

  it('executeAITurn places a card and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('isAITurn matrix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
  });
});
