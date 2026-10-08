/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in storage/migrate.ts.
 */
import { describe, expect, it } from 'vitest';
import {
  ensureProgressDefaults,
  isPlainProgressObject,
  migrateProgressData,
  normalizeLoadedProgress,
} from '../../src/core/storage/migrate';
import { CURRENT_DATA_VERSION, type ProgressData } from '../../src/core/storage/types';

function minimalProgress(overrides: Partial<ProgressData> = {}): ProgressData {
  return {
    version: CURRENT_DATA_VERSION,
    profile: null,
    streak: {
      currentStreak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      streakStartDate: '',
    },
    achievements: [],
    gameStats: {},
    owlState: {
      mood: 'happy',
      lastInteraction: 0,
      messagesSeen: [],
      tutorialsCompleted: [],
      totalMessagesShown: 0,
    },
    settings: {
      owlEnabled: true,
      soundEnabled: true,
      reducedMotion: false,
      owlFrequency: 'normal',
    },
    ...overrides,
  };
}

describe('mutation-ui storage migrate', () => {
  it('isPlainProgressObject requires object && not-null && not-array', () => {
    // Survivor: flip one && → ||
    expect(isPlainProgressObject(null)).toBe(false);
    expect(isPlainProgressObject([])).toBe(false);
    expect(isPlainProgressObject('x')).toBe(false);
    expect(isPlainProgressObject({ a: 1 })).toBe(true);
  });

  it('ensureProgressDefaults throws for non-plain roots', () => {
    expect(() =>
      ensureProgressDefaults(null as unknown as ProgressData)
    ).toThrow(TypeError);
    expect(() =>
      ensureProgressDefaults([] as unknown as ProgressData)
    ).toThrow(TypeError);
  });

  it('version 0 is stamped to CURRENT via falsy number coerce', () => {
    // Survivors around `typeof === 'number' && Number.isFinite` and `version || CURRENT`.
    const out = ensureProgressDefaults(minimalProgress({ version: 0 }));
    expect(out.version).toBe(CURRENT_DATA_VERSION);
  });

  it('non-finite version falls back to CURRENT', () => {
    const out = ensureProgressDefaults(
      minimalProgress({ version: Number.NaN })
    );
    expect(out.version).toBe(CURRENT_DATA_VERSION);
  });

  it('Infinity version is not treated as a finite number', () => {
    // Survivor: typeof === 'number' && Number.isFinite → || would keep Infinity.
    const out = ensureProgressDefaults(
      minimalProgress({ version: Number.POSITIVE_INFINITY })
    );
    expect(out.version).toBe(CURRENT_DATA_VERSION);
    expect(Number.isFinite(out.version)).toBe(true);
  });

  it('normalizeLoadedProgress migrates only when version < CURRENT', () => {
    // Survivor: < → <= would also migrate equal CURRENT (still ok) — pin strict <.
    const below = normalizeLoadedProgress(minimalProgress({ version: 0 }));
    expect(below.version).toBe(CURRENT_DATA_VERSION);

    const at = normalizeLoadedProgress(
      minimalProgress({ version: CURRENT_DATA_VERSION })
    );
    expect(at.version).toBe(CURRENT_DATA_VERSION);

    // Version above CURRENT still ensureDefaults (does not use migrate branch).
    const above = normalizeLoadedProgress(
      minimalProgress({ version: CURRENT_DATA_VERSION + 1 })
    );
    expect(above.version).toBe(CURRENT_DATA_VERSION + 1);
  });

  it('migrateProgressData always stamps CURRENT then ensures defaults', () => {
    const out = migrateProgressData(minimalProgress({ version: 0 }));
    expect(out.version).toBe(CURRENT_DATA_VERSION);
  });

  it('non-number version uses CURRENT in ensureProgressDefaults', () => {
    const out = ensureProgressDefaults(
      minimalProgress({ version: '1' as unknown as number })
    );
    expect(out.version).toBe(CURRENT_DATA_VERSION);
  });
});
