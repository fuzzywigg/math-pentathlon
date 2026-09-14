/**
 * Wave 44 overnight HEAVY — Fab executeAITurn happy path flips seat.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { executeAITurn } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — execute happy', () => {
  it.each(['easy', 'medium', 'hard'] as const)('difficulty %s records history', (d) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const next = executeAITurn(createInitialState(), 'player1', d);
    expect(next.moveHistory.length).toBe(1);
    expect(next.scores.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
