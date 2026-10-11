/**
 * Hermetic coverage for scripts/lib/playtest-seed.mjs (q-mp-1306 / q-mp-1410).
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

describe('resolvePlaytestSeed (q-mp-1306 / q-mp-1410)', () => {
  it('defaults when PLAYTEST_SEED is unset or empty', () => {
    expect(resolvePlaytestSeed({})).toBe(DEFAULT_PLAYTEST_SEED >>> 0);
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '' })).toBe(
      DEFAULT_PLAYTEST_SEED >>> 0
    );
  });

  it('defaults on whitespace-only PLAYTEST_SEED (q-mp-1410)', () => {
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '   ' })).toBe(
      DEFAULT_PLAYTEST_SEED >>> 0
    );
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '\t\n' })).toBe(
      DEFAULT_PLAYTEST_SEED >>> 0
    );
  });

  it('parses a decimal uint32 env value', () => {
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '42' })).toBe(42);
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '0' })).toBe(0);
    expect(resolvePlaytestSeed({ PLAYTEST_SEED: '4294967295' })).toBe(
      4294967295
    );
  });

  it('rejects scientific notation, signs, hex, floats, and non-decimal (q-mp-1410)', () => {
    const bad = ['1e3', '1E3', '-1', '+1', '0x10', '1.5', 'nope', ' 42', '42 '];
    for (const raw of bad) {
      expect(() => resolvePlaytestSeed({ PLAYTEST_SEED: raw })).toThrow(
        /need decimal uint32/
      );
    }
  });

  it('rejects out-of-uint32 decimal tokens (q-mp-1410)', () => {
    expect(() => resolvePlaytestSeed({ PLAYTEST_SEED: '4294967296' })).toThrow(
      /need decimal uint32/
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
