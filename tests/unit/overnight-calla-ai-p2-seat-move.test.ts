/**
 * Overnight HEAVY after #214/#215 — Calla AI as player2 seat. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getValidPits } from '../../src/games/calla/rules';
import { getAIMove, isAITurn } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight calla — P2 seat AI', () => {
  it('after P1 sow, AI as player2 returns a legal pit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let s = createInitialState();
    s = makeMove(s, 0);
    // free-turn may keep P1; keep sowing until P2 if needed
    let guard = 0;
    while (s.currentPlayer === 'player1' && s.phase !== 'gameOver' && guard++ < 8) {
      const pits = getValidPits(s);
      if (pits.length === 0) break;
      s = makeMove(s, pits[0]);
    }
    expect(s.currentPlayer).toBe('player2');
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(true);
    const move = getAIMove(s, 'player2', 'hard');
    expect(move).not.toBeNull();
    expect(getValidPits(s)).toContain(move!.pit);
  }, 15_000);
});
