/**
 * Wave 48 — Calla canSelectPit OOB / wrong seat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { canSelectPit } from '../../src/games/calla/rules';

describe('Wave 48 calla — OOB pit reject', () => {
  it('rejects negative, >=5, and wrong seat', () => {
    const s = createInitialState();
    expect(canSelectPit(s, 'player1', -1)).toBe(false);
    expect(canSelectPit(s, 'player1', 5)).toBe(false);
    expect(canSelectPit(s, 'player2', 0)).toBe(false);
  });
});
