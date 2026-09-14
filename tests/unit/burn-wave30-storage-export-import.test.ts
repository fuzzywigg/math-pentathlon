/**
 * Wave 30 — storage exportData / importData / resetAll round-trips.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  storage,
  CURRENT_DATA_VERSION,
  createDefaultProgress,
} from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 30 storage-export-import — export shape', () => {
  it('exportData is pretty-printed JSON with version', () => {
    storage.createProfile('Ada', 'owl');
    const json = storage.exportData();
    expect(json).toContain('\n');
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(CURRENT_DATA_VERSION);
    expect(parsed.profile.name).toBe('Ada');
  });

  it('export after mutations includes stats/achievements/owl/settings', () => {
    storage.createProfile('Bo', 'star');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 10,
      moveCount: 1,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('first');
    storage.updateOwlMood('proud');
    storage.markMessageSeen('m1');
    storage.markTutorialCompleted('hex');
    storage.updateSettings({ soundEnabled: false });

    const parsed = JSON.parse(storage.exportData());
    expect(parsed.gameStats.hex.gamesWon).toBe(1);
    expect(parsed.achievements).toHaveLength(1);
    expect(parsed.owlState.mood).toBe('proud');
    expect(parsed.owlState.messagesSeen).toEqual(['m1']);
    expect(parsed.owlState.tutorialsCompleted).toEqual(['hex']);
    expect(parsed.settings.soundEnabled).toBe(false);
  });
});

describe('Wave 30 storage-export-import — import round-trip', () => {
  it('importData restores a prior export after reset', () => {
    storage.createProfile('Export', 'x');
    storage.unlockAchievement('a1');
    const json = storage.exportData();
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.importData(json)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Export');
    expect(storage.hasAchievement('a1')).toBe(true);
  });

  it('importData returns false on invalid JSON and leaves state intact', () => {
    storage.createProfile('Keep', 'k');
    expect(storage.importData('not-json')).toBe(false);
    expect(storage.importData('{')).toBe(false);
    expect(storage.getProfile()?.name).toBe('Keep');
  });

  it('importData accepts minimal object and fills defaults', () => {
    expect(storage.importData(JSON.stringify({ version: 1 }))).toBe(true);
    expect(storage.getProfile()).toBeNull();
    expect(storage.getSettings().owlEnabled).toBe(true);
    expect(storage.getOwlState().mood).toBe('happy');
    expect(storage.getAchievements()).toEqual([]);
    expect(storage.getStreak().currentStreak).toBe(0);
  });
});

describe('Wave 30 storage-export-import — resetAll', () => {
  it('resetAll wipes profile/stats and matches createDefaultProgress shape', () => {
    storage.createProfile('Wipe', 'w');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 5,
      moveCount: 1,
      playedAt: Date.now(),
    });
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.getTotalGamesPlayed()).toBe(0);
    const exported = JSON.parse(storage.exportData());
    const defaults = createDefaultProgress();
    expect(exported.version).toBe(defaults.version);
    expect(exported.profile).toBeNull();
    expect(exported.gameStats).toEqual({});
    expect(exported.achievements).toEqual([]);
  });
});
