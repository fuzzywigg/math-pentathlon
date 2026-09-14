/**
 * Wave 48 — Juggle getAIShapeChoice when category selected. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIShapeChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — AI shape tetromino', () => {
  it('returns a tetromino shape for selected category', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 5] as [number, number],
      selectedCategory: 'tetromino' as const,
    };
    const choice = getAIShapeChoice(state, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(choice!.shape.size).toBe(4);
  });
});
