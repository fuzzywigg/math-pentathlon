/**
 * Wave 36 — timer parse/format dense round-trip grid leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { formatTime, parseTime } from '../../src/core/timer-scoring';

describe('Wave 36 timer-parse — dense second grid', () => {
  it('round-trips every second from 0..180 via MM:SS', () => {
    for (let sec = 0; sec <= 180; sec++) {
      const ms = sec * 1000;
      expect(parseTime(formatTime(ms))).toBe(ms);
    }
  });

  it('round-trips centiseconds in 10ms steps for first 2 seconds', () => {
    for (let ms = 0; ms <= 2_000; ms += 10) {
      const formatted = formatTime(ms, { showMilliseconds: true });
      expect(parseTime(formatted)).toBe(ms);
    }
  });

  it('HH:MM:SS path for hour boundaries', () => {
    for (const h of [0, 1, 2, 5, 12]) {
      for (const m of [0, 30, 59]) {
        for (const s of [0, 1, 59]) {
          const str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          expect(parseTime(str)).toBe((h * 3600 + m * 60 + s) * 1000);
        }
      }
    }
  });
});
