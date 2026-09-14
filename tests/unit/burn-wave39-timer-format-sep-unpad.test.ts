/**
 * Wave 39 — formatTime separator/unpad + addTime clamp + count-up complete.
 * Beyond wave 36 format dense. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  formatTime,
  addTime,
  createTimer,
  isTimerComplete,
} from '../../src/core/timer-scoring';

describe('Wave 39 timer — format sep / clamp / count-up', () => {
  it('custom separator and unpadded minutes', () => {
    expect(formatTime(65_000, { padMinutes: false, separator: '-' })).toBe(
      '1-05'
    );
    expect(
      formatTime(5_000, { padMinutes: false, padSeconds: false, separator: '.' })
    ).toBe('0.5');
  });

  it('addTime clamps large negative to 0', () => {
    const t = createTimer({ initialTime: 1000, direction: 'down' });
    expect(addTime(t, -5000).remaining).toBe(0);
    expect(addTime(t, 250).remaining).toBe(1250);
  });

  it('isTimerComplete false for count-up even at 0 remaining', () => {
    const up = createTimer({ direction: 'up', initialTime: 0 });
    expect(isTimerComplete(up)).toBe(false);
    const down = createTimer({ direction: 'down', initialTime: 0 });
    expect(isTimerComplete(down)).toBe(true);
  });
});
