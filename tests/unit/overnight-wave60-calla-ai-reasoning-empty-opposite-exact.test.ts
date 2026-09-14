/**
 * Wave 60 leftover after tip/#279 — Calla empty-opposite reasoning exact.
 * Tightens wave50 soft regex. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 60 calla — AI empty opposite exact', () => {
  it('locks exact empty-opposite no-capture string', () => {
    const analyses = analyzeMoves(
      {
        ...createInitialState(),
        player1Pits: [1, 0, 0, 0, 0],
        player2Pits: [1, 0, 0, 0, 0],
      },
      'player1'
    );
    expect(analyses).toHaveLength(1);
    expect(analyses[0].reasoning).toBe(
      'Lands on your side but opposite pit is empty (no capture).'
    );
  });
});
