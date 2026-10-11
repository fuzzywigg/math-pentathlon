/**
 * @vitest-environment node
 *
 * Hermetic coverage for measureTTI ready-wait adoption (q-mp-948).
 * Fake Playwright page only — no Chromium launch.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { measureTTI } from '../../scripts/render-perf-mode.mjs';

type WaitForOpts = { state?: string; timeout?: number };

type LocatorStub = {
  waitFor: ReturnType<typeof vi.fn<(opts?: WaitForOpts) => Promise<void>>>;
  first: () => LocatorStub;
};

function createLocator(): LocatorStub {
  const loc: LocatorStub = {
    waitFor: vi.fn(async () => undefined),
    first() {
      return loc;
    },
  };
  return loc;
}

function createFakePage(timestamps: number[]) {
  let stampIdx = 0;
  const locators = new Map<string, LocatorStub>();
  const evaluate = vi.fn(async (_fn: () => unknown) => {
    const value = timestamps[stampIdx] ?? timestamps[timestamps.length - 1];
    stampIdx += 1;
    return value;
  });

  const page = {
    evaluate,
    locator(selector: string): LocatorStub {
      let loc = locators.get(selector);
      if (!loc) {
        loc = createLocator();
        locators.set(selector, loc);
      }
      return loc;
    },
  };

  return { page, evaluate, locators };
}

describe('measureTTI (q-mp-948)', () => {
  it('waits via waitForGameReady contract after navigateFn', async () => {
    const { page, locators } = createFakePage([100, 250]);
    const navigateFn = vi.fn(async () => undefined);

    const ms = await measureTTI(page, navigateFn);

    expect(navigateFn).toHaveBeenCalledOnce();
    expect(ms).toBe(150);

    const loading = locators.get('[data-testid="game-loading"]');
    const shell = locators.get('#new-game-btn, h1');
    expect(loading).toBeDefined();
    expect(shell).toBeDefined();
    expect(loading!.waitFor).toHaveBeenCalledWith({
      state: 'hidden',
      timeout: 20_000,
    });
    expect(shell!.waitFor).toHaveBeenCalledWith({ timeout: 20_000 });
  });

  it('measures TTI around navigateFn (t0 before, t1 after ready)', async () => {
    const order: string[] = [];
    const { page } = createFakePage([10, 40]);
    // Wrap evaluate to record call order relative to navigate
    const originalEvaluate = page.evaluate;
    page.evaluate = vi.fn(async (fn: () => unknown) => {
      order.push('evaluate');
      return originalEvaluate(fn);
    });

    const navigateFn = vi.fn(async () => {
      order.push('navigate');
    });

    await measureTTI(page, navigateFn);

    const navIdx = order.indexOf('navigate');
    expect(navIdx).toBeGreaterThan(0);
    expect(order[0]).toBe('evaluate'); // t0
    expect(order.slice(navIdx + 1).includes('evaluate')).toBe(true); // t1 (+ rAF)
  });
});

describe('render-perf-mode measureTTI source (q-mp-948)', () => {
  it('imports waitForGameReady and does not hand-roll loading waits in measureTTI', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'scripts/render-perf-mode.mjs'),
      'utf8'
    );
    expect(src).toMatch(/from ['"]\.\/lib\/page-ready\.mjs['"]/);
    expect(src).toMatch(/waitForGameReady\s*\(/);

    const measureStart = src.indexOf('export async function measureTTI');
    expect(measureStart).toBeGreaterThanOrEqual(0);
    const nextExport = src.indexOf('\nexport async function', measureStart + 1);
    const body =
      nextExport === -1
        ? src.slice(measureStart)
        : src.slice(measureStart, nextExport);

    expect(body).toMatch(/waitForGameReady/);
    expect(body).not.toMatch(/data-testid="game-loading"/);
  });
});
