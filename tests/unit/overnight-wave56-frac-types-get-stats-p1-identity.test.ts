/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact getPlayerStats p1 identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerStats,
} from '../../src/games/frac-fact/types';

describe('Wave 56 frac types — getStats p1 identity', () => {
  it('getPlayerStats player1 returns same object leftover', () => {
    const state = createInitialState();
    expect(getPlayerStats(state, 'player1')).toBe(state.player1Stats);
  });
});
