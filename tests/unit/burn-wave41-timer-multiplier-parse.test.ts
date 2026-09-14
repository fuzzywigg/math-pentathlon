/**
 * Wave 41 — Timer/score multiplier replace + HH:MM:SS parse leftovers.
 * Avoids PR182 up-complete/pause. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createScoringState,
  addPlayer,
  addMultiplier,
  removeMultiplier,
  calculateGameResult,
  parseTime,
  formatTime,
  createTimer,
  isTimerComplete,
  startTimer,
} from '../../src/core/timer-scoring';

describe('Wave 41 timer-scoring — multiplier / parse', () => {
  it('addMultiplier same id replaces previous', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1');
    state = addMultiplier(state, { id: 'm1', name: 'x2', multiplier: 2 });
    state = addMultiplier(state, { id: 'm1', name: 'x3', multiplier: 3 });
    const m = state.multipliers.filter((x) => x.id === 'm1');
    expect(m).toHaveLength(1);
    expect(m[0].multiplier).toBe(3);
  });

  it('removeMultiplier ghost leaves contents equivalent', () => {
    let state = createScoringState();
    state = addMultiplier(state, { id: 'keep', name: 'k', multiplier: 2 });
    const next = removeMultiplier(state, 'ghost');
    expect(next.multipliers.map((m) => m.id)).toEqual(['keep']);
  });

  it('calculateGameResult empty → null winner', () => {
    const state = createScoringState();
    const result = calculateGameResult(state, 1000);
    expect(result.winnerId).toBeNull();
    expect(result.isTie).toBe(false);
    expect(result.tiedPlayerIds).toEqual([]);
  });

  it('parseTime HH:MM:SS and format options', () => {
    expect(parseTime('01:02:03')).toBe((1 * 3600 + 2 * 60 + 3) * 1000);
    const formatted = formatTime(65000, {
      showMilliseconds: true,
      padMinutes: false,
      separator: '.',
    });
    expect(formatted).toMatch(/1\.05/);
  });

  it('isTimerComplete countdown remaining 0 → true', () => {
    let timer = createTimer({ direction: 'down', initialTime: 5000 });
    timer = startTimer(timer);
    timer = { ...timer, remaining: 0, state: 'stopped' };
    expect(isTimerComplete(timer)).toBe(true);
  });
});
