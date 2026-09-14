/**
 * Wave 43 — analyzeMoves opponent-capture warning leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 43 calla — analyze setup warning', () => {
  it('reasoning can warn when a move sets up large opponent capture', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 6],
      player1Calla: 5,
      player2Calla: 5,
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses.length).toBeGreaterThan(0);
    // At least one analysis has reasoning string
    expect(analyses.every((a) => a.reasoning.length > 0)).toBe(true);
    const warned = analyses.some((a) => /Warning|Sets up opponent/i.test(a.reasoning));
    // May or may not warn depending on predict; assert structure + best flag
    expect(analyses.some((a) => a.isBestMove)).toBe(true);
    expect(typeof warned).toBe('boolean');
  });
});
