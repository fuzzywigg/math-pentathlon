/**
 * Wave 48 overnight — Calla analyzeMoves lands on opponent side. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 48 calla overnight — analyze lands opponent', () => {
  it('reasoning mentions adding cubes to opponent side', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      // pit 4 with 2 cubes: sow calla then opp pit → lands opponent
      player1Pits: [0, 0, 0, 0, 2],
      player2Pits: [1, 1, 1, 1, 1],
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses).toHaveLength(1);
    expect(analyses[0].outcome.landsSide).toBe('opponent');
    expect(analyses[0].reasoning).toMatch(/opponent/i);
  });
});
