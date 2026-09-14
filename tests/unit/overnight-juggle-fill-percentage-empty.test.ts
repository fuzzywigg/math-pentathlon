/**
 * Overnight HEAVY after #214/#215 — Juggle fill% empty board leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getBoardFillPercentage } from '../../src/games/juggle/rules';

describe('Overnight juggle — fill%', () => {
  it('empty boards are 0%', () => {
    const s = createInitialState();
    expect(getBoardFillPercentage(s.boards.player1)).toBe(0);
    expect(getBoardFillPercentage(s.boards.player2)).toBe(0);
  });
});
