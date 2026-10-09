/**
 * q-mp-299 — characterize src/main.ts soft-fail / route bootstrap residuals.
 * Tests only. Structural asserts (data-testid, console diagnostic prefixes,
 * callback wiring, route generation). No player-facing copy pins.
 *
 * Targets tip overlay residuals: void fire-and-forget / navigate shorthand
 * sites ×12, intentional no-console keep-sites, and soft-fail branches
 * (missing #app bootstrap skip, throwing route cleanup, stats/demo load
 * reject, stale routeGen abort, offline load-error option).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn(() => vi.fn()),
}));

const bootstrapPwa = vi.fn();
const bootstrapOwl = vi.fn();
const scheduleIdleGameWarm = vi.fn();
vi.mock('../../src/pwa/bootstrap', () => ({
  bootstrapPwa,
}));
vi.mock('../../src/pwa/bootstrap-owl', () => ({
  bootstrapOwl,
}));
vi.mock('../../src/pwa/idle-warm', () => ({
  scheduleIdleGameWarm,
}));
vi.mock('../../src/ui/reduced-motion', () => ({
  bindReducedMotionPreference: vi.fn(() => () => undefined),
}));

const isBrowserOffline = vi.fn(() => false);
vi.mock('../../src/ui/offline', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/ui/offline')>();
  return {
    ...actual,
    bindOfflineDocumentFlag: vi.fn(() => () => undefined),
    isBrowserOffline,
  };
});

const mountGameById = vi.fn(async () => undefined);
const initGameMountDeps = vi.fn();
vi.mock('../../src/ui/game-route-mounts', () => ({
  initGameMountDeps,
  mountGameById,
}));

const renderStatsDashboard = vi.fn((container: HTMLElement) => {
  container.innerHTML = '<div data-testid="stats">stats</div>';
});
vi.mock('../../src/ui/stats-dashboard', () => ({
  renderStatsDashboard,
}));

vi.mock('../../src/demos/dice-demo', () => ({
  renderDiceDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="dice"></div>';
  }),
}));
vi.mock('../../src/demos/alignment-demo', () => ({
  renderAlignmentDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="alignment"></div>';
  }),
}));
vi.mock('../../src/demos/fraction-demo', () => ({
  renderFractionDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="fractions"></div>';
  }),
}));
vi.mock('../../src/demos/polyomino-demo', () => ({
  renderPolyominoDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="polyomino"></div>';
  }),
}));
vi.mock('../../src/demos/graph-demo', () => ({
  renderGraphDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="graph"></div>';
  }),
}));
vi.mock('../../src/demos/attribute-demo', () => ({
  renderAttributeDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="attributes"></div>';
  }),
}));
vi.mock('../../src/demos/expression-demo', () => ({
  renderExpressionDemo: vi.fn((c: HTMLElement) => {
    c.innerHTML = '<div data-demo="expressions"></div>';
  }),
}));

const MAIN_SRC = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');

describe('q-mp-299 main.ts soft-fail / route residuals (source contract)', () => {
  it('keeps intentional console.error soft-fail diagnostic sites (no-console keep)', () => {
    // 1 missing-#app + 1 cleanup + 1 game-load + 7 demo-load = 10 keep-sites.
    const sites = [
      "console.error('[main] App container not found')",
      "console.error('[main] route cleanup failed', err)",
      'console.error(`Failed to load game ${gameId}`, err)',
      "console.error('Failed to load demo', err)",
    ];
    for (const site of sites) {
      expect(MAIN_SRC).toContain(site);
    }
    expect(MAIN_SRC).not.toContain(
      "throw new Error('App container not found')"
    );
    const demoLoadLogs = MAIN_SRC.match(
      /console\.error\('Failed to load demo', err\)/g
    );
    expect(demoLoadLogs?.length).toBe(7);
    const allConsoleError = MAIN_SRC.match(/console\.error\(/g);
    expect(allConsoleError?.length).toBe(10);
  });

  it('keeps void fire-and-forget + navigate shorthand sites (void ×12 overlay)', () => {
    // Fire-and-forget async: stats + 7 demos + void mount() = 9.
    const voidAsync = MAIN_SRC.match(/void \(async \(\) =>/g)?.length ?? 0;
    const voidMount = MAIN_SRC.match(/void mount\(\);/g)?.length ?? 0;
    expect(voidAsync + voidMount).toBe(9);

    // Overlay confusing-void ×12: navigate('/') shorthands + renderGame/Home.
    const navigateShorthand =
      MAIN_SRC.match(/\(\) => navigate\('\/'\)/g)?.length ?? 0;
    const renderGameShorthand =
      MAIN_SRC.match(/\(\) => renderGame\(\)/g)?.length ?? 0;
    const renderHomeShorthand =
      MAIN_SRC.match(/\(\) => renderHome\(\)/g)?.length ?? 0;
    expect(navigateShorthand + renderGameShorthand + renderHomeShorthand).toBe(
      12
    );

    // Bootstrap remains gated on soft-fail host presence.
    expect(MAIN_SRC).toMatch(/if \(appContainer\) \{\s*\/\/ Set up routes/);
  });
});

describe('q-mp-299 main.ts soft-fail / route residuals (runtime)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.location.hash = '';
    mountGameById.mockReset();
    initGameMountDeps.mockReset();
    mountGameById.mockResolvedValue(undefined);
    renderStatsDashboard.mockReset();
    renderStatsDashboard.mockImplementation((container: HTMLElement) => {
      container.innerHTML = '<div data-testid="stats">stats</div>';
    });
    // Default: wire setCleanup only when a test needs a custom cleanup.
    initGameMountDeps.mockImplementation(() => undefined);
    bootstrapPwa.mockClear();
    bootstrapOwl.mockClear();
    scheduleIdleGameWarm.mockClear();
    isBrowserOffline.mockReturnValue(false);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('soft-fails missing #app: diagnostic log and bootstrap never arms routes', async () => {
    document.body.innerHTML = '';
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(import('../../src/main')).resolves.toBeDefined();

    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[main] App container not found')
      )
    ).toBe(true);
    expect(bootstrapPwa).not.toHaveBeenCalled();
    expect(bootstrapOwl).not.toHaveBeenCalled();
    expect(scheduleIdleGameWarm).not.toHaveBeenCalled();

    // Module loaded without throwing; hash changes must not mount games.
    window.location.hash = '#/game/hex';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(mountGameById).not.toHaveBeenCalled();
    expect(initGameMountDeps).not.toHaveBeenCalled();
  });

  it('soft-fails throwing route cleanup: logs diagnostic and still reaches next route', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    initGameMountDeps.mockImplementation(
      (deps: { setCleanup: (fn: (() => void) | null) => void }) => {
        deps.setCleanup(() => {
          throw new Error('cleanup blew up');
        });
      }
    );

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');

    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(initGameMountDeps).toHaveBeenCalled();
    });

    // Navigate away — cleanup throws but home must still render.
    window.location.hash = '#/';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[main] route cleanup failed')
      )
    ).toBe(true);
  });

  it('stats chunk reject soft-fails to load-error UI (no throw)', async () => {
    renderStatsDashboard.mockImplementation(() => {
      throw new Error('stats chunk boom');
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/stats';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });
    expect(document.querySelector('[data-action="retry"]')).toBeTruthy();
    expect(document.querySelector('[data-action="home"]')).toBeTruthy();

    // Exercise load-error onHome void shorthand for stats.
    document.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });
    errSpy.mockRestore();
  });

  it('stale routeGen after stats reject aborts load-error paint', async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    renderStatsDashboard.mockImplementation(async () => {
      await gate;
      throw new Error('late stats fail');
    });

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');

    window.location.hash = '#/stats';
    handleRoute();
    // Leave before stats settles — bumps route generation.
    window.location.hash = '#/';
    handleRoute();
    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });

    release();
    await Promise.resolve();
    await Promise.resolve();
    expect(
      document.querySelector('[data-testid="game-load-error"]')
    ).toBeNull();
    errSpy.mockRestore();
  });

  it('stale routeGen after demo reject aborts load-error paint', async () => {
    const dice = await import('../../src/demos/dice-demo');
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    vi.mocked(dice.renderDiceDemo).mockImplementation(async () => {
      await gate;
      throw new Error('late demo fail');
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/demo/dice';
    handleRoute();

    window.location.hash = '#/';
    handleRoute();
    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });

    release();
    await Promise.resolve();
    await Promise.resolve();
    expect(
      document.querySelector('[data-testid="game-load-error"]')
    ).toBeNull();
    errSpy.mockRestore();
  });

  it('mountGameShell lazy path resolves via initGameMountDeps callback', async () => {
    let shellPromise: Promise<unknown> | null = null;
    initGameMountDeps.mockImplementation(
      (deps: {
        mountGameShell: (
          c: HTMLElement,
          o: Record<string, unknown>
        ) => Promise<unknown>;
        container: HTMLElement;
      }) => {
        shellPromise = deps.mountGameShell(deps.container, {
          title: 'probe',
          helpTitle: 'h',
          helpContentHtml: '<p>x</p>',
          modeRadioName: 'q299-shell',
          onNavigateHome: () => undefined,
          onStartGame: () => undefined,
        });
      }
    );

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();

    await vi.waitFor(() => {
      expect(initGameMountDeps).toHaveBeenCalled();
      expect(shellPromise).not.toBeNull();
    });
    const shell = (await shellPromise) as { cleanup?: () => void };
    expect(shell).toBeTruthy();
    expect(typeof shell.cleanup).toBe('function');
    shell.cleanup?.();
    errSpy.mockRestore();
  });

  it('game load reject: console diagnostic, disposes boundary, shows load-error', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountGameById.mockRejectedValue(new Error('chunk fail'));

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('Failed to load game')
      )
    ).toBe(true);
    // Load-error UI replaces crash boundary (no dual chrome).
    expect(
      document.querySelector('[data-testid="game-error-boundary"]')
    ).toBeNull();
  });

  it('game load reject while offline passes offline option into load-error hint', async () => {
    isBrowserOffline.mockReturnValue(true);
    mountGameById.mockRejectedValue(new Error('chunk fail'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });
    const hint = document.querySelector('[data-testid="game-load-error-hint"]');
    // Structural: offline branch uses a distinct hint (length / offline keyword
    // via helper — assert presence of hint node + offline mock was consulted).
    expect(hint).toBeTruthy();
    expect(isBrowserOffline).toHaveBeenCalled();
    expect(hint!.textContent?.length).toBeGreaterThan(0);
    errSpy.mockRestore();
  });

  it('load-error home action navigates to menu (void onHome shorthand)', async () => {
    mountGameById.mockRejectedValue(new Error('chunk fail'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });

    document.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();

    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });
    errSpy.mockRestore();
  });

  it('stale routeGen after game load reject aborts load-error paint', async () => {
    let rejectMount!: (err: Error) => void;
    mountGameById.mockImplementation(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectMount = reject;
        })
    );
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');

    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
    });

    // Leave the game route before the chunk settles — generation bumps.
    window.location.hash = '#/';
    handleRoute();
    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });

    rejectMount(new Error('late chunk fail'));
    // Give the rejected promise a turn; load-error must not clobber home.
    await Promise.resolve();
    await Promise.resolve();
    expect(
      document.querySelector('[data-testid="game-load-error"]')
    ).toBeNull();
    expect(
      document.querySelector('.game-selector, .division, h1, .game-card')
    ).toBeTruthy();
    errSpy.mockRestore();
  });

  it('demo load reject soft-fails with Failed to load demo diagnostic', async () => {
    const dice = await import('../../src/demos/dice-demo');
    vi.mocked(dice.renderDiceDemo).mockImplementation(() => {
      throw new Error('demo boom');
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/demo/dice';
    handleRoute();

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('Failed to load demo')
      )
    ).toBe(true);
    errSpy.mockRestore();
  });

  it('game-route crash with throwing onBeforeShow cleanup still shows boundary', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    initGameMountDeps.mockImplementation(
      (deps: { setCleanup: (fn: (() => void) | null) => void }) => {
        deps.setCleanup(() => {
          throw new Error('destroy blew up');
        });
      }
    );
    mountGameById.mockResolvedValue(undefined);

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(initGameMountDeps).toHaveBeenCalled();
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('in-game boom'),
        message: 'in-game boom',
      })
    );

    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-testid="game-error-boundary"]')
      ).toBeTruthy();
    });
    // Structural: reset + home actions present (no copy pin on labels).
    expect(document.querySelector('[data-action="reset"]')).toBeTruthy();
    expect(document.querySelector('[data-action="home"]')).toBeTruthy();
    errSpy.mockRestore();
  });

  it('replacing route boundary disposes prior handle when navigating home → game', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');

    // Arm home boundary, then leave for a game (bindRouteErrorBoundary replace).
    window.location.hash = '#/';
    handleRoute();
    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });

    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
    });

    // Crash on game route — only one boundary chrome.
    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('game boom'),
        message: 'game boom',
      })
    );
    await vi.waitFor(() => {
      expect(
        document.querySelectorAll('[data-testid="game-error-boundary"]').length
      ).toBe(1);
    });
    errSpy.mockRestore();
  });
});
