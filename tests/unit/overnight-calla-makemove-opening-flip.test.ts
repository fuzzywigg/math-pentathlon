/**
 * Overnight TOKENMAXX — Calla opening makeMove seat flip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Overnight calla — opening sow', () => {
  it('legal sow advances history and clears source pit', () => {
    const s = createInitialState();
    const next = makeMove(s, 0);
    expect(next).not.toBe(s);
    expect(next.moveHistory.length).toBe(1);
    expect(next.player1Pits[0]).toBe(0);
    expect(next.moveHistory[0].cubesDistributed).toBe(3);
  });
});
