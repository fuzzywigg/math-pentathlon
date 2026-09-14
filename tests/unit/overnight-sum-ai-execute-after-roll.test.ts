/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes executeAITurn leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { executeAITurn, isAITurn } from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight sum-dominoes — execute AI', () => {
  it('AI turn from rolling progresses phase/seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const s = createInitialState();
    expect(s.phase).toBe('rolling');
    expect(isAITurn(s, 'player1')).toBe(true);
    const next = executeAITurn(s, 'player1', 'hard');
    expect(['rolling', 'placing', 'passing', 'gameOver']).toContain(next.phase);
    const progressed =
      next.currentPlayer !== s.currentPlayer ||
      next.phase !== 'rolling' ||
      next.moveHistory.length > s.moveHistory.length ||
      next.currentDice !== null;
    expect(progressed).toBe(true);
  }, 20_000);
});
