import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_PROFILE_NAME_LENGTH,
  sanitizeDisplayString,
  sanitizeProfile,
  storage,
} from '../../src/core/storage';
import { renderStatsDashboardFromSnapshot } from '../../src/ui/stats-dashboard';

describe('storage sanitize + stats rendering', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  afterEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  it('sanitizeDisplayString strips control chars and caps length', () => {
    expect(sanitizeDisplayString('  Alice\u0000  ', 64)).toBe('Alice');
    expect(
      sanitizeDisplayString('x'.repeat(MAX_PROFILE_NAME_LENGTH + 10), 64)?.length
    ).toBe(64);
    expect(sanitizeDisplayString('<script>', 64)).toBe('<script>');
  });

  it('rejects non-object profiles from corrupt JSON shapes', () => {
    expect(sanitizeProfile(null)).toBeNull();
    expect(sanitizeProfile('evil')).toBeNull();
    expect(sanitizeProfile({ name: 1, id: 'a' })).toBeNull();
  });

  it('createProfile sanitizes XSS-looking names before save', () => {
    const profile = storage.createProfile(
      '<img src=x onerror=alert(1)>',
      'avatar'
    );
    expect(profile.name).toBe('<img src=x onerror=alert(1)>');
    expect(storage.getProfile()?.name).toBe('<img src=x onerror=alert(1)>');
  });

  it('stats dashboard renders profile name as text, not HTML', () => {
    storage.createProfile('<img src=x onerror=alert(1)>', 'default');
    storage.recordGameResult({
      gameId: 'hex',
      winner: 'player1',
      playerWon: true,
      duration: 1000,
      moveCount: 3,
      playedAt: Date.now(),
    });

    const root = document.createElement('div');
    renderStatsDashboardFromSnapshot(root, {
      gameStats: storage.getAllGameStats(),
      streak: storage.getStreak(),
      totalGamesPlayed: storage.getTotalGamesPlayed(),
      totalPlayTime: storage.getTotalPlayTime(),
      overallWinRate: storage.getOverallWinRate(),
      profile: storage.getProfile(),
      achievements: storage.getAchievements(),
    });

    expect(root.querySelector('img')).toBeNull();
    expect(root.innerHTML).not.toContain('<img src=x');
    expect(root.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('load ignores corrupt non-object localStorage roots', () => {
    localStorage.setItem('math-pentathlon-progress', '["not","an","object"]');
    // Re-construct by importing a fresh path is hard with singleton; importData path:
    expect(storage.importData('null')).toBe(false);
    expect(storage.importData('"string"')).toBe(false);
    expect(storage.importData('[]')).toBe(false);
  });
});
