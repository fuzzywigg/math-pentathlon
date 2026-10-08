/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in storage/sanitize.ts.
 * Uses hard-coded 64 expectations so const ±1 mutants are detected.
 */
import { describe, expect, it } from 'vitest';
import {
  sanitizeAchievements,
  sanitizeDisplayString,
  sanitizeDisplayStringAllowEmpty,
  sanitizeGameStatsMap,
  sanitizeOwlState,
  sanitizeProfile,
  sanitizeSettings,
  sanitizeStreak,
} from '../../src/core/storage/sanitize';

describe('mutation-ui storage sanitize', () => {
  it('exported max lengths are exactly 64 (hard-coded)', () => {
    // Mutating module consts 64→65/63 must fail these.
    expect(sanitizeDisplayString('x'.repeat(100), 64)?.length).toBe(64);
    expect(sanitizeDisplayStringAllowEmpty('y'.repeat(100), 64)?.length).toBe(
      64
    );
  });

  it('sanitizeProfile caps name/id/avatar at 64 chars', () => {
    const profile = sanitizeProfile({
      id: 'i'.repeat(100),
      name: 'n'.repeat(100),
      avatar: 'a'.repeat(100),
      createdAt: 1,
      lastActiveAt: 2,
    });
    expect(profile).not.toBeNull();
    expect(profile!.id.length).toBe(64);
    expect(profile!.name.length).toBe(64);
    expect(profile!.avatar.length).toBe(64);
  });

  it('sanitizeProfile rejects empty id after sanitize', () => {
    expect(
      sanitizeProfile({ id: '', name: 'ok', avatar: 'default' })
    ).toBeNull();
    expect(
      sanitizeProfile({ id: '\u0000', name: 'ok', avatar: 'default' })
    ).toBeNull();
  });

  it('asNonNegativeInt keeps explicit 0 when fallback differs (createdAt)', () => {
    // Survivor: n >= 0 → n > 0 would replace 0 with Date.now()-ish fallback.
    const profile = sanitizeProfile({
      id: 'p1',
      name: 'Kid',
      avatar: 'default',
      createdAt: 0,
      lastActiveAt: 0,
    });
    expect(profile!.createdAt).toBe(0);
    expect(profile!.lastActiveAt).toBe(0);
  });

  it('asNonNegativeInt falls back for negative numbers', () => {
    const streak = sanitizeStreak({
      currentStreak: -3,
      bestStreak: -1,
      lastPlayDate: 'x'.repeat(100),
      streakStartDate: 12,
    });
    expect(streak.currentStreak).toBe(0);
    expect(streak.bestStreak).toBe(0);
    expect(streak.lastPlayDate.length).toBeLessThanOrEqual(32);
    expect(streak.streakStartDate).toBe('');
  });

  it('asFiniteNumber rejects Infinity (requires number && isFinite)', () => {
    // Survivor: && → || in asFiniteNumber would accept Infinity as a streak.
    const streak = sanitizeStreak({
      currentStreak: Number.POSITIVE_INFINITY,
      bestStreak: Number.NaN,
    });
    expect(streak.currentStreak).toBe(0);
    expect(streak.bestStreak).toBe(0);
  });

  it('sanitizeAchievements caps ids at 64 and keeps unlockedAt 0', () => {
    const list = sanitizeAchievements([
      { id: 'a'.repeat(100), unlockedAt: 0 },
      { id: 12, unlockedAt: 1 },
      null,
    ]);
    expect(list).toHaveLength(1);
    expect(list[0]!.id.length).toBe(64);
    expect(list[0]!.unlockedAt).toBe(0);
  });

  it('sanitizeGameStatsMap caps game ids at 64 and keeps zero counters', () => {
    const map = sanitizeGameStatsMap({
      ['g'.repeat(100)]: {
        gameId: 'g'.repeat(100),
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDraw: 0,
        totalPlayTime: 0,
        bestWinStreak: 0,
        currentWinStreak: 0,
        lastPlayed: 0,
        firstPlayed: 0,
      },
    });
    const keys = Object.keys(map);
    expect(keys).toHaveLength(1);
    expect(keys[0]!.length).toBe(64);
    expect(map[keys[0]!]!.gamesPlayed).toBe(0);
  });

  it('sanitizeOwlState keeps totalMessagesShown 0 and caps message ids', () => {
    const owl = sanitizeOwlState({
      mood: 'happy',
      lastInteraction: 0,
      messagesSeen: ['m'.repeat(100), 9],
      tutorialsCompleted: ['t'.repeat(100)],
      totalMessagesShown: 0,
    });
    expect(owl.totalMessagesShown).toBe(0);
    expect(owl.lastInteraction).toBe(0);
    expect(owl.messagesSeen[0]!.length).toBe(64);
    expect(owl.tutorialsCompleted[0]!.length).toBe(64);
  });

  it('sanitizeSettings requires boolean types (not truthy strings)', () => {
    const settings = sanitizeSettings({
      owlEnabled: 'true',
      soundEnabled: 1,
      reducedMotion: 'yes',
      owlFrequency: 'loud',
    });
    expect(typeof settings.owlEnabled).toBe('boolean');
    expect(typeof settings.soundEnabled).toBe('boolean');
    expect(typeof settings.reducedMotion).toBe('boolean');
    expect(['chatty', 'normal', 'quiet']).toContain(settings.owlFrequency);
  });

  it('isPlainObject rejects arrays for settings/streak', () => {
    expect(sanitizeSettings([])).toEqual(sanitizeSettings(undefined));
    expect(sanitizeStreak([])).toEqual(sanitizeStreak(undefined));
  });
});
