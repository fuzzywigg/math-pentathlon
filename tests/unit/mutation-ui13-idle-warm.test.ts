/**
 * q-mp-402 mutation audit UI wave 13 — idle-warm structural kills.
 * Separate from characterization q-mp-404 / wave-2 suites. No copy asserts;
 * hard-coded timing / game-id / attribute contracts so logical mutants die.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';

describe('mutation-ui13 idle-warm', () => {
  const hadRic = Object.prototype.hasOwnProperty.call(
    window,
    'requestIdleCallback'
  );
  const originalRic = window.requestIdleCallback;

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
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    try {
      delete (navigator as Navigator & { connection?: unknown }).connection;
    } catch {
      /* ignore */
    }
    if (hadRic) {
      Object.defineProperty(window, 'requestIdleCallback', {
        configurable: true,
        writable: true,
        value: originalRic,
      });
    } else {
      try {
        delete (window as Window & { requestIdleCallback?: unknown })
          .requestIdleCallback;
      } catch {
        Object.defineProperty(window, 'requestIdleCallback', {
          configurable: true,
          writable: true,
          value: undefined,
        });
      }
    }
  });

  it('attr marker is exactly data-mp-idle-warm / done', () => {
    expect(IDLE_WARM_DONE_ATTR).toBe('data-mp-idle-warm');
    let scheduled: (() => void) | undefined;
    scheduleIdleGameWarm({
      schedule: (cb) => {
        scheduled = cb;
      },
      importShell: vi.fn().mockResolvedValue({}),
      importGame: vi.fn().mockResolvedValue({}),
    });
    scheduled?.();
    return vi.waitFor(() => {
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('ric timeout is exactly 4000 (kills NumericBoundary on timeout)', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: ric,
    });
    scheduleIdleGameWarm({
      importShell: vi.fn().mockResolvedValue({}),
      importGame: vi.fn().mockResolvedValue({}),
    });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(ric.mock.calls[0]?.[1]).toEqual({ timeout: 4_000 });
  });

  it('setTimeout fallback delay is exactly 1500', () => {
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: undefined,
    });
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation(((
      cb: TimerHandler
    ) => {
      if (typeof cb === 'function') cb();
      return 1 as unknown as number;
    }) as typeof setTimeout);
    scheduleIdleGameWarm({
      importShell: vi.fn().mockResolvedValue({}),
      importGame: vi.fn().mockResolvedValue({}),
    });
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[0] === 'function'
    )?.[1];
    expect(delay).toBe(1_500);
  });

  it('warms hex then kings-quadraphages in that order', async () => {
    const order: string[] = [];
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn(async (id: string) => {
      order.push(id);
      return {};
    });
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(order).toEqual(['hex', 'kings-quadraphages']);
    });
  });

  it('kills L101 ||→&& via successive document.hidden reads', async () => {
    // Async body runs sync until the first await, so flip-after-schedule is
    // too late. Use a getter that returns true on the L101 read and false on
    // later reads: original || early-returns; mutant && continues and warms.
    let hiddenReads = 0;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => {
        hiddenReads += 1;
        return hiddenReads === 1;
      },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });

  it('kills L108 &&→|| via successive connection.saveData reads', async () => {
    // 1st prefersSaveData (L101): false → pass gate.
    // 2nd (L108): true → original && skips shell; mutant || still warms.
    let saveDataReads = 0;
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get: () => {
        saveDataReads += 1;
        return { saveData: saveDataReads >= 2 };
      },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });

  it('shell warm failure is swallowed and games still warm', async () => {
    const importShell = vi.fn().mockRejectedValue(new Error('shell boom'));
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalledTimes(1);
      expect(importGame).toHaveBeenCalledWith('hex');
      expect(importGame).toHaveBeenCalledWith('kings-quadraphages');
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('game warm failure is swallowed and later games still attempt', async () => {
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi
      .fn()
      .mockRejectedValueOnce(new Error('hex boom'))
      .mockResolvedValueOnce({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importGame).toHaveBeenCalledTimes(2);
      expect(importGame).toHaveBeenNthCalledWith(1, 'hex');
      expect(importGame).toHaveBeenNthCalledWith(2, 'kings-quadraphages');
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('saveData === true is strict (not !==) for prefersSaveData', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: 1 as unknown as boolean },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      // 1 !== true → not save-data → warm proceeds
      expect(importShell).toHaveBeenCalledTimes(1);
    });
  });

  // Equivalent under jsdom: window and document always both exist, so
  // `typeof window !== 'undefined' && typeof document !== 'undefined'` cannot
  // be distinguished from `||` without breaking the runner.
  it.skip('enabled default window&&document → || is observationally equivalent under jsdom', () => {
    expect(typeof window).not.toBe('undefined');
    expect(typeof document).not.toBe('undefined');
  });
});
