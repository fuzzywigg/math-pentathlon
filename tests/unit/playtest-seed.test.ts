/**
 * Hermetic coverage for scripts/lib/playtest-seed.mjs (q-mp-1306).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_PLAYTEST_SEED,
  browserInstallPlaytestSeededRandom,
  createPlaytestRng,
  installHarnessSeededRandom,
  installPageSeededRandom,
  resolvePlaytestSeed,
} from '../../scripts/lib/playtest-seed.mjs';

describe('resolvePlaytestSeed (q-mp-1306)', () => {
  it('defaults when PLAYTEST_SEED is unset or empty', () => {
    expect(resolvePlaytestSeed({})).toBe(DEFAULT_PLAYTEST_SEED >>> 0);
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '' })).toBe(
      DEFAULT_PLAYTEST_SEED >>> 0
    );
  });

  it('parses a finite integer env value as uint32', () => {
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '42' })).toBe(42);
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '0' })).toBe(0);
  });

  it('falls back to default on non-finite values', () => {
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: 'nope' })).toBe(
      DEFAULT_PLAYTEST_SEED >>> 0
    );
  });
});

describe('createPlaytestRng / installHarnessSeededRandom (q-mp-1306)', () => {
  const previous = Math.random;
  afterEach(() => {
    Math.random = previous;
  });

  it('is deterministic for the same seed', () => {
    const a = createPlaytestRng(1);
    const b = createPlaytestRng(1);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('installs Math.random for harness move picks', () => {
    installHarnessSeededRandom(1);
    const first = Math.random();
    installHarnessSeededRandom(1);
    expect(Math.random()).toBe(first);
    // mulberry32(1) first draw (same stream as createSeededRng)
    expect(first).toBeCloseTo(0.6270739405881613, 12);
  });
});

describe('installPageSeededRandom (q-mp-1306)', () => {
  it('registers browserInstallPlaytestSeededRandom via addInitScript', async () => {
    const addInitScript = vi.fn(async () => undefined);
    await installPageSeededRandom({ addInitScript }, 99);
    expect(addInitScript).toHaveBeenCalledTimes(1);
    expect(addInitScript.mock.calls[0]?.[0]).toBe(
      browserInstallPlaytestSeededRandom
    );
    expect(addInitScript.mock.calls[0]?.[1]).toBe(99);
  });

  it('browser callback installs a deterministic Math.random', () => {
    const previous = Math.random;
    try {
      browserInstallPlaytestSeededRandom(1);
      const first = Math.random();
      browserInstallPlaytestSeededRandom(1);
      expect(Math.random()).toBe(first);
    } finally {
      Math.random = previous;
    }
  });
});
