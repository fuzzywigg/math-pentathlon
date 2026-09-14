/**
 * Overnight HEAVY leftover — Calla P2 emptying sweep + unknown phase message.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, isGameOver, getPhaseMessage } from '../../src/games/calla/rules';

describe('Overnight wave50 calla — p2 sweep / default phase', () => {
  it('P2 emptying own side sweeps P1 remainder and can crown Red', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player2Pits: [0, 0, 0, 0, 1],
      player1Pits: [3, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 16,
    };
    const next = makeMove(state, 4);
    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
    expect(next.player1Calla).toBe(13);
    expect(next.player2Calla).toBe(17);
    expect(next.winner).toBe('player2');
    expect(getPhaseMessage(next)).toBe('Red wins!');
  });

  it('unknown phase string yields empty message', () => {
    const weird = {
      ...createInitialState(),
      phase: 'not-a-phase' as unknown as 'selectPit',
    };
    expect(getPhaseMessage(weird)).toBe('');
  });
});
