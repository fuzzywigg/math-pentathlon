/**
 * q-mp-1212 shard of q-mp-685 main.ts residual branches (tests-only).
 * Family: game crash onHome/onReset + missing gameId guard + null boundary.
 *
 * Isolated: hoisted PWA/demo mocks must not leak into unit-shared.
 */
import { describe, expect, it, vi } from 'vitest';

import { installMainResidualHooks } from './q-mp-685-main-residual-branches.shared';

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
