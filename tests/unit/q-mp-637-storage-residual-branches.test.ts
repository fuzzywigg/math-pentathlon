/**
 * q-mp-637 — Close `storage` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ cut HEAD):
 *   `src/core/storage/storage.ts` under `tests/unit/*storage*` suites:
 *     **100%** lines (166/166) / **94.28%** branches (66/70)
 *   Uncovered under that glob: L188–190 `?? ''` in `createProfile`;
 *     L291 / L297 `split('T')[0] ?? ''` in date helpers.
 *   Engine r18 already pins createProfile non-string coercion outside the
 *     `*storage*` glob — leave that draft lineage **contained**; this suite
 *     owns the verification-glob residual.
 *   Soft-fail `#909`/`420` + sanitize `#964`/`504` — leave open (**contained**).
 *
 * Constraints (binding screen): tests only; NO `src/core/storage/**` edits;
 * in-memory storage mocks only; no AI / rules / scoring / copy / aria pins;
 * no ratchet JSON; Hex Hard 450ms untouched; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storage } from '../../src/core/storage';

const STORAGE_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/storage/storage.ts'
  ),
  'utf8'
);

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('q-mp-637 — storage residual branch keep-sites', () => {
  it('source keeps createProfile sanitize nullish fallbacks (L188–191)', () => {
    expect(STORAGE_SRC).toMatch(
      /sanitizeDisplayStringAllowEmpty\(\s*name[\s\S]*?\?\?\s*''/
    );
    expect(STORAGE_SRC).toMatch(
      /sanitizeDisplayStringAllowEmpty\(\s*avatar[\s\S]*?\?\?\s*''/
    );
  });

  it('source keeps date-helper split nullish fallbacks (L291 / L297)', () => {
    expect(STORAGE_SRC).toMatch(
      /toISOString\(\)\.split\('T'\)\[0\]\s*\?\?\s*''/
    );
  });
});

describe('q-mp-637 — storage residual branch arms', () => {
  it('createProfile coerces non-string name/avatar via ?? to empty strings', () => {
    // Public signature is string, but sanitizeDisplayStringAllowEmpty returns
    // null for non-strings → L188–191 `?? ''` before setProfile.
    const profile = storage.createProfile(
      42 as unknown as string,
      true as unknown as string
    );
    expect(profile.name).toBe('');
    expect(profile.avatar).toBe('');
    expect(profile.id).toBeTruthy();
    expect(storage.getProfile()?.id).toBe(profile.id);
  });

  it('createProfile non-string name only still stores string avatar', () => {
    const profile = storage.createProfile({ x: 1 } as unknown as string, 'owl');
    expect(profile.name).toBe('');
    expect(profile.avatar).toBe('owl');
  });

  it('createProfile non-string avatar only still stores string name', () => {
    const profile = storage.createProfile('Ada', null as unknown as string);
    expect(profile.name).toBe('Ada');
    expect(profile.avatar).toBe('');
  });

  it('getTodayString ?? arm when split returns empty array', () => {
    // L291: `new Date().toISOString().split('T')[0] ?? ''`. Real ISO strings
    // always yield a defined [0]; force one empty split so the ?? '' arm runs
    // through public updateStreak (first-play path uses getTodayString).
    const realSplit = String.prototype.split;
    vi.spyOn(String.prototype, 'split').mockImplementation(function (
      this: string,
      separator: string | RegExp,
      limit?: number
    ) {
      if (separator === 'T') {
        return [] as string[];
      }
      return realSplit.call(this, separator, limit);
    });

    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    const streak = storage.updateStreak();
    // Default lastPlayDate is already ''; today also '' → "already played
    // today" early-return. L291's ?? '' still ran to produce today.
    expect(streak.lastPlayDate).toBe('');
    expect(streak.currentStreak).toBe(0);
    expect(streak.streakStartDate).toBe('');
  });

  it('getYesterdayString ?? arm when comparing across a seeded day', () => {
    // L297: yesterday helper’s `split('T')[0] ?? ''`. Seed a real yesterday
    // date, then force empty splits on the next-day update so both today and
    // yesterday helpers take the nullish arm.
    vi.setSystemTime(new Date('2026-10-09T12:00:00Z'));
    storage.updateStreak();
    expect(storage.getStreak().lastPlayDate).toBe('2026-10-09');
    expect(storage.getStreak().currentStreak).toBe(1);

    const realSplit = String.prototype.split;
    let tSplits = 0;
    vi.spyOn(String.prototype, 'split').mockImplementation(function (
      this: string,
      separator: string | RegExp,
      limit?: number
    ) {
      if (separator === 'T') {
        tSplits += 1;
        return [] as string[];
      }
      return realSplit.call(this, separator, limit);
    });

    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    const streak = storage.updateStreak();
    expect(tSplits).toBeGreaterThanOrEqual(2);
    // lastPlayDate was '2026-10-09'; today/yesterday both '' → broken streak
    // (not continue). Still exercises L297's ?? '' arm via getYesterdayString.
    expect(streak.lastPlayDate).toBe('');
    expect(streak.currentStreak).toBe(1);
    expect(streak.streakStartDate).toBe('');
  });
});
