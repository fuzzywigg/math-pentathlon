/**
 * Overnight HEAVY leftover — Calla player2 capture into red calla.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Overnight wave50 calla — p2 capture', () => {
  it('P2 1-cube sow into empty own pit captures opposite + capturing cube', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player2Pits: [1, 0, 0, 0, 2],
      player1Pits: [0, 0, 0, 4, 1],
      player1Calla: 10,
      player2Calla: 3,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory[0].player).toBe('player2');
    expect(next.moveHistory[0].captured).toBe(5);
    expect(next.player2Pits[1]).toBe(0);
    expect(next.player1Pits[3]).toBe(0);
    expect(next.player2Pits[4]).toBe(2);
    expect(next.player2Calla).toBe(8);
    expect(next.phase).toBe('selectPit');
    expect(next.currentPlayer).toBe('player1');
    expect(getLastMoveInfo(next)).toMatch(/Red distributed 1 cube/);
    expect(getLastMoveInfo(next)).toMatch(/captured 5/);
  });
});
