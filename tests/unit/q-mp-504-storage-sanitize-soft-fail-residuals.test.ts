/**
 * q-mp-504 — Characterize `src/core/storage/sanitize.ts` soft-fail residuals
 * (tests-only).
 *
 * Structural asserts only (types, lengths, null/default shapes, numeric
 * floors). No player-facing copy-body pins. No `src/` product edits. No AI /
 * rules / scoring / timing paths. Hex Hard 450ms untouched.
 *
 * Live tip re-measure (`cursor/mp-tip-post914` @ `e43a25d2`):
 * - `sanitize.ts` **254** LOC (matches backlog)
 * - Dedicated `*sanitize*` suites before this file: **2**
 *   (`storage-sanitize-security`, `mutation-ui-storage-sanitize`)
 * - Prior suites cover XSS-ish name save paths, hard-coded 64 caps, zero-vs-
 *   fallback numeric pins, and basic junk-shape rejects. This file targets
 *   residual soft-fail edges: DisplayString trim-empty vs AllowEmpty keep-
 *   whitespace, profile empty-name / control-only avatar → `''`, default
 *   clone isolation, settings false-preservation + frequency whitelist,
 *   owl mood matrix / non-array lists, achievements whitespace-id skip,
 *   game-stats map key vs value.gameId + Infinity/negative counters.
 *
 * Ownership: keep disjoint from open `#909`/`q-mp-420` (`storage.ts`) and
 * `#925`/`q-mp-455` (`safe-web-storage` + `feature-flags`) — leave those
 * drafts open (`contained`). No ratchet JSON.
 */
import { describe, expect, it, vi } from 'vitest';

import {
  MAX_PROFILE_AVATAR_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  sanitizeAchievements,
  sanitizeDisplayString,
  sanitizeDisplayStringAllowEmpty,
  sanitizeGameStatsMap,
  sanitizeOwlState,
  sanitizeProfile,
  sanitizeSettings,
  sanitizeStreak,
} from '../../src/core/storage/sanitize';
import {
  DEFAULT_OWL_STATE,
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
  type OwlMood,
  type UserSettings,
} from '../../src/core/storage/types';

describe('q-mp-504 sanitize — display-string soft-fail residuals', () => {
  it('rejects non-strings and whitespace/control-only after trim', () => {
    expect(sanitizeDisplayString(null, 8)).toBeNull();
    expect(sanitizeDisplayString(12, 8)).toBeNull();
    expect(sanitizeDisplayString({}, 8)).toBeNull();
    expect(sanitizeDisplayString(['a'], 8)).toBeNull();
    expect(sanitizeDisplayString('   ', 8)).toBeNull();
    expect(sanitizeDisplayString('\u0000\u007F', 8)).toBeNull();
    expect(sanitizeDisplayString('\t\n', 8)).toBeNull();
  });

  it('AllowEmpty preserves empty / surrounding whitespace (no trim)', () => {
    expect(sanitizeDisplayStringAllowEmpty('', 8)).toBe('');
    expect(sanitizeDisplayStringAllowEmpty('  hi  ', 8)).toBe('  hi  ');
    expect(sanitizeDisplayStringAllowEmpty('\u0000', 8)).toBe('');
    expect(sanitizeDisplayStringAllowEmpty(false, 8)).toBeNull();
    // Contrast: DisplayString trims then rejects empty.
    expect(sanitizeDisplayString('  hi  ', 8)).toBe('hi');
    expect(sanitizeDisplayString('', 8)).toBeNull();
  });
});

