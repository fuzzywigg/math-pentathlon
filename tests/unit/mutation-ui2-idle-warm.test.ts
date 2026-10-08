import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';

describe('mutation-ui2 idle-warm survivors', () => {
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
    try {
      delete (navigator as Navigator & { connection?: unknown }).connection;
    } catch {
      /* ignore */
    }
  });

  it('defaultSchedule uses requestIdleCallback when present', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 7;
    });
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: ric,
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({ importShell, importGame });
    expect(ric).toHaveBeenCalledTimes(1);
    const opts = ric.mock.calls[0]?.[1] as IdleRequestOptions | undefined;
    expect(opts?.timeout).toBe(4_000);
  });

  it('defaultSchedule falls back to setTimeout(1500) without ric', () => {
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: undefined,
    });
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((cb: TimerHandler) => {
        if (typeof cb === 'function') cb();
        return 1 as unknown as number;
      }) as typeof setTimeout);
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({ importShell, importGame });
    expect(setTimeoutSpy).toHaveBeenCalled();
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[0] === 'function'
    )?.[1];
    expect(delay).toBe(1_500);
  });

  it('skips imports when Save-Data is on but still marks done', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });

  it('allows warm when saveData is false', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: false },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalledTimes(1);
      expect(importGame).toHaveBeenCalled();
    });
  });

  it('connection throw is treated as not-save-data (warm proceeds)', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get() {
        throw new Error('no conn');
      },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalledTimes(1);
    });
  });

  it('enabled defaults true only when window+document exist', () => {
    const schedule = vi.fn();
    scheduleIdleGameWarm({
      schedule,
      importShell: vi.fn(),
      importGame: vi.fn(),
    });
    expect(schedule).toHaveBeenCalledTimes(1);
  });

  it('hidden OR saveData short-circuit uses || (not &&)', async () => {
    // hidden=false, saveData=true → must skip (|| short-circuit)
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
  });
});
