import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';

describe('scheduleIdleGameWarm', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
  });

  it('imports shell then warm games on the scheduled callback', async () => {
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    let scheduled: (() => void) | undefined;
    scheduleIdleGameWarm({
      schedule: (cb) => {
        scheduled = cb;
      },
      importShell,
      importGame,
    });
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    scheduled?.();
    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalledTimes(1);
      expect(importGame).toHaveBeenCalledWith('hex');
      expect(importGame).toHaveBeenCalledWith('kings-quadraphages');
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('skips when disabled', () => {
    const importGame = vi.fn();
    const importShell = vi.fn();
    const schedule = vi.fn();
    scheduleIdleGameWarm({
      enabled: false,
      schedule,
      importGame,
      importShell,
    });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('skips warm when the document is hidden and still marks done', async () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    const importGame = vi.fn();
    const importShell = vi.fn();
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importGame,
      importShell,
    });
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });
});

describe('bootstrapOwl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('schedules work when enabled', () => {
    const schedule = vi.fn();
    bootstrapOwl({ schedule });
    expect(schedule).toHaveBeenCalledTimes(1);
  });

  it('no-ops when disabled', () => {
    const schedule = vi.fn();
    bootstrapOwl({ enabled: false, schedule });
    expect(schedule).not.toHaveBeenCalled();
  });
});
