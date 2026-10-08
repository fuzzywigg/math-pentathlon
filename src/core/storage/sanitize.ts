/**
 * Validate / sanitize progress fields that can later appear in the UI.
 * Rejects non-string / oversized values so corrupt localStorage cannot
 * smuggle markup into rendering paths.
 */

import type {
  Achievement,
  GameStats,
  OwlMood,
  OwlState,
  PlayerProfile,
  StreakData,
  UserSettings,
} from './types';
import {
  DEFAULT_OWL_STATE,
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
  createDefaultGameStats,
} from './types';

export const MAX_PROFILE_NAME_LENGTH = 64;
export const MAX_PROFILE_AVATAR_LENGTH = 64;
export const MAX_PROFILE_ID_LENGTH = 64;
export const MAX_GAME_ID_LENGTH = 64;
export const MAX_ACHIEVEMENT_ID_LENGTH = 64;

const OWL_MOODS: ReadonlySet<OwlMood> = new Set([
  'happy',
  'encouraging',
  'celebrating',
  'thinking',
  'sleepy',
  'proud',
]);

const OWL_FREQUENCIES: ReadonlySet<UserSettings['owlFrequency']> = new Set([
  'chatty',
  'normal',
  'quiet',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asNonNegativeInt(value: unknown, fallback: number): number {
  const n = asFiniteNumber(value, fallback);
  return n >= 0 ? Math.floor(n) : fallback;
}

/** Strip control chars and cap length; empty/whitespace → null. */
export function sanitizeDisplayString(
  value: unknown,
  maxLength: number
): string | null {
  if (typeof value !== 'string') return null;
  // eslint-disable-next-line no-control-regex -- intentional control-char strip
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

/**
 * Like sanitizeDisplayString but preserves explicit empty strings
 * (createProfile historically accepts `''` name/avatar).
 */
export function sanitizeDisplayStringAllowEmpty(
  value: unknown,
  maxLength: number
): string | null {
  if (typeof value !== 'string') return null;
  // eslint-disable-next-line no-control-regex -- intentional control-char strip
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '');
  return cleaned.slice(0, maxLength);
}

export function sanitizeProfile(raw: unknown): PlayerProfile | null {
  if (!isPlainObject(raw)) return null;
  // Name/avatar may be empty strings (historical createProfile behavior).
  if (typeof raw.name !== 'string' || typeof raw.id !== 'string') return null;
  const name = sanitizeDisplayStringAllowEmpty(
    raw.name,
    MAX_PROFILE_NAME_LENGTH
  );
  const id = sanitizeDisplayStringAllowEmpty(raw.id, MAX_PROFILE_ID_LENGTH);
  if (name === null || id === null || !id) return null;
  const avatar =
    typeof raw.avatar === 'string'
      ? (sanitizeDisplayStringAllowEmpty(
          raw.avatar,
          MAX_PROFILE_AVATAR_LENGTH
        ) ?? '')
      : 'default';
  return {
    id,
    name,
    avatar,
    createdAt: asNonNegativeInt(raw.createdAt, Date.now()),
    lastActiveAt: asNonNegativeInt(raw.lastActiveAt, Date.now()),
  };
}

export function sanitizeStreak(raw: unknown): StreakData {
  if (!isPlainObject(raw)) return { ...DEFAULT_STREAK };
  return {
    currentStreak: asNonNegativeInt(raw.currentStreak, 0),
    bestStreak: asNonNegativeInt(raw.bestStreak, 0),
    lastPlayDate:
      typeof raw.lastPlayDate === 'string' ? raw.lastPlayDate.slice(0, 32) : '',
    streakStartDate:
      typeof raw.streakStartDate === 'string'
        ? raw.streakStartDate.slice(0, 32)
        : '',
  };
}

export function sanitizeSettings(raw: unknown): UserSettings {
  if (!isPlainObject(raw)) return { ...DEFAULT_SETTINGS };
  const freq = raw.owlFrequency;
  return {
    owlEnabled:
      typeof raw.owlEnabled === 'boolean'
        ? raw.owlEnabled
        : DEFAULT_SETTINGS.owlEnabled,
    soundEnabled:
      typeof raw.soundEnabled === 'boolean'
        ? raw.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    reducedMotion:
      typeof raw.reducedMotion === 'boolean'
        ? raw.reducedMotion
        : DEFAULT_SETTINGS.reducedMotion,
    owlFrequency:
      typeof freq === 'string' &&
      OWL_FREQUENCIES.has(freq as UserSettings['owlFrequency'])
        ? (freq as UserSettings['owlFrequency'])
        : DEFAULT_SETTINGS.owlFrequency,
  };
}

export function sanitizeOwlState(raw: unknown): OwlState {
  if (!isPlainObject(raw)) {
    return {
      mood: DEFAULT_OWL_STATE.mood,
      lastInteraction: DEFAULT_OWL_STATE.lastInteraction,
      messagesSeen: [],
      tutorialsCompleted: [],
      totalMessagesShown: DEFAULT_OWL_STATE.totalMessagesShown,
    };
  }
  const mood = raw.mood;
  return {
    mood:
      typeof mood === 'string' && OWL_MOODS.has(mood as OwlMood)
        ? (mood as OwlMood)
        : DEFAULT_OWL_STATE.mood,
    lastInteraction: asNonNegativeInt(
      raw.lastInteraction,
      DEFAULT_OWL_STATE.lastInteraction
    ),
    messagesSeen: Array.isArray(raw.messagesSeen)
      ? raw.messagesSeen
          .filter((id): id is string => typeof id === 'string')
          .map((id) => id.slice(0, MAX_ACHIEVEMENT_ID_LENGTH))
      : [],
    tutorialsCompleted: Array.isArray(raw.tutorialsCompleted)
      ? raw.tutorialsCompleted
          .filter((id): id is string => typeof id === 'string')
          .map((id) => id.slice(0, MAX_ACHIEVEMENT_ID_LENGTH))
      : [],
    totalMessagesShown: asNonNegativeInt(
      raw.totalMessagesShown,
      DEFAULT_OWL_STATE.totalMessagesShown
    ),
  };
}

export function sanitizeAchievements(raw: unknown): Achievement[] {
  if (!Array.isArray(raw)) return [];
  const out: Achievement[] = [];
  for (const item of raw) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeDisplayString(item.id, MAX_ACHIEVEMENT_ID_LENGTH);
    if (!id) continue;
    out.push({
      id,
      unlockedAt: asNonNegativeInt(item.unlockedAt, 0),
    });
  }
  return out;
}

export function sanitizeGameStatsMap(raw: unknown): Record<string, GameStats> {
  if (!isPlainObject(raw)) return {};
  const out: Record<string, GameStats> = {};
  for (const [key, value] of Object.entries(raw)) {
    const gameId = sanitizeDisplayString(key, MAX_GAME_ID_LENGTH);
    if (!gameId || !isPlainObject(value)) continue;
    const defaults = createDefaultGameStats(gameId);
    const idFromValue = sanitizeDisplayString(value.gameId, MAX_GAME_ID_LENGTH);
    out[gameId] = {
      gameId: idFromValue ?? gameId,
      gamesPlayed: asNonNegativeInt(value.gamesPlayed, defaults.gamesPlayed),
      gamesWon: asNonNegativeInt(value.gamesWon, defaults.gamesWon),
      gamesLost: asNonNegativeInt(value.gamesLost, defaults.gamesLost),
      gamesDraw: asNonNegativeInt(value.gamesDraw, defaults.gamesDraw),
      totalPlayTime: asNonNegativeInt(
        value.totalPlayTime,
        defaults.totalPlayTime
      ),
      bestWinStreak: asNonNegativeInt(
        value.bestWinStreak,
        defaults.bestWinStreak
      ),
      currentWinStreak: asNonNegativeInt(
        value.currentWinStreak,
        defaults.currentWinStreak
      ),
      lastPlayed: asNonNegativeInt(value.lastPlayed, defaults.lastPlayed),
      firstPlayed: asNonNegativeInt(value.firstPlayed, defaults.firstPlayed),
    };
  }
  return out;
}