describe('q-mp-504 sanitize — profile soft-fail residuals', () => {
  it('rejects arrays / missing string fields; allows empty name', () => {
    expect(sanitizeProfile([])).toBeNull();
    expect(sanitizeProfile({ id: 'ok' })).toBeNull();
    expect(sanitizeProfile({ name: 'ok' })).toBeNull();
    expect(sanitizeProfile({ id: 'ok', name: null })).toBeNull();

    const emptyName = sanitizeProfile({
      id: 'kid-1',
      name: '',
      avatar: 'default',
      createdAt: 10,
      lastActiveAt: 20,
    });
    expect(emptyName).not.toBeNull();
    expect(emptyName!.name).toBe('');
    expect(emptyName!.id).toBe('kid-1');
  });

  it('control-only avatar becomes empty string; missing timestamps use now', () => {
    const before = Date.now();
    const profile = sanitizeProfile({
      id: 'p-avatar',
      name: 'N',
      avatar: '\u0000\u0001',
    });
    const after = Date.now();
    expect(profile).not.toBeNull();
    expect(profile!.avatar).toBe('');
    expect(profile!.createdAt).toBeGreaterThanOrEqual(before);
    expect(profile!.createdAt).toBeLessThanOrEqual(after);
    expect(profile!.lastActiveAt).toBeGreaterThanOrEqual(before);
    expect(profile!.lastActiveAt).toBeLessThanOrEqual(after);
  });

  it('floors fractional timestamps and honors exported max lengths', () => {
    expect(MAX_PROFILE_NAME_LENGTH).toBe(64);
    expect(MAX_PROFILE_AVATAR_LENGTH).toBe(64);
    const profile = sanitizeProfile({
      id: 'floor',
      name: 'N',
      avatar: 'a',
      createdAt: 3.9,
      lastActiveAt: 7.1,
    });
    expect(profile!.createdAt).toBe(3);
    expect(profile!.lastActiveAt).toBe(7);
  });
});

describe('q-mp-504 sanitize — streak / settings default soft-fails', () => {
  it('non-object streak returns a fresh DEFAULT_STREAK clone', () => {
    const a = sanitizeStreak(null);
    const b = sanitizeStreak('nope');
    expect(a).toEqual(DEFAULT_STREAK);
    expect(b).toEqual(DEFAULT_STREAK);
    expect(a).not.toBe(DEFAULT_STREAK);
    expect(a).not.toBe(b);
    a.currentStreak = 9;
    expect(DEFAULT_STREAK.currentStreak).toBe(0);
    expect(sanitizeStreak(undefined).currentStreak).toBe(0);
  });

  it('caps play dates at 32 and clears non-string dates', () => {
    const streak = sanitizeStreak({
      currentStreak: 2.8,
      bestStreak: 4.2,
      lastPlayDate: 'Y'.repeat(40),
      streakStartDate: 20260101,
    });
    expect(streak.currentStreak).toBe(2);
    expect(streak.bestStreak).toBe(4);
    expect(streak.lastPlayDate.length).toBe(32);
    expect(streak.streakStartDate).toBe('');
  });

  it('settings preserve explicit false and whitelist owlFrequency', () => {
    const falsy = sanitizeSettings({
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: false,
      owlFrequency: 'quiet',
    });
    expect(falsy).toEqual({
      owlEnabled: false,
      soundEnabled: false,
      reducedMotion: false,
      owlFrequency: 'quiet',
    });

    const freqs: UserSettings['owlFrequency'][] = ['chatty', 'normal', 'quiet'];
    for (const owlFrequency of freqs) {
      expect(sanitizeSettings({ owlFrequency }).owlFrequency).toBe(
        owlFrequency
      );
    }
    expect(sanitizeSettings({ owlFrequency: 'LOUD' }).owlFrequency).toBe(
      DEFAULT_SETTINGS.owlFrequency
    );

    const junk = sanitizeSettings(null);
    expect(junk).toEqual(DEFAULT_SETTINGS);
    expect(junk).not.toBe(DEFAULT_SETTINGS);
  });
});

