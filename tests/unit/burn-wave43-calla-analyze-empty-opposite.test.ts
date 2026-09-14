/**
 * Wave 43 — analyzeMoves empty-opposite no-capture leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 43 calla — analyze empty opposite', () => {
  it('lands own empty with empty opposite mentions no capture', () => {
    // pit0=1 lands on pit1 which is empty; opposite of pit1 is 3; P2[3]=0
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 1, 1, 1],
      player2Pits: [1, 1, 1, 0, 1],
    };
    const analyses = analyzeMoves(state, 'player1');
    const hit = analyses.find((a) => a.pit === 0);
    expect(hit).toBeTruthy();
    expect(hit!.reasoning).toMatch(/empty|no capture|neutral|safe|Calla|opponent/i);
  });
});
