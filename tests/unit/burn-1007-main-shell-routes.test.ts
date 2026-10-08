/**
 * burn-1007 — main.ts shell routing / cleanup / lazy-load error paths.
 * Isolated: mocks PWA virtual module + heavy demos / mounts.
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
vi.mock('../../src/ui/offline', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/ui/offline')>();
  return {
    ...actual,
    bindOfflineDocumentFlag: vi.fn(() => () => undefined),
    isBrowserOffline: vi.fn(() => false),
  };
});

const mountGameById = vi.fn(async () => undefined);
const initGameMountDeps = vi.fn();
vi.mock('../../src/ui/game-route-mounts', () => ({
  initGameMountDeps,
  mountGameById,
}));

vi.mock('../../src/ui/stats-dashboard', () => ({
  renderStatsDashboard: vi.fn((container: HTMLElement) => {
    container.innerHTML = '<div data-testid="stats">stats</div>';
  }),
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

describe('burn-1007 main shell routes', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.location.hash = '';
    mountGameById.mockClear();
    initGameMountDeps.mockClear();
    mountGameById.mockResolvedValue(undefined);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  async function go(hash: string): Promise<void> {
    // Assign hash then fire exactly one hashchange (jsdom may not emit it).
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  it('boots home, navigates to game / stats / demos, and remounts', async () => {
    await import('../../src/main');
    const app = document.getElementById('app')!;

    // Home route from initRouter
    await vi.waitFor(() => {
      expect(app.querySelector('.game-selector, .division, h1, .game-card')).toBeTruthy();
    });

    await go('#/stats');
    await vi.waitFor(() => {
      expect(app.querySelector('[data-testid="stats"]')).toBeTruthy();
    });

    await go('#/game/hex');
    await vi.waitFor(() => {
      expect(initGameMountDeps).toHaveBeenCalled();
      expect(mountGameById).toHaveBeenCalled();
    });
    expect(document.title).toMatch(/Hex/);

    await go('#/demo/dice');
    await vi.waitFor(() => {
      expect(app.querySelector('[data-demo="dice"]')).toBeTruthy();
    });

    for (const [hash, attr] of [
      ['#/demo/alignment', 'alignment'],
      ['#/demo/fractions', 'fractions'],
      ['#/demo/polyomino', 'polyomino'],
      ['#/demo/graph', 'graph'],
      ['#/demo/attributes', 'attributes'],
      ['#/demo/expressions', 'expressions'],
    ] as const) {
      await go(hash);
      await vi.waitFor(() => {
        expect(app.querySelector(`[data-demo="${attr}"]`)).toBeTruthy();
      });
    }

    // Unknown / unavailable game redirects home
    await go('#/game/not-available-zzz');
    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });

    // Unknown hash path (not /game/:id) also recovers to menu via notFound.
    await go('#/game/hex');
    await vi.waitFor(() => {
      expect(mountGameById).toHaveBeenCalled();
    });
    await go('#/totally-unknown-route');
    await vi.waitFor(() => {
      expect(window.location.hash === '#/' || window.location.hash === '').toBe(
        true
      );
    });
  });

  it('shows load-error UI when game mount rejects', async () => {
    mountGameById.mockRejectedValue(new Error('chunk fail'));
    await import('../../src/main');

    // Call the game route handler once via hash without a double-fire race.
    window.location.hash = '#/game/hex';
    const { handleRoute } = await import('../../src/core/router');
    handleRoute();

    await vi.waitFor(
      () => {
        expect(
          document.querySelector('[data-testid="game-load-error"]')
        ).toBeTruthy();
      },
      { timeout: 5_000 }
    );
  });

  it('resolveAIDifficulty defaults to medium and retry reloads the page', async () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        hash: window.location.hash,
        reload,
        assign: window.location.assign.bind(window.location),
        replace: window.location.replace.bind(window.location),
      },
    });

    initGameMountDeps.mockImplementation(
      (deps: {
        resolveAIDifficulty: (d?: 'easy' | 'medium' | 'hard') => string;
      }) => {
        expect(deps.resolveAIDifficulty()).toBe('medium');
        expect(deps.resolveAIDifficulty('hard')).toBe('hard');
        expect(deps.resolveAIDifficulty('easy')).toBe('easy');
      }
    );

    mountGameById.mockRejectedValue(new Error('chunk fail'));
    await import('../../src/main');
    window.location.hash = '#/game/hex';
    const { handleRoute } = await import('../../src/core/router');
    handleRoute();

    await vi.waitFor(() => {
      expect(initGameMountDeps).toHaveBeenCalled();
      expect(
        document.querySelector('[data-testid="game-load-error"]')
      ).toBeTruthy();
    });

    document
      .querySelector<HTMLButtonElement>('[data-action="retry"]')
      ?.click();
    expect(reload).toHaveBeenCalled();
  });

  it('demo load failures render load-error UI for each demo route', async () => {
    const demos = await Promise.all([
      import('../../src/demos/dice-demo'),
      import('../../src/demos/alignment-demo'),
      import('../../src/demos/fraction-demo'),
      import('../../src/demos/polyomino-demo'),
      import('../../src/demos/graph-demo'),
      import('../../src/demos/attribute-demo'),
      import('../../src/demos/expression-demo'),
    ]);

    for (const mod of demos) {
      const fn = Object.values(mod)[0] as ReturnType<typeof vi.fn>;
      vi.mocked(fn).mockImplementation(() => {
        throw new Error('demo boom');
      });
    }

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await import('../../src/main');
    const { handleRoute } = await import('../../src/core/router');

    for (const hash of [
      '#/demo/dice',
      '#/demo/alignment',
      '#/demo/fractions',
      '#/demo/polyomino',
      '#/demo/graph',
      '#/demo/attributes',
      '#/demo/expressions',
    ]) {
      window.location.hash = hash;
      handleRoute();
      await vi.waitFor(() => {
        expect(
          document.querySelector('[data-testid="game-load-error"]')
        ).toBeTruthy();
      });
    }

    errSpy.mockRestore();
  });

  it('throws when #app is missing at boot', async () => {
    document.body.innerHTML = '';
    await expect(import('../../src/main')).rejects.toThrow(
      /App container not found/
    );
  });
});
