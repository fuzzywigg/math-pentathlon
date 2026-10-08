/**
 * burn-1008-mp-save-migration — golden fixtures + exported migration hook.
 *
 * Narrows past #494 (durable load/quota/corrupt) and #514 (sanitize/CSP):
 * on-disk fixtures reconstructed from serializer git history, plus pure
 * migrateProgressData / normalizeLoadedProgress coverage and remount load.
 *
 * Isolated project — uses vi.resetModules for constructor load().
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
  PROGRESS_STORAGE_KEY,
  ensureProgressDefaults,
  migrateProgressData,
  normalizeLoadedProgress,
  type ProgressData,
} from '../../src/core/storage';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';
import {
  deserializeGameState,
  type SerializedGameState,
} from '../../src/games/kings-quadraphages/serialization';
import { isBoard3dEnabled } from '../../src/core/feature-flags';

const fixturesRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  '../fixtures/storage'
);

function readFixtureText(rel: string): string {
  return readFileSync(join(fixturesRoot, rel), 'utf8');
}

function readFixtureJson<T = unknown>(rel: string): T {
  return JSON.parse(readFixtureText(rel)) as T;
}

type StorageModule = typeof import('../../src/core/storage');

async function loadFreshStorage(): Promise<StorageModule['storage']> {
  vi.resetModules();
  resetSettingsFlagsForTests();
  const mod = (await import('../../src/core/storage')) as StorageModule;
  return mod.storage;
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  resetSettingsFlagsForTests();
  vi.restoreAllMocks();
});

describe('save-migration — exported no-op migrateProgressData hook', () => {
  it('stamps version 0 → CURRENT and fills missing settings/owl/streak', () => {
    const sparse = readFixtureJson<ProgressData>(
      'progress/v0-sparse-pre-settings.json'
    );
    const migrated = migrateProgressData(sparse);
    expect(migrated.version).toBe(CURRENT_DATA_VERSION);
    expect(migrated.profile?.name).toBe('LegacySparse');
    expect(migrated.gameStats.calla?.gamesPlayed).toBe(5);
    expect(migrated.settings).toEqual(DEFAULT_SETTINGS);
    expect(migrated.owlState.mood).toBe(DEFAULT_OWL_STATE.mood);
    expect(migrated.streak.currentStreak).toBe(0);
    expect(migrated.achievements).toEqual([]);
  });

  it('v0 full-fields keeps stats/achievements and stamps CURRENT', () => {
    const legacy = readFixtureJson<ProgressData>(
      'progress/v0-full-fields.json'
    );
    const migrated = migrateProgressData(legacy);
    expect(migrated.version).toBe(CURRENT_DATA_VERSION);
    expect(migrated.profile?.name).toBe('LegacyFull');
    expect(migrated.gameStats.fiar?.gamesWon).toBe(1);
    expect(migrated.achievements).toEqual([
      { id: 'legacy-badge', unlockedAt: 150 },
    ]);
    expect(migrated.settings.owlFrequency).toBe('normal');
  });

  it('normalizeLoadedProgress routes version < CURRENT through migrate', () => {
    const sparse = readFixtureJson<ProgressData>(
      'progress/v0-sparse-pre-settings.json'
    );
    const viaNormalize = normalizeLoadedProgress(sparse);
    const viaMigrate = migrateProgressData(sparse);
    expect(viaNormalize).toEqual(viaMigrate);
    expect(viaNormalize.version).toBe(CURRENT_DATA_VERSION);
  });

  it('normalizeLoadedProgress on CURRENT only ensureDefaults (identity fields)', () => {
    const canonical = readFixtureJson<ProgressData>(
      'progress/v1-canonical-full.json'
    );
    const normalized = normalizeLoadedProgress(canonical);
    expect(normalized.version).toBe(CURRENT_DATA_VERSION);
    expect(normalized.profile?.name).toBe('FixtureKid');
    expect(normalized.settings.soundEnabled).toBe(false);
    expect(normalized.gameStats.hex?.gamesPlayed).toBe(3);
  });

  it('ensureProgressDefaults fills missing version without calling migrate path', () => {
    const noVer = readFixtureJson<ProgressData>(
      'progress/missing-version-partial-settings.json'
    );
    const ensured = ensureProgressDefaults(noVer);
    expect(ensured.version).toBe(CURRENT_DATA_VERSION);
    expect(ensured.profile?.name).toBe('NoVersion');
    expect(ensured.settings.reducedMotion).toBe(true);
    expect(ensured.settings.owlEnabled).toBe(DEFAULT_SETTINGS.owlEnabled);
    expect(ensured.achievements).toEqual([{ id: 'kept', unlockedAt: 15 }]);
  });
});

describe('save-migration — golden fixtures via constructor remount', () => {
  it('v1-canonical-full.json round-trips intact', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/v1-canonical-full.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('FixtureKid');
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(storage.getGameStats('hex').gamesWon).toBe(2);
    expect(storage.hasAchievement('first-win')).toBe(true);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });

  it('v0-sparse-pre-settings.json migrates; keeps profile/stats; defaults settings', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/v0-sparse-pre-settings.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('LegacySparse');
    expect(storage.getGameStats('calla').gamesPlayed).toBe(5);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });

  it('v0-full-fields.json migrates without dropping achievements', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/v0-full-fields.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('LegacyFull');
    expect(storage.hasAchievement('legacy-badge')).toBe(true);
    expect(storage.getGameStats('fiar').gamesWon).toBe(1);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });

  it('missing-version-partial-settings.json fills version + merges settings', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/missing-version-partial-settings.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('NoVersion');
    expect(storage.getSettings().reducedMotion).toBe(true);
    expect(storage.hasAchievement('kept')).toBe(true);
    expect(JSON.parse(storage.exportData()).version).toBe(CURRENT_DATA_VERSION);
  });

  it('wrong-typed-fields.json keeps profile; nested wrong types → safe defaults', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/wrong-typed-fields.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('TypedSafe');
    expect(() => storage.hasAchievement('x')).not.toThrow();
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getAllGameStats()).toEqual({});
    expect(storage.getStreak().currentStreak).toBe(0);
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(storage.getOwlState().messagesSeen).toEqual([]);
  });

  it('hostile-profile-control-chars.json sanitizes name/avatar; no crash', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/hostile-profile-control-chars.json')
    );
    const storage = await loadFreshStorage();
    const profile = storage.getProfile();
    expect(profile).not.toBeNull();
    expect(profile!.name).toBe('KidName');
    expect(profile!.avatar.length).toBeLessThanOrEqual(64);
    expect(profile!.name.includes('\u0000')).toBe(false);
  });

  it('non-object-root.json resets to defaults without throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/non-object-root.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(storage.getAchievements()).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it('truncated-object.txt resets to defaults without throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/truncated-object.txt')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getOwlState().mood).toBe(DEFAULT_OWL_STATE.mood);
    expect(warn).toHaveBeenCalled();
  });
});

describe('save-migration — quota / unavailable soft-fail (fixture remount)', () => {
  it('private-mode getItem SecurityError → fresh defaults, no throw', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/v1-canonical-full.json')
    );
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });
    const storage = await loadFreshStorage();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(warn).toHaveBeenCalled();
  });

  it('QuotaExceededError on saveNow after loading fixture keeps memory, no throw', async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      readFixtureText('progress/v1-canonical-full.json')
    );
    const storage = await loadFreshStorage();
    expect(storage.getProfile()?.name).toBe('FixtureKid');

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException(
        'Failed to execute a storage request',
        'QuotaExceededError'
      );
    });

    expect(() => {
      storage.unlockAchievement('post-quota');
      storage.saveNow();
    }).not.toThrow();
    expect(storage.getProfile()?.name).toBe('FixtureKid');
    expect(storage.hasAchievement('post-quota')).toBe(true);
    expect(errSpy).toHaveBeenCalled();
  });

  it('feature-flag localStorage SecurityError fails soft (OFF)', () => {
    const boom = {
      getItem() {
        throw new DOMException('insecure', 'SecurityError');
      },
    };
    expect(() => isBoard3dEnabled('', boom as Storage)).not.toThrow();
    expect(isBoard3dEnabled('', boom as Storage)).toBe(false);
  });
});

describe('save-migration — kings export serializer fixtures', () => {
  it('v1-midgame.json deserializes without corrupting board size', () => {
    const blob = readFixtureJson<SerializedGameState>('kings/v1-midgame.json');
    const state = deserializeGameState(blob);
    expect(state.board).toHaveLength(9);
    expect(state.board.every((row) => row.length === 9)).toBe(true);
    expect(state.currentPlayer).toBe('player1');
    expect(state.turnPhase).toBe('moveKing');
    expect(state.winner).toBeNull();
  });

  it('v0-unsupported.json rejects gracefully (throw; caller resets)', () => {
    const blob = readFixtureJson<SerializedGameState>(
      'kings/v0-unsupported.json'
    );
    expect(() => deserializeGameState(blob)).toThrow(
      /Unsupported save version/
    );
  });
});
