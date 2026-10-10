/**
 * q-mp-476 — Characterize `pwa/bootstrap` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post914` @ `753052a6`):
 * - `src/pwa/bootstrap.ts` **45** LOC (matches backlog)
 * - Dedicated `mutation-ui3-bootstrap` suite: **4** `it` (+ **1** `it.skip`)
 * - Broader bootstrapPwa coverage already on tip via `q-mp-256`, `q-mp-404`,
 *   burn-1007/1008/1009 (schedule / ric timeout 3000 / setTimeout 1000 /
 *   deferred fire). Combined stmts/lines **100%**; branch residual **91.66%**
 *   (11/12) — uncovered **L41** (`registerSW ?? defaultRegisterSW` when
 *   `registerSW` is omitted).
 * - Void residual at `bootstrap.ts` ric arrow was a keep-site for undrafted
 *   `q-mp-242`; cleared by `q-mp-563` (brace-only). This suite now pins the
 *   braced ric callback shape instead.
 *
 * This suite pins soft-fail / schedule residuals still thin after those
 * suites: omitted-registerSW default path, registerSW throw through the
 * bootstrap schedule chain, missing `serviceWorker` soft no-op, non-function
 * ric → setTimeout fallback, empty-options default enable, double schedule,
 * and structural ric brace shape. No network. No real SW. No copy pins.
 *
 * Narrowed vs open drafts:
 * - `#884` q-mp-404 idle-warm / PWA bootstrap (base post865; tip-equivalent
 *   file already on tip) — leave open; this file stays on `bootstrap.ts` only
 * - `#765` q-mp-256 PWA unit char (base post748; tip-equivalent) — leave open
 * - `#935` q-mp-456 engine coverage r15 (base post898) — disjoint host
 * - `q-mp-563` void clear owns the brace; `q-mp-484` register soft-fail leave
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { resetPwaReloadGuardForTests } from '../../src/pwa/register';

const BOOTSTRAP_SRC = readFileSync(
  resolve(process.cwd(), 'src/pwa/bootstrap.ts'),
  'utf8'
);

function withServiceWorker(): void {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {},
  });
}

function clearServiceWorker(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).serviceWorker;
  } catch {
    /* ignore */
  }
}

afterEach(() => {
  resetPwaReloadGuardForTests();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  clearServiceWorker();
});

describe('q-mp-476 bootstrapPwa — source soft-fail keep-sites', () => {
  it('keeps deferred schedule → registerPwa wiring (no sync register)', () => {
    expect(BOOTSTRAP_SRC).toMatch(/schedule\(\(\)\s*=>\s*\{/);
    expect(BOOTSTRAP_SRC).toMatch(/registerPwa\(\{\s*registerSW\s*\}\)/);
  });

  it('keeps defaultSchedule ric timeout 3000 and setTimeout 1000 fallback', () => {
    expect(BOOTSTRAP_SRC).toMatch(/timeout:\s*3_000/);
    expect(BOOTSTRAP_SRC).toMatch(/setTimeout\(cb,\s*1_000\)/);
  });

  it('keeps braced ric callback after q-mp-563 void clear (no arrow shorthand)', () => {
    // Structural pin — q-mp-563 braced `() => { cb(); }` (no void expression).
    expect(BOOTSTRAP_SRC).toMatch(
      /ric\(\s*\(\)\s*=>\s*\{\s*cb\(\);\s*\}\s*,\s*\{\s*timeout:\s*3_000\s*\}\s*\)/
    );
    expect(BOOTSTRAP_SRC).not.toMatch(/ric\(\(\)\s*=>\s*cb\(\)/);
  });

  it('keeps enabled default on window && document (jsdom soft-enable)', () => {
    expect(BOOTSTRAP_SRC).toMatch(
      /typeof window !== 'undefined' && typeof document !== 'undefined'/
    );
  });
});

describe('q-mp-476 bootstrapPwa — omitted registerSW / soft-fail schedule chain', () => {
  it('omitted registerSW uses virtual default and still registers (L41 branch)', () => {
    withServiceWorker();
    const schedule = vi.fn((cb: () => void) => {
      cb();
    });
    // No registerSW option → `options.registerSW ?? defaultRegisterSW`.
    expect(() => bootstrapPwa({ enabled: true, schedule })).not.toThrow();
    expect(schedule).toHaveBeenCalledTimes(1);
  });

  it('soft-fails when injected registerSW throws inside scheduled callback', () => {
    withServiceWorker();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const registerSW = vi.fn(() => {
      throw new Error('q-mp-476 blocked registration');
    });
    expect(() =>
      bootstrapPwa({
        enabled: true,
        registerSW,
        schedule: (cb) => {
          cb();
        },
      })
    ).not.toThrow();
    expect(registerSW).toHaveBeenCalledOnce();
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[pwa] service worker registration failed')
      )
    ).toBe(true);
  });

  it('missing serviceWorker soft-no-ops registerSW after schedule fires', () => {
    clearServiceWorker();
    expect('serviceWorker' in navigator).toBe(false);
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({
      enabled: true,
      registerSW,
      schedule: (cb) => {
        cb();
      },
    });
    // bootstrap still schedules; registerPwa gates on serviceWorker.
    expect(registerSW).not.toHaveBeenCalled();
  });

  it('empty options still schedules under jsdom (default enabled)', () => {
    withServiceWorker();
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    expect(() => bootstrapPwa()).not.toThrow();
    expect(ric).toHaveBeenCalledTimes(1);
  });
});

describe('q-mp-476 bootstrapPwa — schedule fallback / double-warm residuals', () => {
  it('non-function requestIdleCallback falls through to setTimeout 1000', () => {
    withServiceWorker();
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', 42);
    const registerSW = vi.fn(() => vi.fn());
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    bootstrapPwa({ enabled: true, registerSW });
    expect(timeoutSpy).toHaveBeenCalled();
    const delay = timeoutSpy.mock.calls.find(
      (c) => typeof c[0] === 'function'
    )?.[1];
    expect(delay).toBe(1_000);
    vi.advanceTimersByTime(1_000);
    expect(registerSW).toHaveBeenCalledOnce();
  });

  it('double bootstrapPwa registers two independent schedules', () => {
    withServiceWorker();
    const registerSW = vi.fn(() => vi.fn());
    const scheduled: Array<() => void> = [];
    const schedule = vi.fn((cb: () => void) => {
      scheduled.push(cb);
    });
    bootstrapPwa({ enabled: true, registerSW, schedule });
    bootstrapPwa({ enabled: true, registerSW, schedule });
    expect(schedule).toHaveBeenCalledTimes(2);
    expect(scheduled).toHaveLength(2);
    expect(registerSW).not.toHaveBeenCalled();
    scheduled[0]!();
    expect(registerSW).toHaveBeenCalledTimes(1);
    scheduled[1]!();
    expect(registerSW).toHaveBeenCalledTimes(2);
  });

  it('enabled:false never touches schedule even when registerSW would throw', () => {
    const schedule = vi.fn();
    const registerSW = vi.fn(() => {
      throw new Error('must not run');
    });
    bootstrapPwa({ enabled: false, schedule, registerSW });
    expect(schedule).not.toHaveBeenCalled();
    expect(registerSW).not.toHaveBeenCalled();
  });
});
