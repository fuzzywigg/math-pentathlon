/**
 * Wave 42 — Contig easy teaching fallthrough to best option.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Contig AI — easy best fallback', () => {
  it('easy random≥0.4 returns a valid top placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      currentPlayer: 'player1' as const,
    };
    const move = getAIPlacement(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const allowed = getValidPlacements(state, [2, 3, 4]).map((p) => p.result);
    expect(allowed).toContain(move!.value);
  });
});
