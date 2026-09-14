/**
 * Wave 48 — Calla side-empty settles remaining cubes to non-empty side. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, isGameOver } from '../../src/games/calla/rules';

describe('Wave 48 calla — p1 empty sweep settle', () => {
  it('emptying p1 side via calla-land sweeps p2 pits and ends game', () => {
    // Single cube in pit4 lands in calla → p1 pits empty → game over + sweep
    const s = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [2, 0, 0, 0, 0],
      player1Calla: 14,
      player2Calla: 13,
    };
    const next = makeMove(s, 4);
    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Calla).toBe(15); // 13 + swept 2
    expect(next.winner).not.toBeNull();
  });
});
