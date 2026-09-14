/**
 * Wave 43 — Calla AI difficulties + analyzeMoves leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves, getAIMove, isAITurn } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 calla — AI analyze/difficulties', () => {
  it('analyzeMoves scores opening pits', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    expect(analyses.length).toBe(5);
    for (const a of analyses) {
      expect(a.pit).toBeGreaterThanOrEqual(0);
      expect(typeof a.score).toBe('number');
    }
  });

  it('getAIMove null wrong seat / gameOver; returns pit for difficulties', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIMove(s, 'player2')).toBeNull();
    expect(getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1')).toBeNull();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(move!.pit).toBeGreaterThanOrEqual(0);
      expect(move!.pit).toBeLessThan(5);
    }
  });

  it('isAITurn matrix', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
  });
});
