/**
 * Wave 36 — scoring entries ledger stress leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addScore,
  subtractScore,
  setScore,
  getRecentEntries,
  getPlayerData,
  resetScores,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 score-ledger — long entry history', () => {
  it('preserves chronological entries; recent is reverse slice', () => {
    let state = createScoringState({}, ['p1']);
    for (let i = 0; i < 25; i++) {
      vi.setSystemTime(1000 + i * 10);
      state = addScore(state, 'p1', 1, `step-${i}`);
    }
    const data = getPlayerData(state, 'p1')!;
    expect(data.entries).toHaveLength(25);
    expect(data.entries[0]!.reason).toBe('step-0');
    expect(data.entries[24]!.reason).toBe('step-24');
    expect(data.total).toBe(25);

    const recent5 = getRecentEntries(state, 'p1', 5);
    expect(recent5.map((e) => e.reason)).toEqual([
      'step-24',
      'step-23',
      'step-22',
      'step-21',
      'step-20',
    ]);
    expect(recent5[0]!.timestamp).toBe(1000 + 24 * 10);
  });

  it('mixed add/sub/set ledger amounts', () => {
    let state = createScoringState({ minScore: -50, maxScore: 50 }, ['p1']);
    vi.setSystemTime(2000);
    state = addScore(state, 'p1', 10, 'a');
    vi.setSystemTime(2010);
    state = subtractScore(state, 'p1', 3, 'b');
    vi.setSystemTime(2020);
    state = setScore(state, 'p1', 40);
    const recent = getRecentEntries(state, 'p1', 3);
    expect(recent.map((e) => e.amount)).toEqual([33, -3, 10]);
    expect(recent[0]!.reason).toBe('set');
  });

  it('resetScores wipes ledger', () => {
    let state = createScoringState({}, ['p1', 'p2']);
    state = addScore(state, 'p1', 5);
    state = addScore(state, 'p2', 8);
    state = resetScores(state);
    expect(getRecentEntries(state, 'p1', 10)).toEqual([]);
    expect(getRecentEntries(state, 'p2', 10)).toEqual([]);
  });
});
