/**
 * Hermetic coverage for scripts/lib/page-ready.mjs (q-mp-921).
 * Fake Playwright page only — no Chromium launch.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  waitForGameReady,
  gotoGame,
  startHuman,
} from '../../scripts/lib/page-ready.mjs';

type WaitForOpts = { state?: string; timeout?: number };

type LocatorStub = {
  waitFor: ReturnType<typeof vi.fn<(opts?: WaitForOpts) => Promise<void>>>;
  isVisible: ReturnType<typeof vi.fn<() => Promise<boolean>>>;
  click: ReturnType<
    typeof vi.fn<(opts?: { force?: boolean }) => Promise<void>>
  >;
  first: () => LocatorStub;
};

function createLocator(visible = false): LocatorStub {
  const loc: LocatorStub = {
    waitFor: vi.fn(async () => undefined),
    isVisible: vi.fn(async () => visible),
    click: vi.fn(async () => undefined),
    first() {
      return loc;
    },
  };
  return loc;
}

type FakePageOptions = {
  /** Selectors that report isVisible() === true */
  visibleSelectors?: string[];
};

function createFakePage(options: FakePageOptions = {}) {
  const visible = new Set(options.visibleSelectors ?? []);
  const locators = new Map<string, LocatorStub>();
  const goto = vi.fn(async (_url: string, _opts?: { waitUntil?: string }) => {
    /* no-op */
  });
  const evaluate = vi.fn(async (_fn: () => unknown) => undefined);

  const page = {
    goto,
    evaluate,
    locator(selector: string): LocatorStub {
      let loc = locators.get(selector);
      if (!loc) {
        loc = createLocator(visible.has(selector));
        locators.set(selector, loc);
      }
      return loc;
    },
  };

  return { page, goto, evaluate, locators };
}

describe('waitForGameReady (q-mp-921)', () => {
  it('waits for loading chrome hidden then shell chrome visible', async () => {
    const { page, locators } = createFakePage();
    await waitForGameReady(page);

    const loading = locators.get('[data-testid="game-loading"]');
    const loadError = locators.get('[data-testid="game-load-error"]');
    const shell = locators.get('#new-game-btn, h1');
    expect(loading).toBeDefined();
    expect(loadError).toBeDefined();
    expect(shell).toBeDefined();
    expect(loading!.waitFor).toHaveBeenCalledWith({
      state: 'hidden',
      timeout: 20_000,
    });
    expect(loadError!.waitFor).toHaveBeenCalledWith({
      state: 'hidden',
      timeout: 20_000,
    });
    expect(shell!.waitFor).toHaveBeenCalledWith({ timeout: 20_000 });
  });

  it('honors timeoutMs for loading, load-error, and shell waits', async () => {
    const { page, locators } = createFakePage();
    await waitForGameReady(page, { timeoutMs: 5_000 });

    expect(
      locators.get('[data-testid="game-loading"]')!.waitFor
    ).toHaveBeenCalledWith({ state: 'hidden', timeout: 5_000 });
    expect(
      locators.get('[data-testid="game-load-error"]')!.waitFor
    ).toHaveBeenCalledWith({ state: 'hidden', timeout: 5_000 });
    expect(locators.get('#new-game-btn, h1')!.waitFor).toHaveBeenCalledWith({
      timeout: 5_000,
    });
  });

  it('swallows loading-wait rejection and still waits for load-error + shell', async () => {
    const { page, locators } = createFakePage();
    // Pre-create loading locator so we can stub a rejection.
    const loading = page.locator('[data-testid="game-loading"]');
    loading.waitFor.mockRejectedValueOnce(new Error('timeout'));

    await expect(waitForGameReady(page)).resolves.toBeUndefined();
    expect(
      locators.get('[data-testid="game-load-error"]')!.waitFor
    ).toHaveBeenCalled();
    expect(locators.get('#new-game-btn, h1')!.waitFor).toHaveBeenCalled();
  });

  it('rejects when game-load-error stays visible (q-mp-1294)', async () => {
    const { page, locators } = createFakePage();
    const loadError = page.locator('[data-testid="game-load-error"]');
    loadError.waitFor.mockRejectedValueOnce(new Error('Timeout 20000ms'));

    await expect(waitForGameReady(page)).rejects.toThrow(/Timeout/);
    expect(loadError.waitFor).toHaveBeenCalledWith({
      state: 'hidden',
      timeout: 20_000,
    });
    // Must not treat shell chrome as ready while load-error is stuck.
    expect(locators.has('#new-game-btn, h1')).toBe(false);
  });
});

