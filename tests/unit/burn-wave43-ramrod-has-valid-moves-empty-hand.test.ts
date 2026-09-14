/**
 * Wave 43 — Ramrod hasValidMoves empty hand. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, hasValidMoves } from '../../src/games/ramrod/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — hasValidMoves empty hand', () => {
  it('empty current hand → false', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const empty = {
      ...s,
      playerRods: { ...s.playerRods, player1: [] as string[] },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });
});
