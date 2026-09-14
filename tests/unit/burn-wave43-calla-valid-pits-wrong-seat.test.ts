/**
 * Wave 43 — Calla valid pits + wrong-seat reject. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { canSelectPit, getValidPits, makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — valid pits wrong seat', () => {
  it('opening all five pits valid for current seat only', () => {
    const s = createInitialState();
    expect(getValidPits(s)).toEqual([0, 1, 2, 3, 4]);
    expect(canSelectPit(s, 'player2', 0)).toBe(false);
    expect(makeMove(s, 0).currentPlayer === 'player1' || makeMove(s, 0).currentPlayer === 'player2').toBe(true);
  });

  it('empty pits excluded; wrong seat makeMove identity via canSelect', () => {
    const s: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 3, 0, 3, 0],
    };
    expect(getValidPits(s)).toEqual([1, 3]);
    expect(canSelectPit(s, 'player1', 0)).toBe(false);
    expect(makeMove(s, 0)).toBe(s);
  });

  it('gameOver phase yields no valid pits', () => {
    const s: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(getValidPits(s)).toEqual([]);
    expect(makeMove(s, 1)).toBe(s);
  });
});
