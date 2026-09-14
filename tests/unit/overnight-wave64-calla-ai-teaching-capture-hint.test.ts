/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla easy teaching capture hint.
 * Exact template from getTeachingMove; controller mocks a different string. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 64 calla — teaching capture hint exact', () => {
  it('locks Look carefully capture-5 teaching hint on easy', () => {
    let n = 0;
    const seq = [0.05, 0, 0.2, 0.7];
    vi.spyOn(Math, 'random').mockImplementation(() => seq[n++ % seq.length]!);
    const move = getAIMove(
      {
        ...createInitialState(),
        player1Pits: [2, 0, 0, 4, 0],
        player2Pits: [1, 0, 0, 0, 1],
      },
      'player1',
      'easy'
    );
    expect(move?.hint).toBe(
      "Look carefully! There's a chance to capture 5 cubes."
    );
  });
});
