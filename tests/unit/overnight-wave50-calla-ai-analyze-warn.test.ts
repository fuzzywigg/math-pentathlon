/**
 * Overnight HEAVY leftover — Calla analyzeMoves opponent-capture warning.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Overnight wave50 calla — analyze opp-capture warning', () => {
  it('warns when a sow leaves opponent a capture larger than 2', () => {
    const analyses = analyzeMoves(
      {
        ...createInitialState(),
        player1Pits: [2, 0, 0, 4, 0],
        player2Pits: [1, 0, 0, 0, 1],
      },
      'player1'
    );
    const warned = analyses.filter((a) => /Warning: Sets up opponent/i.test(a.reasoning));
    expect(warned.length).toBeGreaterThan(0);
    expect(warned[0].reasoning).toMatch(/capture \d+ cubes/i);
  });
});
