/**
 * Wave 31 — warning / critical / complete threshold boundary table.
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

describe('Wave 31 timer — threshold undefined gates', () => {
  it('warning false when warningThreshold missing', () => {
    const t = createTimer({ initialTime: 10_000, criticalThreshold: 1_000 });
    t.remaining = 500;
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(true);
  });

  it('critical false when criticalThreshold missing', () => {
    const t = createTimer({ initialTime: 10_000, warningThreshold: 4_000 });
    t.remaining = 100;
    expect(isTimerCritical(t)).toBe(false);
    expect(isTimerWarning(t)).toBe(true);
  });

  it('critical defaults comparison floor to 0 when only warning set', () => {
    // isTimerWarning uses criticalThreshold ?? 0 as exclusive lower bound
    const t = createTimer({ initialTime: 5_000, warningThreshold: 2_000 });
    t.remaining = 0;
    expect(isTimerWarning(t)).toBe(false);
    t.remaining = 1;
    expect(isTimerWarning(t)).toBe(true);
  });
});

describe('Wave 31 timer — exact boundary table', () => {
  const warning = 4_000;
  const critical = 1_000;

  const rows: Array<{
    remaining: number;
    warn: boolean;
    crit: boolean;
    complete: boolean;
  }> = [
    { remaining: 10_000, warn: false, crit: false, complete: false },
    { remaining: 4_001, warn: false, crit: false, complete: false },
    { remaining: 4_000, warn: true, crit: false, complete: false },
    { remaining: 2_000, warn: true, crit: false, complete: false },
    { remaining: 1_001, warn: true, crit: false, complete: false },
    { remaining: 1_000, warn: false, crit: true, complete: false },
    { remaining: 500, warn: false, crit: true, complete: false },
    { remaining: 1, warn: false, crit: true, complete: false },
    { remaining: 0, warn: false, crit: true, complete: true },
  ];

  it.each(rows)(
    'remaining=$remaining → warn=$warn crit=$crit complete=$complete',
    ({ remaining, warn, crit, complete }) => {
      const t = createTimer({
        direction: 'down',
        initialTime: 10_000,
        warningThreshold: warning,
        criticalThreshold: critical,
      });
      t.remaining = remaining;
      expect(isTimerWarning(t)).toBe(warn);
      expect(isTimerCritical(t)).toBe(crit);
      expect(isTimerComplete(t)).toBe(complete);
    }
  );
});

describe('Wave 31 timer — complete only for countdown', () => {
  it('count-up never completes via isTimerComplete', () => {
    const t = createTimer({ direction: 'up', initialTime: 5_000 });
    t.remaining = 0;
    t.elapsed = 999_999;
    expect(isTimerComplete(t)).toBe(false);
  });

  it('addTime into zero marks complete for countdown', () => {
    let t = createTimer({ direction: 'down', initialTime: 3_000 });
    t = addTime(t, -3_000);
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
    t = addTime(t, -50);
    expect(t.remaining).toBe(0);
    expect(isTimerComplete(t)).toBe(true);
  });
});
