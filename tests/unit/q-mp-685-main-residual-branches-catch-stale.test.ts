/**
 * q-mp-1212 shard of q-mp-685 main.ts residual branches (tests-only).
 * Family: catch-stale / success-stale (stats + demos).
 *
 * Isolated: hoisted PWA/demo mocks must not leak into unit-shared.
 */
import { describe, expect, it, vi } from 'vitest';

import {
  DEMO_ROUTES,
  NON_DICE_DEMOS,
  installMainResidualHooks,
} from './q-mp-685-main-residual-branches.shared';

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

describe('q-mp-685 main.ts residual branches', () => {
  installMainResidualHooks({
    mountGameById,
    initGameMountDeps,
    renderStatsDashboard,
    isBrowserOffline,
    installGameErrorBoundary,
    boundaryState,
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
});
