/**
 * q-mp-507 mutation audit UI wave 17 — re-pin first-20 window in
 * core/storage/sanitize (already 100% on tip). Hard-coded numeric / boolean
 * expectations only — no player-facing copy asserts.
 */
import { describe, expect, it } from 'vitest';

import {
  MAX_PROFILE_AVATAR_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  sanitizeDisplayString,
  sanitizeDisplayStringAllowEmpty,
  sanitizeProfile,
  sanitizeStreak,
} from '../../src/core/storage/sanitize';

describe('mutation-ui17 storage sanitize', () => {
  it('exported max lengths are exactly 64', () => {
    // First-20 NumericBoundary on MAX_* consts (64→65/63).
    expect(MAX_PROFILE_NAME_LENGTH).toBe(64);
    expect(MAX_PROFILE_AVATAR_LENGTH).toBe(64);
    expect(sanitizeDisplayString('x'.repeat(100), 64)?.length).toBe(64);
    expect(sanitizeDisplayStringAllowEmpty('y'.repeat(100), 64)?.length).toBe(
      64
    );
  });

  it('isPlainObject rejects null / arrays / non-objects', () => {
    // L43 && / === / !== / UnaryNot survivors window.
    expect(sanitizeProfile(null)).toBeNull();
    expect(sanitizeProfile([])).toBeNull();
    expect(sanitizeProfile('nope')).toBeNull();
    expect(
      sanitizeProfile({
        id: 'p1',
        name: 'Kid',
        avatar: 'default',
        createdAt: 1,
        lastActiveAt: 2,
      })
    ).not.toBeNull();
  });

  it('asFiniteNumber / asNonNegativeInt keep 0 and reject Infinity', () => {
    // L47 && / === and L52 >= / 0→1 window.
    const profile = sanitizeProfile({
      id: 'p1',
      name: 'Kid',
      avatar: 'default',
      createdAt: 0,
      lastActiveAt: 0,
    });
    expect(profile!.createdAt).toBe(0);
    expect(profile!.lastActiveAt).toBe(0);

    const streak = sanitizeStreak({
      currentStreak: Number.POSITIVE_INFINITY,
      bestStreak: -1,
    });
    expect(streak.currentStreak).toBe(0);
    expect(streak.bestStreak).toBe(0);
  });

  it('sanitizeDisplayString rejects non-string (L60 !==)', () => {
    expect(sanitizeDisplayString(12, 64)).toBeNull();
    expect(sanitizeDisplayString(undefined, 64)).toBeNull();
    expect(sanitizeDisplayString('ok', 64)).toBe('ok');
  });
});
