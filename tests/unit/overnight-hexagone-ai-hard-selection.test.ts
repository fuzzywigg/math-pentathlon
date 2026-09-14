/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone hard selection leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import { getAISelection, executeAITurn } from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight hex-a-gone — hard selection', () => {
  it('hard selects 1..3 bank shapes; execute advances off selectBlocks', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = createInitialState();
    const choice = getAISelection(s, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.blocks.length).toBeGreaterThanOrEqual(1);
    expect(choice!.blocks.length).toBeLessThanOrEqual(3);
    for (const b of choice!.blocks) {
      expect(Object.keys(INITIAL_BANK)).toContain(b);
    }
    const next = executeAITurn(s, 'player1', 'hard');
    expect(
      next.phase === 'placeBlocks' ||
        next.currentPlayer === 'player2' ||
        next.placedBlocks.length > 0
    ).toBe(true);
  }, 20_000);
});
