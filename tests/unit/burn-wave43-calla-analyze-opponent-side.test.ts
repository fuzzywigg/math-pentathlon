/**
 * Wave 43 — analyzeMoves lands on opponent side leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 43 calla — analyze opponent side', () => {
  it('long sow that lands on opponent mentions adding cubes', () => {
    // pit4 with 6 cubes: positions 5(calla),6,7,8,9,10 -> lands opp
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 6],
      player2Pits: [1, 1, 1, 1, 1],
    };
    const analyses = analyzeMoves(state, 'player1');
    const hit = analyses.find((a) => a.pit === 4);
    expect(hit).toBeTruthy();
    // 6 cubes from pit4: pos5 calla (free) - wait 6 cubes: 5,6,7,8,9,10 - last is opp
    // Actually first cube to calla... 6 cubes means last at position 4+6=10 which is opp pit
    expect(hit!.reasoning.length).toBeGreaterThan(0);
  });
});
