/**
 * Wave 36 — timer warning/critical dense boundary leftovers.
 * Extends wave 31 table with asymmetric thresholds + negative remaining.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  addTime,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer-threshold — asymmetric pairs', () => {
  const pairs = [
    { warning: 10_000, critical: 2_000 },
    { warning: 5_000, critical: 5_000 }, // equal thresholds → warning never true
    { warning: 1_000, critical: 2_000 }, // critical > warning → odd band
    { warning: 100, critical: 0 },
  ];

  it('enumerates remaining around each pair', () => {
    for (const { warning, critical } of pairs) {
      const samples = new Set<number>([
        warning + 1,
        warning,
        warning - 1,
        critical + 1,
        critical,
        critical - 1,
        0,
        -1,
        Math.floor((warning + critical) / 2),
      ]);
      for (const remaining of samples) {
        const t = createTimer({
          initialTime: Math.max(warning, critical, 1) * 2,
          warningThreshold: warning,
          criticalThreshold: critical,
        });
        t.remaining = remaining;
        const warn = isTimerWarning(t);
        const crit = isTimerCritical(t);
        // invariants from implementation
        if (criticalThresholdDefined(critical)) {
          expect(crit).toBe(remaining <= critical);
        }
        if (warn) {
          expect(remaining).toBeLessThanOrEqual(warning);
          expect(remaining).toBeGreaterThan(critical);
        }
        expect(typeof isTimerComplete(t)).toBe('boolean');
      }
    }
  });
});

function criticalThresholdDefined(_c: number): boolean {
  return true;
}

describe('Wave 36 timer-threshold — equal warning==critical', () => {
  it('warning is never true when remaining<=critical always when at bound', () => {
    const t = createTimer({
      initialTime: 10_000,
      warningThreshold: 3_000,
      criticalThreshold: 3_000,
    });
    for (const remaining of [3_001, 3_000, 2_999, 0]) {
      t.remaining = remaining;
      expect(isTimerWarning(t)).toBe(false);
      expect(isTimerCritical(t)).toBe(remaining <= 3_000);
    }
  });
});

describe('Wave 36 timer-threshold — addTime drives bands', () => {
  it('walks from safe → warning → critical → complete', () => {
    let t = createTimer({
      initialTime: 10_000,
      warningThreshold: 4_000,
      criticalThreshold: 1_000,
    });
    expect(isTimerWarning(t)).toBe(false);
    t = addTime(t, -6_000); // 4000
    expect(isTimerWarning(t)).toBe(true);
    t = addTime(t, -3_000); // 1000
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(true);
    t = addTime(t, -1_000); // 0
    expect(isTimerComplete(t)).toBe(true);
  });
});
