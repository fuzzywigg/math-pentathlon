/**
 * Wave 36 — scoring min/max clamp matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  subtractScore,
  setScore,
  getPlayerScore,
  getRecentEntries,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(9_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 score-clamp — max only / min only / both', () => {
  it('maxScore clamps addScore and records effective amount', () => {
    let state = createScoringState({ maxScore: 10 }, ['p1']);
    state = addScore(state, 'p1', 7);
    state = addScore(state, 'p1', 7, 'overflow');
    expect(getPlayerScore(state, 'p1')).toBe(10);
    const last = getRecentEntries(state, 'p1', 1)[0]!;
    expect(last.amount).toBe(7); // multiplier path records pre-clamp? actually effective=7, total clamped
    expect(last.reason).toBe('overflow');
    // total is clamped; entry amount is still the effective add before clamp in code:
    // newTotal = clampScore(p.total + effective) but entry stores `effective` not delta-to-clamped
    expect(last.amount).toBe(7);
  });

  it('minScore clamps subtractScore', () => {
    let state = createScoringState({ minScore: 0 }, ['p1']);
    state = setScore(state, 'p1', 3);
    state = subtractScore(state, 'p1', 10, 'floor');
    expect(getPlayerScore(state, 'p1')).toBe(0);
  });

  it('both min and max bound setScore', () => {
    let state = createScoringState({ minScore: 5, maxScore: 20 }, ['p1']);
    state = setScore(state, 'p1', 100);
    expect(getPlayerScore(state, 'p1')).toBe(20);
    state = setScore(state, 'p1', 1);
    expect(getPlayerScore(state, 'p1')).toBe(5);
  });

  it('setScore entry amount is clampedDelta from previous total', () => {
    let state = createScoringState({ maxScore: 50 }, ['p1']);
    state = setScore(state, 'p1', 10);
    state = setScore(state, 'p1', 40);
    const entry = getRecentEntries(state, 'p1', 1)[0]!;
    expect(entry.amount).toBe(30);
    expect(entry.reason).toBe('set');
    expect(entry.timestamp).toBe(9_000);
  });
});

describe('Wave 36 score-clamp — unknown player no-ops', () => {
  it('add/set/subtract on missing id leave roster unchanged', () => {
    const base = createScoringState({}, ['p1']);
    const a = addScore(base, 'ghost', 5);
    const b = setScore(base, 'ghost', 5);
    const c = subtractScore(base, 'ghost', 5);
    expect(a.players).toEqual(base.players);
    expect(b.players).toEqual(base.players);
    expect(c.players).toEqual(base.players);
    expect(getPlayerScore(a, 'ghost')).toBe(0);
  });
});
