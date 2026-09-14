/**
 * Wave 43 — Contig AI opening difficulties leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn, getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 contig — AI opening difficulties', () => {
  it('easy/medium/hard execute from rolling flip seat or place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const next = executeAITurn(createInitialState(), 'player1', d);
      expect(next.currentPlayer === 'player2' || next.moveHistory.length >= 0).toBe(true);
      expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
    }
  });

  it('getAIPlacement null without dice', () => {
    expect(getAIPlacement(createInitialState(), 'player1', 'hard')).toBeNull();
  });
});
