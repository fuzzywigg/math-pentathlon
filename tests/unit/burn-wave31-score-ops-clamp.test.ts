/**
 * Wave 31 — addScore / subtractScore / setScore / resetScores clamp ledger.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  subtractScore,
  setScore,
  resetScores,
  getPlayerScore,
  getPlayerData,
  getRecentEntries,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(5_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 31 scoring — accumulation + reasons', () => {
  it('accumulates with reasons and timestamps', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 3, 'alpha');
    vi.setSystemTime(6_000);
    state = addScore(state, 'p1', 7, 'beta');
    const data = getPlayerData(state, 'p1')!;
    expect(data.total).toBe(10);
    expect(data.entries.map((e) => e.reason)).toEqual(['alpha', 'beta']);
    expect(data.entries.map((e) => e.amount)).toEqual([3, 7]);
    expect(data.entries[0].timestamp).toBe(5_000);
    expect(data.entries[1].timestamp).toBe(6_000);
  });

  it('subtractScore is addScore with negated amount', () => {
    let state = createScoringState({ minScore: -100 }, ['p1']);
    state = addScore(state, 'p1', 20);
    state = subtractScore(state, 'p1', 8, 'penalty');
    expect(getPlayerScore(state, 'p1')).toBe(12);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: -8,
      reason: 'penalty',
    });
  });
});

describe('Wave 31 scoring — clamp max/min matrix', () => {
  it('maxScore clamps overshoot from add and set', () => {
    let state = createScoringState({ maxScore: 50 }, ['p1']);
    state = addScore(state, 'p1', 80);
    expect(getPlayerScore(state, 'p1')).toBe(50);
    state = setScore(state, 'p1', 999);
    expect(getPlayerScore(state, 'p1')).toBe(50);
  });

  it('minScore clamps undershoot from subtract and set', () => {
    let state = createScoringState({ minScore: 10 }, ['p1']);
    state = setScore(state, 'p1', 15);
    state = subtractScore(state, 'p1', 100);
    expect(getPlayerScore(state, 'p1')).toBe(10);
    state = setScore(state, 'p1', 0);
    expect(getPlayerScore(state, 'p1')).toBe(10);
  });

  it('both min and max clamp setScore into band', () => {
    let state = createScoringState({ minScore: 0, maxScore: 100 }, ['p1']);
    state = setScore(state, 'p1', -5);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    state = setScore(state, 'p1', 150);
    expect(getPlayerScore(state, 'p1')).toBe(100);
  });
});

describe('Wave 31 scoring — setScore ledger delta', () => {
  it('records amount as delta from previous total', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 40);
    state = setScore(state, 'p1', 15);
    const entry = getRecentEntries(state, 'p1', 1)[0];
    expect(entry.amount).toBe(15 - 40);
    expect(entry.reason).toBe('set');
    expect(getPlayerScore(state, 'p1')).toBe(15);
  });
});

describe('Wave 31 scoring — resetScores clears entries', () => {
  it('zeros totals and wipes entry history for all players', () => {
    let state = createScoringState({}, ['p1', 'p2']);
    state = addScore(state, 'p1', 11, 'x');
    state = addScore(state, 'p2', 22, 'y');
    state = resetScores(state);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getPlayerScore(state, 'p2')).toBe(0);
    expect(getPlayerData(state, 'p1')!.entries).toEqual([]);
    expect(getPlayerData(state, 'p2')!.entries).toEqual([]);
  });

  it('does not mutate prior state object', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 9);
    const before = state;
    const after = resetScores(state);
    expect(after).not.toBe(before);
    expect(getPlayerScore(before, 'p1')).toBe(9);
    expect(getPlayerScore(after, 'p1')).toBe(0);
  });
});

describe('Wave 31 scoring — multi-player isolation', () => {
  it('scoring one seat never alters another total', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = addScore(state, 'a', 5);
    state = addScore(state, 'b', 8);
    state = subtractScore(state, 'a', 2);
    state = setScore(state, 'c', 100);
    expect(getPlayerScore(state, 'a')).toBe(3);
    expect(getPlayerScore(state, 'b')).toBe(8);
    expect(getPlayerScore(state, 'c')).toBe(100);
  });
});
