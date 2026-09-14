/**
 * Wave 44 overnight HEAVY — Fab AI as player2 seat.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { executeAITurn, isAITurn } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — P2 seat', () => {
  it('AI on player2 executes from flipped seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(s, 'player2', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.scores.player2).toBe(1);
    expect(next.currentPlayer).toBe('player1');
  });
});
