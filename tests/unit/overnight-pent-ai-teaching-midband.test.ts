/**
 * Overnight HEAVY — Pent easy teaching mid-band on constrained inventory.
 * Distinct leftover vs wave42 difficulty random smoke. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getValidPlacements } from '../../src/games/pent-em-in/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — teaching midband', () => {
  it('easy teachingMode with random < 0.4 returns a legal placement', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0);
    const base = createInitialState();
    const state = {
      ...base,
      player1Pieces: { available: ['T', 'Z', 'W', 'F'], placed: [] },
    };
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const valids = getValidPlacements(
      state,
      move!.shapeId,
      move!.rotation,
      move!.flipped
    );
    expect(
      valids.some(
        (p) => p.row === move!.position.row && p.col === move!.position.col
      )
    ).toBe(true);
  });

  it('easy skip teaching still returns legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const base = createInitialState();
    const state = {
      ...base,
      player1Pieces: { available: ['P', 'Y'], placed: [] },
    };
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
  });
});