describe('q-mp-504 sanitize — owl / achievements soft-fail residuals', () => {
  it('non-object owl returns defaults with fresh empty arrays', () => {
    const owl = sanitizeOwlState(42);
    expect(owl.mood).toBe(DEFAULT_OWL_STATE.mood);
    expect(owl.lastInteraction).toBe(DEFAULT_OWL_STATE.lastInteraction);
    expect(owl.totalMessagesShown).toBe(DEFAULT_OWL_STATE.totalMessagesShown);
    expect(owl.messagesSeen).toEqual([]);
    expect(owl.tutorialsCompleted).toEqual([]);
    expect(owl.messagesSeen).not.toBe(DEFAULT_OWL_STATE.messagesSeen);
    owl.messagesSeen.push('mut');
    expect(DEFAULT_OWL_STATE.messagesSeen).toEqual([]);
  });

  it('accepts every OwlMood and falls back on junk / non-array lists', () => {
    const moods: OwlMood[] = [
      'happy',
      'encouraging',
      'celebrating',
      'thinking',
      'sleepy',
      'proud',
    ];
    for (const mood of moods) {
      expect(sanitizeOwlState({ mood }).mood).toBe(mood);
    }
    expect(sanitizeOwlState({ mood: 'excited' }).mood).toBe(
      DEFAULT_OWL_STATE.mood
    );
    const lists = sanitizeOwlState({
      mood: 'thinking',
      messagesSeen: 'not-array',
      tutorialsCompleted: { id: 't1' },
      lastInteraction: -5,
      totalMessagesShown: Number.POSITIVE_INFINITY,
    });
    expect(lists.mood).toBe('thinking');
    expect(lists.messagesSeen).toEqual([]);
    expect(lists.tutorialsCompleted).toEqual([]);
    expect(lists.lastInteraction).toBe(DEFAULT_OWL_STATE.lastInteraction);
    expect(lists.totalMessagesShown).toBe(DEFAULT_OWL_STATE.totalMessagesShown);
  });

  it('achievements skip whitespace/control ids and floor unlockedAt', () => {
    expect(sanitizeAchievements(null)).toEqual([]);
    expect(sanitizeAchievements({ id: 'x' })).toEqual([]);
    const list = sanitizeAchievements([
      { id: '   ', unlockedAt: 5 },
      { id: '\u0000', unlockedAt: 5 },
      { id: ' keep ', unlockedAt: 3.9 },
      { id: 'neg', unlockedAt: -2 },
      'skip',
    ]);
    expect(list).toEqual([
      { id: 'keep', unlockedAt: 3 },
      { id: 'neg', unlockedAt: 0 },
    ]);
  });
});

describe('q-mp-504 sanitize — game-stats map soft-fail residuals', () => {
  it('rejects non-objects and skips blank / non-object entries', () => {
    expect(sanitizeGameStatsMap([])).toEqual({});
    expect(sanitizeGameStatsMap('hex')).toEqual({});
    const map = sanitizeGameStatsMap({
      '   ': { gamesPlayed: 9 },
      '\u0000': { gamesPlayed: 9 },
      hex: null,
      calla: [1, 2, 3],
      juggle: {
        gameId: 'juggle',
        gamesPlayed: 1,
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
    expect(Object.keys(map)).toEqual(['juggle']);
    expect(map.juggle!.gameId).toBe('juggle');
  });

  it('prefers sanitized value.gameId; falls back counters for Infinity/neg', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    const map = sanitizeGameStatsMap({
      alias: {
        gameId: 'real-id',
        gamesPlayed: Number.POSITIVE_INFINITY,
        gamesWon: -1,
        gamesLost: Number.NaN,
        gamesDraw: 2.7,
        totalPlayTime: -9,
        bestWinStreak: 1.2,
        currentWinStreak: Number.NEGATIVE_INFINITY,
        lastPlayed: -1,
        firstPlayed: Number.NaN,
      },
    });
    expect(map.alias!.gameId).toBe('real-id');
    // createDefaultGameStats fills firstPlayed/lastPlayed with Date.now()
    // when the raw values are non-finite / negative.
    expect(map.alias!.gamesPlayed).toBe(0);
    expect(map.alias!.gamesWon).toBe(0);
    expect(map.alias!.gamesLost).toBe(0);
    expect(map.alias!.gamesDraw).toBe(2);
    expect(map.alias!.totalPlayTime).toBe(0);
    expect(map.alias!.bestWinStreak).toBe(1);
    expect(map.alias!.currentWinStreak).toBe(0);
    expect(map.alias!.lastPlayed).toBe(1_700_000_000_000);
    expect(map.alias!.firstPlayed).toBe(1_700_000_000_000);
    vi.restoreAllMocks();
  });
});
