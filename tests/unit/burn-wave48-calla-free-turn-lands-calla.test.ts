/**
 * Wave 48 — Calla free turn when last cube lands in own Calla. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — free turn calla land', () => {
  it('pit with exact distance to calla keeps seat and records free turn', () => {
    // Opening: 3 cubes in each pit. Pit index 2: start at pos 3 → 4 → calla (5).
    const next = makeMove(createInitialState(), 2);
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.player1Calla).toBeGreaterThan(0);
  });
});
