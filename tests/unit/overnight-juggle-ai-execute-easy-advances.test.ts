/**
 * Overnight HEAVY after #214/#215 — Juggle executeAITurn easy advances. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight juggle — execute easy', () => {
  it('easy execute after roll places or advances off selectingShape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const before = doRollDice(createInitialState());
    expect(before.phase).toBe('selectingShape');
    const next = executeAITurn(before, 'player1', 'easy');
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(next.phase);
    const progressed =
      next.currentPlayer !== before.currentPlayer ||
      next.phase !== before.phase ||
      next.moveHistory.length > before.moveHistory.length ||
      next.selectedCategory !== before.selectedCategory ||
      next.selectedShape !== before.selectedShape;
    expect(progressed).toBe(true);
  }, 20_000);
});
