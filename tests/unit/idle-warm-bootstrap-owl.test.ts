import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scheduleIdleGameWarm } from '../../src/pwa/idle-warm';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';

describe('scheduleIdleGameWarm', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('imports warm games on the scheduled callback', async () => {
    const importGame = vi.fn().mockResolvedValue({});
    let scheduled: (() => void) | undefined;
    scheduleIdleGameWarm({
      schedule: (cb) => {
        scheduled = cb;
      },
      importGame,
    });
    expect(importGame).not.toHaveBeenCalled();
    scheduled?.();
    await vi.waitFor(() => {
      expect(importGame).toHaveBeenCalledWith('hex');
      expect(importGame).toHaveBeenCalledWith('kings-quadraphages');
    });
  });

  it('skips when disabled', () => {
    const importGame = vi.fn();
    const schedule = vi.fn();
    scheduleIdleGameWarm({ enabled: false, schedule, importGame });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('skips warm when the document is hidden', async () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    const importGame = vi.fn();
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importGame,
    });
    await Promise.resolve();
    expect(importGame).not.toHaveBeenCalled();
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
