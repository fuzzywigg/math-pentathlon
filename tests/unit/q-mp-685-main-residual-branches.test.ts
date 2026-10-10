/**
 * q-mp-685 — Close `src/main.ts` residual gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ 890a9e3f):
 *   isolated main suites (`burn-1007-main-shell-routes` + `q-mp-299-main-soft-fail`):
 *     **87.25%** lines (178/204) / **69.64%** branches (39/56)
 *   Uncovered clusters: catch-stale returns (stats + 7 demos), demo
 *     success-stale (non-dice), load-error / crash onHome+onReset
 *     shorthands, gameId-undefined guard, defensive activeBoundary skip.
 *
 * Ownership: leave main void HOLD + `#1006`-era soft-fail with **contained**
 * (this ticket is residual coverage, not void-ceiling / product). Zero `src/`
 * edits; no copy / aria / label pins; no ratchet JSON; no AI / rules /
 * scoring; Hex Hard 450ms untouched; no network.
 *
 * Isolated: hoisted PWA/demo mocks must not leak into unit-shared.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn(() => vi.fn()),
}));

vi.mock('../../src/pwa/bootstrap', () => ({
  bootstrapPwa: vi.fn(),
}));
vi.mock('../../src/pwa/bootstrap-owl', () => ({
  bootstrapOwl: vi.fn(),
}));
vi.mock('../../src/pwa/idle-warm', () => ({
  scheduleIdleGameWarm: vi.fn(),
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

const { installGameErrorBoundary, boundaryState } = vi.hoisted(() => {
  type InstallFn = typeof import('../../src/ui/game-error-boundary').installGameErrorBoundary;
  const boundaryState: { real: InstallFn | null } = { real: null };
  const installGameErrorBoundary = vi.fn(
    ((opts: Parameters<InstallFn>[0]) => {
      if (!boundaryState.real) {
        throw new Error('q-mp-685: real installGameErrorBoundary not armed');
      }
      return boundaryState.real(opts);
    }) as InstallFn
  );
  return { installGameErrorBoundary, boundaryState };
});

vi.mock('../../src/ui/game-error-boundary', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/ui/game-error-boundary')>();
  boundaryState.real = actual.installGameErrorBoundary;
  return {
    ...actual,
    installGameErrorBoundary,
  };
});

type DemoRoute = {
  hash: string;
  attr: string;
  load: () => Promise<ReturnType<typeof vi.fn>>;
};

const DEMO_ROUTES: DemoRoute[] = [
  {
    hash: '#/demo/dice',
    attr: 'dice',
    load: async () => {
      const m = await import('../../src/demos/dice-demo');
      return vi.mocked(m.renderDiceDemo);
    },
  },
  {
    hash: '#/demo/alignment',
    attr: 'alignment',
    load: async () => {
      const m = await import('../../src/demos/alignment-demo');
      return vi.mocked(m.renderAlignmentDemo);
    },
  },
  {
    hash: '#/demo/fractions',
    attr: 'fractions',
    load: async () => {
      const m = await import('../../src/demos/fraction-demo');
      return vi.mocked(m.renderFractionDemo);
    },
  },
  {
    hash: '#/demo/polyomino',
    attr: 'polyomino',
    load: async () => {
      const m = await import('../../src/demos/polyomino-demo');
      return vi.mocked(m.renderPolyominoDemo);
    },
  },
  {
    hash: '#/demo/graph',
    attr: 'graph',
    load: async () => {
      const m = await import('../../src/demos/graph-demo');
      return vi.mocked(m.renderGraphDemo);
    },
  },
  {
    hash: '#/demo/attributes',
    attr: 'attributes',
    load: async () => {
      const m = await import('../../src/demos/attribute-demo');
      return vi.mocked(m.renderAttributeDemo);
    },
  },
  {
    hash: '#/demo/expressions',
    attr: 'expressions',
    load: async () => {
      const m = await import('../../src/demos/expression-demo');
      return vi.mocked(m.renderExpressionDemo);
    },
  },
];

const NON_DICE_DEMOS = DEMO_ROUTES.filter((d) => d.attr !== 'dice');

describe('q-mp-685 main.ts residual branches', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.location.hash = '';
    mountGameById.mockReset();
    initGameMountDeps.mockReset();
    mountGameById.mockResolvedValue(undefined);
    initGameMountDeps.mockImplementation(() => undefined);
    renderStatsDashboard.mockReset();
    renderStatsDashboard.mockImplementation((container: HTMLElement) => {
      container.innerHTML = '<div data-testid="stats">stats</div>';
    });
    isBrowserOffline.mockReturnValue(false);
    installGameErrorBoundary.mockClear();
    installGameErrorBoundary.mockImplementation((opts) => {
      if (!boundaryState.real) {
        throw new Error('q-mp-685: real installGameErrorBoundary not armed');
      }
      return boundaryState.real(opts);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('stats catch-stale: bump during render aborts load-error paint', async () => {
    const { nextRouteGeneration } = await import(
      '../../src/core/route-generation'
    );
    renderStatsDashboard.mockImplementation(() => {
      nextRouteGeneration();
      throw new Error('stats boom after gen bump');
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/stats';
    handleRoute();

    await vi.waitFor(() => {
      expect(renderStatsDashboard).toHaveBeenCalled();
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(
      document.querySelector('[data-testid="game-load-error"]')
    ).toBeNull();
    errSpy.mockRestore();
  });

  it.each(DEMO_ROUTES)(
    'demo catch-stale ($attr): bump during render aborts load-error',
    async (demo) => {
      const { nextRouteGeneration } = await import(
        '../../src/core/route-generation'
      );
      const render = await demo.load();
      render.mockImplementation(() => {
        nextRouteGeneration();
        throw new Error(`${demo.attr} boom after gen bump`);
      });
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await import('../../src/main');
      const { handleRoute } = await import('../../src/core/router');
      window.location.hash = demo.hash;
      handleRoute();

      await vi.waitFor(() => {
        expect(render).toHaveBeenCalled();
      });
      await Promise.resolve();
      await Promise.resolve();
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeNull();
      expect(document.querySelector(`[data-demo="${demo.attr}"]`)).toBeNull();
      errSpy.mockRestore();
    }
  );

  it.each(NON_DICE_DEMOS)(
    'demo success-stale ($attr): gen bump before paint skips demo',
    async (demo) => {
      const { nextRouteGeneration } = await import(
        '../../src/core/route-generation'
      );
      await demo.load();
      await import('../../src/main');
      const { handleRoute } = await import('../../src/core/router');
      window.location.hash = demo.hash;
      handleRoute();
      // Same sync turn as the async IIFE's first await yield.
      nextRouteGeneration();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      expect(document.querySelector(`[data-demo="${demo.attr}"]`)).toBeNull();
    }
  );

  it.each(DEMO_ROUTES)(
    'demo load-error onHome ($attr): home action navigates to menu',
    async (demo) => {
      const render = await demo.load();
      render.mockImplementation(() => {
        throw new Error(`${demo.attr} load boom`);
      });
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await import('../../src/main');
      const { handleRoute } = await import('../../src/core/router');
      window.location.hash = demo.hash;
      handleRoute();

      await vi.waitFor(() => {
        expect(
          document.querySelector('[data-testid="game-load-error"]')
        ).toBeTruthy();
      });

      document
        .querySelector<HTMLButtonElement>('[data-action="home"]')
        ?.click();
      await vi.waitFor(() => {
        expect(
          window.location.hash === '#/' || window.location.hash === ''
        ).toBe(true);
      });
      errSpy.mockRestore();
    }
  );

  it('game crash onHome shorthand navigates to menu', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
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

    document.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });
    errSpy.mockRestore();
  });

  it('game crash onReset shorthand remounts via renderGame', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
    });
    const mountsBefore = mountGameById.mock.calls.length;

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

    document.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    await vi.waitFor(() => {
      expect(mountGameById.mock.calls.length).toBeGreaterThan(mountsBefore);
    });
    errSpy.mockRestore();
  });

  it('renderGame with missing gameId param navigates home (guard)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');
    window.location.hash = '#/game/hex';
    handleRoute();
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
    });
    const mountsBeforeCrash = mountGameById.mock.calls.length;

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

    // Non-game hash without running the router — reset still invokes
    // renderGame(), which hits the undefined-id guard and navigate('/').
    // Use a non-`/` hash so navigate('/') is not a no-op.
    window.location.hash = '#/not-a-game-route';
    document.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();

    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });
    // Guard short-circuits before mountGameById (no remount).
    expect(mountGameById.mock.calls.length).toBe(mountsBeforeCrash);
    // jsdom may not emit hashchange from navigate(); fire it to complete
    // the menu paint the production hashchange listener would run.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await vi.waitFor(() => {
      expect(
        document.querySelector('.game-selector, .division, h1, .game-card')
      ).toBeTruthy();
    });
    errSpy.mockRestore();
  });

  it('game load reject with null boundary skips dispose arm (defensive)', async () => {
    installGameErrorBoundary.mockImplementation(() => null as never);
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
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('Failed to load game')
      )
    ).toBe(true);
    errSpy.mockRestore();
  });
});
