/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in settings-flags.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getUserReducedMotionFlag,
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

const KEY = 'math-pentathlon-progress';

describe('mutation-ui settings-flags', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  afterEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  it('peek returns false when storage missing', () => {
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('peek returns false for invalid JSON', () => {
    localStorage.setItem(KEY, '{not-json');
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('peek returns false for non-object / array / null JSON roots', () => {
    localStorage.setItem(KEY, 'null');
    resetSettingsFlagsForTests();
    expect(getUserReducedMotionFlag()).toBe(false);

    localStorage.setItem(KEY, '[]');
    resetSettingsFlagsForTests();
    expect(getUserReducedMotionFlag()).toBe(false);

    localStorage.setItem(KEY, '"string"');
    resetSettingsFlagsForTests();
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('peek returns false when settings is missing or non-object', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 1 }));
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      KEY,
      JSON.stringify({ version: 1, settings: null })
    );
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      KEY,
      JSON.stringify({ version: 1, settings: [] })
    );
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('peek returns true only when settings.reducedMotion === true', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ settings: { reducedMotion: true } })
    );
    expect(getUserReducedMotionFlag()).toBe(true);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      KEY,
      JSON.stringify({ settings: { reducedMotion: false } })
    );
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      KEY,
      JSON.stringify({ settings: { reducedMotion: 'true' } })
    );
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('setUserReducedMotionFlag overrides peek cache', () => {
    setUserReducedMotionFlag(true);
    expect(getUserReducedMotionFlag()).toBe(true);
    setUserReducedMotionFlag(false);
    expect(getUserReducedMotionFlag()).toBe(false);
  });
});
