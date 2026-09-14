/**
 * Wave 39 — undefined warning/critical thresholds leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  isTimerWarning,
  isTimerCritical,
} from '../../src/core/timer-scoring';

describe('Wave 39 timer — threshold undefined', () => {
  it('no thresholds → warning/critical false even at remaining 0', () => {
    const t = {
      ...createTimer({ initialTime: 10000 }),
      remaining: 0,
    };
    expect(t.config.warningThreshold).toBeUndefined();
    expect(t.config.criticalThreshold).toBeUndefined();
    expect(isTimerWarning(t)).toBe(false);
    expect(isTimerCritical(t)).toBe(false);
  });
});