describe('gotoGame (q-mp-921)', () => {
  it('shapes URL with board3d query and hash route', async () => {
    const { page, goto } = createFakePage();
    await gotoGame(page, 'http://127.0.0.1:4173', 'hex', true);

    expect(goto).toHaveBeenCalledWith(
      'http://127.0.0.1:4173/?board3d=1#/game/hex',
      { waitUntil: 'domcontentloaded' }
    );
  });

  it('omits board3d query when board3d is false', async () => {
    const { page, goto } = createFakePage();
    await gotoGame(page, 'http://127.0.0.1:4173', 'calla', false);

    expect(goto).toHaveBeenCalledWith('http://127.0.0.1:4173/#/game/calla', {
      waitUntil: 'domcontentloaded',
    });
  });

  it('joins trailing-slash baseURL without a double slash (q-mp-1280)', async () => {
    const { page, goto } = createFakePage();
    await gotoGame(page, 'http://127.0.0.1:5173/', 'hex', false);

    expect(goto).toHaveBeenCalledWith('http://127.0.0.1:5173/#/game/hex', {
      waitUntil: 'domcontentloaded',
    });
  });

  it('joins trailing-slash baseURL with board3d without // before ? (q-mp-1280)', async () => {
    const { page, goto } = createFakePage();
    await gotoGame(page, 'http://127.0.0.1:5173/', 'hex', true);

    expect(goto).toHaveBeenCalledWith(
      'http://127.0.0.1:5173/?board3d=1#/game/hex',
      { waitUntil: 'domcontentloaded' }
    );
  });

  it('collapses multiple trailing slashes on baseURL (q-mp-1280)', async () => {
    const { page, goto } = createFakePage();
    await gotoGame(page, 'http://127.0.0.1:5173///', 'calla', false);

    expect(goto).toHaveBeenCalledWith('http://127.0.0.1:5173/#/game/calla', {
      waitUntil: 'domcontentloaded',
    });
  });

  it('waits for ready then dismisses owl (evaluate pointer-events path)', async () => {
    const { page, goto, evaluate, locators } = createFakePage();
    await gotoGame(page, 'http://localhost:5173', 'fiar');

    expect(goto).toHaveBeenCalledOnce();
    expect(
      locators.get('[data-testid="game-loading"]')!.waitFor
    ).toHaveBeenCalled();
    expect(locators.get('#new-game-btn, h1')!.waitFor).toHaveBeenCalled();
    // dismissOwl default pointerEventsNone runs page.evaluate
    expect(evaluate).toHaveBeenCalled();
  });
});

describe('startHuman (q-mp-921)', () => {
  it('clicks human-vs-human and start when modal is visible', async () => {
    const { page, locators } = createFakePage({
      visibleSelectors: [
        '#new-game-modal',
        '.mode-option[data-mode="human-vs-human"]',
      ],
    });

    await startHuman(page);

    const human = locators.get('.mode-option[data-mode="human-vs-human"]');
    const start = locators.get('#start-game-btn');
    const modal = locators.get('#new-game-modal');
    expect(human!.click).toHaveBeenCalledOnce();
    expect(start!.click).toHaveBeenCalledOnce();
    expect(modal!.waitFor).toHaveBeenCalledWith({
      state: 'hidden',
      timeout: 10_000,
    });
  });

  it('skips mode/start clicks when modal is not visible', async () => {
    const { page, locators } = createFakePage();

    await startHuman(page);

    // Modal was probed but not visible — start button must not be clicked.
    expect(locators.has('#start-game-btn')).toBe(false);
    expect(locators.get('#new-game-modal')!.isVisible).toHaveBeenCalled();
  });

  it('skips human mode click when option is not visible but still starts', async () => {
    const { page, locators } = createFakePage({
      visibleSelectors: ['#new-game-modal'],
    });

    await startHuman(page);

    const human = locators.get('.mode-option[data-mode="human-vs-human"]');
    const start = locators.get('#start-game-btn');
    expect(human!.click).not.toHaveBeenCalled();
    expect(start!.click).toHaveBeenCalledOnce();
  });
});
