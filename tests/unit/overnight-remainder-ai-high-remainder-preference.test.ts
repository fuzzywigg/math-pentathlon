/**
 * Overnight HEAVY after #210 — Remainder evaluateMoves high-remainder preference.
 * #210 never asserted scoring factors (high rem / zero rem).
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';
import {
  createInitialState,
  type RemainderIslandsState,
  type Island,
} from '../../src/games/remainder-islands/types';
import { calculateDivision } from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Overnight remainder — high remainder preference', () => {
  it('hard prefers island with remainder >= 4 over zero-remainder peer', () => {
    const base = createInitialState();
    // Craft two unowned islands: value 5 → rem 4 for total 9; value 9 → rem 0
    const high: Island = {
      id: 'high-rem',
      row: 2,
      col: 2,
      value: 5,
      owner: null,
      chips: 0,
    };
    const zero: Island = {
      id: 'zero-rem',
      row: 2,
      col: 3,
      value: 9,
      owner: null,
      chips: 0,
    };
    const roll = { die1: 4, die2: 5, total: 9 };
    expect(calculateDivision(9, 5).remainder).toBeGreaterThanOrEqual(4);
    expect(calculateDivision(9, 9).remainder).toBe(0);

    const state: RemainderIslandsState = {
      ...base,
      islands: [high, zero],
      phase: 'selectIsland',
      currentPlayer: 'player1',
      currentRoll: roll,
      validIslands: [high.id, zero.id],
    };

    vi.spyOn(Math, 'random').mockReturnValue(0.99); // skip randomness
    const choice = getAIIslandChoice(state, 'player1', 'hard');
    expect(choice?.islandId).toBe(high.id);
  });
});
