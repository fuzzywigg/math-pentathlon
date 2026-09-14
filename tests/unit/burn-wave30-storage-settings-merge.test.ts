/**
 * Wave 30 — storage settings merge + type defaults helpers.
 * Distinct from wave 23 single merge smoke. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
  DEFAULT_STREAK,
  CURRENT_DATA_VERSION,
  createDefaultProgress,
  createDefaultGameStats,
  type UserSettings,
} from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-settings — defaults constants', () => {
  it('DEFAULT_SETTINGS matches expected baseline', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      owlEnabled: true,
      soundEnabled: true,
      reducedMotion: false,
      owlFrequency: 'normal',
    });
  });

  it('getSettings on fresh store equals DEFAULT_SETTINGS copy', () => {
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    const s = storage.getSettings();
    s.soundEnabled = false;
    expect(storage.getSettings().soundEnabled).toBe(true);
  });

  it('createDefaultProgress wires version + empty domains', () => {
    const p = createDefaultProgress();
    expect(p.version).toBe(CURRENT_DATA_VERSION);
    expect(p.profile).toBeNull();
    expect(p.achievements).toEqual([]);
    expect(p.gameStats).toEqual({});
    expect(p.streak).toEqual(DEFAULT_STREAK);
    expect(p.owlState).toEqual(DEFAULT_OWL_STATE);
    expect(p.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('createDefaultGameStats stamps gameId and zero counters', () => {
    vi.setSystemTime(new Date('2026-09-14T04:00:00Z'));
    const s = createDefaultGameStats('hex');
    expect(s.gameId).toBe('hex');
    expect(s.gamesPlayed).toBe(0);
    expect(s.gamesWon).toBe(0);
    expect(s.gamesLost).toBe(0);
    expect(s.gamesDraw).toBe(0);
    expect(s.totalPlayTime).toBe(0);
    expect(s.bestWinStreak).toBe(0);
    expect(s.currentWinStreak).toBe(0);
    expect(s.lastPlayed).toBe(Date.now());
    expect(s.firstPlayed).toBe(Date.now());
  });
});

describe('Wave 30 storage-settings — partial merge matrix', () => {
  const patches: Array<Partial<UserSettings>> = [
    { soundEnabled: false },
    { owlEnabled: false },
    { reducedMotion: true },
    { owlFrequency: 'quiet' },
    { owlFrequency: 'chatty' },
    { owlFrequency: 'normal' },
    { soundEnabled: false, owlEnabled: false },
    { reducedMotion: true, owlFrequency: 'quiet' },
    {
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'chatty',
    },
  ];

  it.each(patches.map((p, i) => ({ i, p })))(
    'patch #$i merges without clobbering unspecified keys',
    ({ p }) => {
      storage.resetAll();
      const before = storage.getSettings();
      storage.updateSettings(p);
      const after = storage.getSettings();
      for (const key of Object.keys(
        DEFAULT_SETTINGS
      ) as (keyof UserSettings)[]) {
        if (key in p) {
          expect(after[key]).toBe(p[key]);
        } else {
          expect(after[key]).toBe(before[key]);
        }
      }
    }
  );

  it('sequential patches accumulate', () => {
    storage.updateSettings({ soundEnabled: false });
    storage.updateSettings({ owlFrequency: 'quiet' });
    storage.updateSettings({ reducedMotion: true });
    expect(storage.getSettings()).toEqual({
      owlEnabled: true,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'quiet',
    });
  });

  it('empty patch is a no-op', () => {
    storage.updateSettings({});
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe('Wave 30 storage-settings — persistence', () => {
  it('settings survive saveNow and export/import', () => {
    storage.updateSettings({
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'chatty',
    });
    storage.saveNow();
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.getSettings()).toEqual(DEFAULT_SETTINGS);
    expect(storage.importData(json)).toBe(true);
    expect(storage.getSettings()).toEqual({
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: true,
      owlFrequency: 'chatty',
    });
  });

  it('import with partial settings fills missing keys from defaults', () => {
    const ok = storage.importData(
      JSON.stringify({
        version: CURRENT_DATA_VERSION,
        settings: { soundEnabled: false },
      })
    );
    expect(ok).toBe(true);
    expect(storage.getSettings().soundEnabled).toBe(false);
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(storage.getSettings().owlFrequency).toBe('normal');
  });
});
