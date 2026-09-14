/**
 * Overnight HEAVY — Pent hard prefers F over X when both available (priority table).
 * Constrained inventory. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — piece priority open', () => {
  it('hard prefers F (+3) over X (-5) when only those two remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const base = createInitialState();
    const state = {
      ...base,
      player1Pieces: { available: ['X', 'F'], placed: [] },
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBe('F');
  });
});
