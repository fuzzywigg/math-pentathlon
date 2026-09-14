/**
 * Wave 36 — timer + scoring immutability / structural sharing leftovers.
 * Beyond wave 31 ops isolation. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  addTime,
  createScoringState,
  addPlayer,
  addScore,
  addMultiplier,
  setPointValues,
  getPlayerData,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(42);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 immutability — timer structural sharing', () => {
  it('startTimer shares config reference but new root object', () => {
    const t0 = createTimer({ initialTime: 9_000 });
    const t1 = startTimer(t0);
    expect(t1).not.toBe(t0);
    expect(t1.config).toBe(t0.config);
    expect(t0.state).toBe('stopped');
    expect(t1.state).toBe('running');
  });

  it('addTime shares config and leaves elapsed/startTime untouched', () => {
    let t = createTimer({ initialTime: 5_000 });
    t = startTimer(t);
    const before = t;
    const after = addTime(t, -100);
    expect(after).not.toBe(before);
    expect(after.config).toBe(before.config);
    expect(after.startTime).toBe(before.startTime);
    expect(after.elapsed).toBe(before.elapsed);
    expect(after.remaining).toBe(4_900);
  });
});

describe('Wave 36 immutability — scoring structural sharing', () => {
  it('addPlayer shares config/multipliers and copies players array', () => {
    const s0 = createScoringState({ maxScore: 10 });
    const s1 = addPlayer(s0, 'p1', 'One');
    expect(s1).not.toBe(s0);
    expect(s1.config).toBe(s0.config);
    expect(s1.multipliers).toBe(s0.multipliers);
    expect(s1.players).not.toBe(s0.players);
    expect(s0.players).toHaveLength(0);
  });

  it('addScore does not mutate prior player entries arrays', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'a');
    const beforeEntries = getPlayerData(state, 'p1')!.entries;
    const next = addScore(state, 'p1', 2, 'b');
    expect(getPlayerData(state, 'p1')!.entries).toBe(beforeEntries);
    expect(getPlayerData(state, 'p1')!.entries).toHaveLength(1);
    expect(getPlayerData(next, 'p1')!.entries).toHaveLength(2);
    expect(getPlayerData(next, 'p1')!.entries).not.toBe(beforeEntries);
  });

  it('addMultiplier and setPointValues leave prior state intact', () => {
    let state = createScoringState({ pointValues: { hit: 1 } }, ['p1']);
    const prior = state;
    state = addMultiplier(state, { id: 'x2', name: 'x2', multiplier: 2 });
    state = setPointValues(state, { miss: 0 });
    expect(prior.multipliers).toHaveLength(0);
    expect(prior.config.pointValues).toEqual({ hit: 1 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.config.pointValues).toEqual({ hit: 1, miss: 0 });
  });
});
