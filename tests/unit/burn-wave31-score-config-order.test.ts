/**
 * Wave 31 — scoring config isolation + multi-winner target order stress.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setScore,
  checkWinCondition,
  calculateGameResult,
  getLeaderboard,
  addMultiplier,
  addScore,
  getPlayerScore,
  type ScoringConfig,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — config object isolation', () => {
  it('createScoringState copies config reference as given (shallow)', () => {
    const config: ScoringConfig = {
      winCondition: { type: 'target', value: 10 },
      maxScore: 20,
    };
    const state = createScoringState(config, ['p1']);
    expect(state.config).toBe(config);
    config.maxScore = 99;
    expect(state.config.maxScore).toBe(99);
  });

  it('addMultiplier leaves config identity intact', () => {
    const state = createScoringState({ minScore: 0 }, ['p1']);
    const next = addMultiplier(state, {
      id: 'x2',
      name: 'D',
      multiplier: 2,
    });
    expect(next.config).toBe(state.config);
    expect(next.multipliers).not.toBe(state.multipliers);
  });
});

describe('Wave 31 scoring — target order across many seats', () => {
  it('returns earliest roster player at/over target among many', () => {
    const ids = Array.from({ length: 12 }, (_, i) => `s${i}`);
    let state = createScoringState(
      { winCondition: { type: 'target', value: 25 } },
      ids
    );
    for (let i = 0; i < ids.length; i++) {
      state = setScore(state, ids[i], i === 0 ? 0 : 30);
    }
    // s0 is 0; s1..s11 are 30 — first in array with >= 25 is s1
    expect(checkWinCondition(state)).toBe('s1');
    state = setScore(state, 's0', 25);
    expect(checkWinCondition(state)).toBe('s0');
  });

  it('calculateGameResult still uses leaderboard not checkWinCondition', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 10 } },
      ['low', 'high']
    );
    state = setScore(state, 'low', 10);
    state = setScore(state, 'high', 50);
    expect(checkWinCondition(state)).toBe('low'); // first to target in roster
    expect(getLeaderboard(state)[0].playerId).toBe('high');
    expect(calculateGameResult(state, 1).winnerId).toBe('high');
  });
});

describe('Wave 31 scoring — clamp preserves entry amount vs total', () => {
  it('entry records pre-clamp effective amount when maxScore hits', () => {
    let state = createScoringState({ maxScore: 10 }, ['p1']);
    state = addMultiplier(state, { id: 'x3', name: 'T', multiplier: 3 });
    state = addScore(state, 'p1', 5); // effective 15, total clamped 10
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(state.players[0].entries[0].amount).toBe(15);
  });
});
