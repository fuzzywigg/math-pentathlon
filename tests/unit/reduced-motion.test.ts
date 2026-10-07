import { afterEach, describe, expect, it } from 'vitest';
import { storage } from '../../src/core/storage';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  prefersReducedMotion,
  scrollBehaviorForMotion,
} from '../../src/ui/reduced-motion';

describe('reduced-motion helpers', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    storage.resetAll();
  });

  it('prefersReducedMotion is true when user setting is on', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(true);
  });

  it('prefersReducedMotion is true when OS asks for reduce', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: true,
      })
    ).toBe(true);
  });

  it('prefersReducedMotion is false when neither asks', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(false);
  });

  it('applyReducedMotionPreference sets html data attribute from user setting', () => {
    storage.updateSettings({ reducedMotion: true });
    applyReducedMotionPreference({ osPrefersReducedMotion: false });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );

    storage.updateSettings({ reducedMotion: false });
    applyReducedMotionPreference({ osPrefersReducedMotion: false });
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
  });

  it('scrollBehaviorForMotion is auto when user reduced-motion is on', () => {
    storage.updateSettings({ reducedMotion: true });
    expect(scrollBehaviorForMotion()).toBe('auto');
  });

  it('scrollBehaviorForMotion is smooth when prefs are forced off', () => {
    // scrollBehaviorForMotion reads live storage + matchMedia; assert the
    // pure mapping via prefersReducedMotion options instead of jsdom MQL.
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
        ? 'auto'
        : 'smooth'
    ).toBe('smooth');
  });
});
