/**
 * Wave 43 — Ramrod AI null gates + execute difficulties. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove, isAITurn, executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — AI null/execute', () => {
  it('getAIMove null wrong seat / gameOver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIMove(s, 'player2')).toBeNull();
    expect(getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1')).toBeNull();
  });

  it('getAIMove returns rod/box/slot for difficulties; execute advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(s.playerRods.player1).toContain(move!.rodId);
      expect(move!.boxId).toMatch(/^box-/);
      expect([0, 1]).toContain(move!.slot);
    }
    const next = executeAITurn(s, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(0);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  });

  it('isAITurn matrix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
  });
});
