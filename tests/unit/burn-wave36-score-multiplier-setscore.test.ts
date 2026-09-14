/**
 * Wave 36 — scoring multipliers vs setScore / clamp / win leftovers.
 * Beyond wave 31 multipliers / ops-clamp / win-matrix. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  setScore,
  subtractScore,
  addMultiplier,
  removeMultiplier,
  getPlayerScore,
  getRecentEntries,
  checkWinCondition,
  getPlayerData,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(10_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 scoring — setScore ignores multipliers', () => {
  it('setScore writes absolute value while addScore multiplies', () => {
    let state = createScoringState({ maxScore: 1_000 }, ['p1']);
    state = addMultiplier(state, { id: 'x3', name: 'Triple', multiplier: 3 });
    state = addScore(state, 'p1', 10, 'hit');
    expect(getPlayerScore(state, 'p1')).toBe(30);
    expect(getRecentEntries(state, 'p1', 1)[0]?.amount).toBe(30);

    state = setScore(state, 'p1', 10);
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: -20,
      reason: 'set',
    });
  });

  it('subtractScore still applies active multipliers to the negated amount', () => {
    let state = createScoringState({ minScore: -1_000 }, ['p1']);
    state = setScore(state, 'p1', 100);
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = subtractScore(state, 'p1', 10, 'foul');
    expect(getPlayerScore(state, 'p1')).toBe(80); // 100 + (-10 * 2)
    expect(getRecentEntries(state, 'p1', 1)[0]?.amount).toBe(-20);
  });
});

describe('Wave 36 scoring — stacked multipliers with clamps', () => {
  it('multiplies then clamps to maxScore', () => {
    let state = createScoringState({ maxScore: 50 }, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'x2', multiplier: 2 });
    state = addMultiplier(state, { id: 'x5', name: 'x5', multiplier: 5 });
    state = addScore(state, 'p1', 10); // 10 * 2 * 5 = 100 → clamp 50
    expect(getPlayerScore(state, 'p1')).toBe(50);
    // entry stores effective pre-clamp? Looking at code: clamp on total, entry stores effective
    expect(getRecentEntries(state, 'p1', 1)[0]?.amount).toBe(100);
  });

  it('replacing multiplier by id does not stack duplicates', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'boost', name: 'A', multiplier: 2 });
    state = addMultiplier(state, { id: 'boost', name: 'B', multiplier: 4 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.multipliers[0]?.name).toBe('B');
    state = addScore(state, 'p1', 5);
    expect(getPlayerScore(state, 'p1')).toBe(20);
  });

  it('removeMultiplier unknown id is a no-op copy', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'keep', name: 'Keep', multiplier: 2 });
    const before = state;
    state = removeMultiplier(state, 'missing');
    expect(state).not.toBe(before);
    expect(state.multipliers).toHaveLength(1);
    state = addScore(state, 'p1', 3);
    expect(getPlayerScore(state, 'p1')).toBe(6);
  });
});

describe('Wave 36 scoring — exact win with clamp overshoot', () => {
  it('clamped total can miss exact winCondition', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 40 }, maxScore: 30 },
      ['p1']
    );
    state = addScore(state, 'p1', 40);
    expect(getPlayerScore(state, 'p1')).toBe(30);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('target win still fires when clamp equals target', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 30 }, maxScore: 30 },
      ['p1']
    );
    state = addScore(state, 'p1', 100);
    expect(getPlayerScore(state, 'p1')).toBe(30);
    expect(checkWinCondition(state)).toBe('p1');
  });
});

describe('Wave 36 scoring — unknown player ops are silent', () => {
  it('addScore / setScore on missing id leave roster unchanged', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'ghost', 50);
    state = setScore(state, 'ghost', 99);
    expect(state.players).toHaveLength(1);
    expect(getPlayerData(state, 'ghost')).toBeUndefined();
    expect(getPlayerScore(state, 'ghost')).toBe(0);
  });
});
