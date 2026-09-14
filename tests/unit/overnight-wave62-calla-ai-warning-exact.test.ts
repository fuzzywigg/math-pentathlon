/**
 * Wave 62 leftover after #293 — Calla analyzeMoves Warning exact string.
 * Tightens wave50 soft /Warning: Sets up opponent/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 62 calla — AI warning exact', () => {
  it('locks Warning: Sets up opponent to capture 5 cubes!', () => {
    const analyses = analyzeMoves(
      {
        ...createInitialState(),
        player1Pits: [2, 0, 0, 4, 0],
        player2Pits: [1, 0, 0, 0, 1],
      },
      'player1'
    );
    const pit0 = analyses.find((a) => a.pit === 0);
    expect(pit0?.reasoning).toBe(
      'Lands on your side but opposite pit is empty (no capture). Warning: Sets up opponent to capture 5 cubes!'
    );
  });
});
