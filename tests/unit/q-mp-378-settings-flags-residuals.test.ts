/**
 * q-mp-378 — characterize `src/core/settings-flags.ts` parse / default /
 * unknown-key / cache residuals. Tests only. Structural asserts — no new
 * copy pins; no settings default or player-facing flag copy edits.
 * Ownership disjoint from url-flags ticket q-mp-379.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getUserReducedMotionFlag,
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';
import { PROGRESS_STORAGE_KEY } from '../../src/core/storage';

/** Must match the private key peeked inside settings-flags. */
const PEEK_KEY = 'math-pentathlon-progress';

describe('q-mp-378 settings-flags residuals', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  afterEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  describe('storage key + empty peeks', () => {
    it('peeks the same progress key exported by storage', () => {
      expect(PROGRESS_STORAGE_KEY).toBe(PEEK_KEY);
      localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify({ settings: { reducedMotion: true } })
      );
      expect(getUserReducedMotionFlag()).toBe(true);
    });

    it('empty string and whitespace-only blobs default to false', () => {
      localStorage.setItem(PEEK_KEY, '');
      expect(getUserReducedMotionFlag()).toBe(false);

      resetSettingsFlagsForTests();
      localStorage.setItem(PEEK_KEY, '   ');
      expect(getUserReducedMotionFlag()).toBe(false);
    });

    it('numeric / boolean JSON roots default to false', () => {
      localStorage.setItem(PEEK_KEY, '0');
      expect(getUserReducedMotionFlag()).toBe(false);

      resetSettingsFlagsForTests();
      localStorage.setItem(PEEK_KEY, '1');
      expect(getUserReducedMotionFlag()).toBe(false);

      resetSettingsFlagsForTests();
      localStorage.setItem(PEEK_KEY, 'false');
      expect(getUserReducedMotionFlag()).toBe(false);

      resetSettingsFlagsForTests();
      localStorage.setItem(PEEK_KEY, 'true');
      expect(getUserReducedMotionFlag()).toBe(false);
    });
  });

  describe('unknown-key + settings shape edges', () => {
    it('ignores unknown progress-root keys when reducedMotion is true', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({
          version: 99,
          unknownRoot: 'x',
          games: { hex: { wins: 1 } },
          settings: { reducedMotion: true, unknownSetting: 42 },
        })
      );
      expect(getUserReducedMotionFlag()).toBe(true);
    });

    it('ignores top-level reducedMotion without a settings object', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ reducedMotion: true, version: 1 })
      );
      expect(getUserReducedMotionFlag()).toBe(false);
    });

    it('settings primitives (string/number/boolean) default to false', () => {
      for (const settings of ['yes', 1, true, false] as const) {
        resetSettingsFlagsForTests();
        localStorage.setItem(PEEK_KEY, JSON.stringify({ settings }));
        expect(getUserReducedMotionFlag()).toBe(false);
      }
    });

    it('empty settings object defaults to false', () => {
      localStorage.setItem(PEEK_KEY, JSON.stringify({ settings: {} }));
      expect(getUserReducedMotionFlag()).toBe(false);
    });
  });

  describe('reducedMotion value matrix (strict === true)', () => {
    it.each([
      [true, true],
      [false, false],
      [1, false],
      [0, false],
      [null, false],
      ['true', false],
      ['false', false],
      ['1', false],
      [{}, false],
      [[], false],
    ] as const)('reducedMotion=%j → %s', (reducedMotion, expected) => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion } })
      );
      expect(getUserReducedMotionFlag()).toBe(expected);
    });

    it('missing reducedMotion key defaults to false', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { soundEnabled: true } })
      );
      expect(getUserReducedMotionFlag()).toBe(false);
    });
  });

  describe('in-memory cache vs localStorage', () => {
    it('first peek caches; later localStorage writes are ignored until reset', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion: false } })
      );
      expect(getUserReducedMotionFlag()).toBe(false);

      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion: true } })
      );
      expect(getUserReducedMotionFlag()).toBe(false);

      resetSettingsFlagsForTests();
      expect(getUserReducedMotionFlag()).toBe(true);
    });

    it('setUserReducedMotionFlag wins over a contradictory peek blob', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion: true } })
      );
      setUserReducedMotionFlag(false);
      expect(getUserReducedMotionFlag()).toBe(false);

      setUserReducedMotionFlag(true);
      expect(getUserReducedMotionFlag()).toBe(true);
    });

    it('reset after set re-peeks localStorage', () => {
      setUserReducedMotionFlag(true);
      expect(getUserReducedMotionFlag()).toBe(true);

      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion: false } })
      );
      resetSettingsFlagsForTests();
      expect(getUserReducedMotionFlag()).toBe(false);
    });

    it('repeated get without reset returns the same cached boolean', () => {
      localStorage.setItem(
        PEEK_KEY,
        JSON.stringify({ settings: { reducedMotion: true } })
      );
      const a = getUserReducedMotionFlag();
      localStorage.removeItem(PEEK_KEY);
      const b = getUserReducedMotionFlag();
      expect(a).toBe(true);
      expect(b).toBe(true);
      expect(b).toBe(a);
    });
  });
});
