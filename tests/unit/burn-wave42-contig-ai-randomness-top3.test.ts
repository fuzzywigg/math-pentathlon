/**
 * Wave 42 — Contig AI medium/hard randomness top-3 pick.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Contig AI — randomness top3', () => {
  it('medium with random in band returns valid placement', () => {
    // medium randomness 0.15 — force into branch
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 3, 5] as [number, number, number],
      currentPlayer: 'player1' as const,
    };
    const move = getAIPlacement(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const allowed = getValidPlacements(state, [1, 3, 5]).map((p) => p.result);
    expect(allowed).toContain(move!.value);
  });
});
