/**
 * Wave 36 — timer formatTime stress leftovers (large minutes, separators, cs).
 * Beyond wave 31 sample set. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { formatTime, parseTime } from '../../src/core/timer-scoring';

describe('Wave 36 timer-format — large duration matrix', () => {
  const rows: Array<{ ms: number; def: string; withCs: string }> = [
    { ms: 0, def: '00:00', withCs: '00:00.00' },
    { ms: 9, def: '00:00', withCs: '00:00.00' },
    { ms: 10, def: '00:00', withCs: '00:00.01' },
    { ms: 999, def: '00:00', withCs: '00:00.99' },
    { ms: 60_000, def: '01:00', withCs: '01:00.00' },
    { ms: 3_599_000, def: '59:59', withCs: '59:59.00' },
    { ms: 3_600_000, def: '60:00', withCs: '60:00.00' }, // minutes grow past 59
    { ms: 3_661_000, def: '61:01', withCs: '61:01.00' },
    { ms: 36_000_000, def: '600:00', withCs: '600:00.00' },
    { ms: 99 * 60_000 + 59_000 + 990, def: '99:59', withCs: '99:59.99' },
  ];

  it.each(rows)('formatTime($ms)', ({ ms, def, withCs }) => {
    expect(formatTime(ms)).toBe(def);
    expect(formatTime(ms, { showMilliseconds: true })).toBe(withCs);
  });
});

describe('Wave 36 timer-format — separator × pad cartesian', () => {
  const separators = [':', '-', ' ', '|'];
  const pads = [
    { padMinutes: true, padSeconds: true },
    { padMinutes: false, padSeconds: true },
    { padMinutes: true, padSeconds: false },
    { padMinutes: false, padSeconds: false },
  ];

  it('cartesian options never throw and embed separator', () => {
    for (const separator of separators) {
      for (const pad of pads) {
        const formatted = formatTime(125_000, { separator, ...pad });
        expect(formatted.includes(separator)).toBe(true);
        const parts = formatted.split(separator);
        expect(parts).toHaveLength(2);
        expect(parts[0]!.length).toBeGreaterThan(0);
        expect(parts[1]!.length).toBeGreaterThan(0);
      }
    }
  });

  it('unpadded 125s is 2:5 with custom sep', () => {
    expect(
      formatTime(125_000, {
        padMinutes: false,
        padSeconds: false,
        separator: '/',
      })
    ).toBe('2/5');
  });
});

describe('Wave 36 timer-format — parseTime HH:MM:SS stress', () => {
  it.each([
    ['00:00:00', 0],
    ['00:00:01', 1000],
    ['00:59:59', (59 * 60 + 59) * 1000],
    ['01:00:00', 3_600_000],
    ['10:11:12', (10 * 3600 + 11 * 60 + 12) * 1000],
    ['99:00:00', 99 * 3600 * 1000],
  ])('parseTime(%s) → %i', (str, ms) => {
    expect(parseTime(str)).toBe(ms);
  });

  it('centisecond padEnd single digit and truncate long', () => {
    expect(parseTime('01:02.3')).toBe(62_000 + 300);
    expect(parseTime('01:02.30')).toBe(62_000 + 300);
    expect(parseTime('01:02.3099')).toBe(62_000 + 300);
    expect(parseTime('01:02.039')).toBe(62_000 + 30);
  });
});
