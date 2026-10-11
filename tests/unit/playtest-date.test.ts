/**
 * Hermetic coverage for scripts/lib/playtest-date.mjs (q-mp-1320).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { utcPlaytestDateStamp } from '../../scripts/lib/playtest-date.mjs';

const HARNESS_PATHS = [
  'scripts/calla-deep-playtest.mjs',
  'scripts/ramrod-deep-playtest.mjs',
  'scripts/stars-bars-deep-playtest.mjs',
  'scripts/sum-dominoes-deep-playtest.mjs',
  'scripts/par-55-deep-playtest.mjs',
  'docs/playtest/hex-deep-probe.mjs',
  'docs/playtest/fraction-pinball-deep-playtest.mjs',
  'tests/playtest/fab-a-diffy-deep.mjs',
  'tests/playtest/star-track-deep-playtest.mjs',
] as const;

describe('utcPlaytestDateStamp (q-mp-1320)', () => {
  it('returns YYYY-MM-DD from the UTC ISO date portion', () => {
    expect(utcPlaytestDateStamp(new Date('2026-11-03T23:59:59.999Z'))).toBe(
      '2026-11-03'
    );
    expect(utcPlaytestDateStamp(new Date('2026-11-04T00:00:00.000Z'))).toBe(
      '2026-11-04'
    );
  });

  it('defaults to live UTC today', () => {
    const stamp = utcPlaytestDateStamp();
    expect(stamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(stamp).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe('playtest harnesses stamp live OUT/date (q-mp-1320)', () => {
  it('wires utcPlaytestDateStamp and drops hardcoded 2026-10-07 OUT/date stems', () => {
    for (const rel of HARNESS_PATHS) {
      const src = readFileSync(resolve(process.cwd(), rel), 'utf8');
      expect(src, rel).toMatch(/utcPlaytestDateStamp/);
      expect(src, rel).not.toMatch(/2026-10-07/);
    }
  });
});
