/**
 * Wave 60 leftover after tip/#279 — Calla Captures N cubes! exact.
 * Distinct from #289 free-turn/opponent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 60 calla — AI capture exact', () => {
  it('locks Captures 5 cubes! on happy-path board', () => {
    const analyses = analyzeMoves(
      {
        ...createInitialState(),
        player1Pits: [1, 0, 0, 0, 0],
        player2Pits: [0, 0, 0, 4, 0],
      },
      'player1'
    );
    expect(analyses[0].reasoning).toBe('Captures 5 cubes!');
  });
});
