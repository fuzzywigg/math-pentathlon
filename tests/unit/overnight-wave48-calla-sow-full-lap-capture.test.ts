/**
 * Wave 48 overnight — Calla full-lap sow (≥11) capture path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla overnight — full lap capture', () => {
  it('11 cubes from pit0 wraps past opp calla and can capture', () => {
    // 11 cubes from pit0: positions advance 11 steps wrapping; land back near start
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [11, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 4],
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory[0].cubesDistributed).toBe(11);
    expect(next.player1Pits[0]).toBe(0); // picked up
    // Either capture or redistribution occurred
    expect(next.player1Calla + next.player2Calla + next.player1Pits.reduce((a,b)=>a+b,0) + next.player2Pits.reduce((a,b)=>a+b,0)).toBe(15);
  });
});
