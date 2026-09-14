/**
 * Wave 36 — isTimerWarning / isTimerCritical with inverted thresholds.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  isTimerWarning,
  isTimerCritical,
} from '../../src/core/timer-scoring';

describe('Wave 36 timer-thresholds — inverted warn/crit', () => {
  it('empty warning band when criticalThreshold > warningThreshold', () => {
    const base = createTimer({
      initialTime: 10_000,
      warningThreshold: 1_000,
      criticalThreshold: 4_000,
    });
    // remaining 3000: <= warn(1000)? no. <= crit(4000)? yes → critical only
    const mid = { ...base, remaining: 3_000 };
    expect(isTimerWarning(mid)).toBe(false);
    expect(isTimerCritical(mid)).toBe(true);

    // remaining 500: <= warn and <= crit → warning requires remaining > critical → false
    const low = { ...base, remaining: 500 };
    expect(isTimerWarning(low)).toBe(false);
    expect(isTimerCritical(low)).toBe(true);
  });

  it('undefined thresholds disable flags', () => {
    const t = { ...createTimer({ initialTime: 1000 }), remaining: 0 };
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(false);
  });
});
