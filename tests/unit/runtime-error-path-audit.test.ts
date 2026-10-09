/**
 * burn-1008-mp-runtime-error-path-audit — behavior pins for runtime error paths.
 *
 * From #563 pins; #567 recovered R-GL-08 P0 (Prime Gold context-lost → 2D);
 * #568 un-skips P1 R-SHELL-07/08 + P2 R-IMP-04/R-SW-01 (cleanup try/finally +
 * bootstrap/SW catch). q-mp-108 un-skips P3 R-SHELL-01 (#app soft-fail).
 * q-mp-107 un-skips P2 R-SHELL-04 (home/menu boundary).
 * Remaining P3 skips stay for their owners.
 *
 * Skips inventory already covered by folded drafts:
 * - #528 storage failure modes (safe-web-storage)
 * - #480 destroyGame wiring presence
 * - #479 idle-warm / offline soft-nav
 *
 * See docs/dev/runtime-error-path-audit.md for the full site table.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';
import { renderGameLoadError } from '../../src/ui/game-loading';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';
import { safeParseJson } from '../../src/core/safe-web-storage';

const root = join(import.meta.dirname, '../..');

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), 'utf8');
}

describe('runtime-error-path-audit — recovered pins', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('R-SHELL-03: onBeforeShow throw is swallowed so crash UI still shows', () => {
    const rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container: rootEl,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow: () => {
        throw new Error('destroy blew up');
      },
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('in-game boom'),
        message: 'in-game boom',
      })
    );

    expect(
      rootEl.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(handle.didCatch).toBe(true);
    handle.dispose();
    errSpy.mockRestore();
  });

  it('R-SHELL-03: unhandledrejection while boundary active shows crash UI', () => {
    const rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const handle = installGameErrorBoundary({
      gameName: 'Calla',
      container: rootEl,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });

    window.dispatchEvent(
      new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(),
        reason: new Error('async handler fail'),
      })
    );

    expect(
      rootEl.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    handle.dispose();
    errSpy.mockRestore();
  });

  it('R-SHELL-05 / R-EVT-04: load-error UI exposes retry + home actions', () => {
    const rootEl = document.createElement('div');
    const onRetry = vi.fn();
    const onHome = vi.fn();
    renderGameLoadError(rootEl, 'Hex', onRetry, onHome, { offline: false });

    expect(rootEl.querySelector('[data-testid="game-load-error"]')).not.toBeNull();
    rootEl.querySelector<HTMLButtonElement>('[data-action="retry"]')?.click();
    rootEl.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('R-SW-02: registerPwa skips when disabled (no throw)', () => {
    const registerSW = vi.fn();
    const result = registerPwa({ enabled: false, registerSW });
    expect(registerSW).not.toHaveBeenCalled();
    expect(result.update).toBeUndefined();
  });

  it('R-JSON-01: safeParseJson soft-fails on garbage (cite #528)', () => {
    // Thin re-pin of #528 wrapper — full storage matrix lives in safe-web-storage*.test.ts
    expect(safeParseJson('{not-json').ok).toBe(false);
    expect(safeParseJson(null).ok).toBe(false);
    expect(safeParseJson('{"a":1}').ok).toBe(true);
  });

  it('R-IMP-02: prefetch catch clears started mark (source contract)', () => {
    const src = readSrc('src/ui/game-prefetch.ts');
    expect(src).toMatch(/void load\(\)\.catch\(\(\) => \{/);
    expect(src).toMatch(/started\.delete\(gameId\)/);
  });

  it('R-IMP-03: idle-warm soft-fails warm imports (cite #479, source contract)', () => {
    const src = readSrc('src/pwa/idle-warm.ts');
    expect(src).toContain('await importShell()');
    expect(src).toMatch(/catch \{\s*\/\/ Shell warm is best-effort/);
    expect(src).toMatch(/catch \{\s*\/\/ Warm is best-effort/);
  });

  it('R-SHELL-05: main renderGame catch renders load-error (source contract)', () => {
    const src = readSrc('src/main.ts');
    expect(src).toContain('renderGameLoadError');
    expect(src).toContain('retryLazyChunkLoad');
    expect(src).toContain('Failed to load game');
  });

  it('R-GL recovered pattern: kings/fiar/kwatro/prime-gold dispatch mp3d-context-lost', () => {
    for (const rel of [
      'src/ui/three/kings-quadraphages-board-3d.ts',
      'src/ui/three/fiar-board-3d.ts',
      'src/ui/three/kwatro-sinko-board-3d.ts',
      'src/ui/three/queens-guards-board-3d.ts',
      'src/ui/three/pent-em-in-board-3d.ts',
      'src/ui/three/prime-gold-board-3d.ts',
    ]) {
      const src = readSrc(rel);
      expect(src).toContain("addEventListener('webglcontextlost'");
      expect(src).toContain("CustomEvent('mp3d-context-lost')");
    }
  });

  it('R-GL-06/07: hex-a-gone / star-track use callback notify (not CustomEvent)', () => {
    const hex = readSrc('src/ui/three/hex-a-gone-board-3d.ts');
    const star = readSrc('src/ui/three/star-track-board-3d.ts');
    expect(hex).toContain('onWebglLost?.()');
    expect(star).toMatch(/onContextLost\?\.\(\)|onLost/);
    expect(hex).toContain("addEventListener('webglcontextlost'");
    expect(star).toContain("addEventListener('webglcontextlost'");
  });
});

describe('runtime-error-path-audit — remaining unrecovered pins', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('R-SW-03 CURRENT: registration.update is fire-and-forget (void, no catch)', () => {
    const src = readSrc('src/pwa/register.ts');
    expect(src).toMatch(/void registration\.update\(\)/);
    expect(src).not.toMatch(/registration\.update\(\)\.catch/);
  });

  it('P3 R-SHELL-01: missing #app soft-fails with console diagnostic (no hard throw)', () => {
    const src = readSrc('src/main.ts');
    expect(src).toContain("getElementById('app')");
    expect(src).toContain("console.error('[main] App container not found')");
    expect(src).not.toContain("throw new Error('App container not found')");
  });
});

describe('runtime-error-path-audit — P0/P1/P2 fixed pins', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('P0 R-GL-08: Prime Gold webglcontextlost notifies controller and falls back to 2D', () => {
    const board = readSrc('src/ui/three/prime-gold-board-3d.ts');
    expect(board).toContain("addEventListener('webglcontextlost'");
    expect(board).toContain("CustomEvent('mp3d-context-lost')");
    expect(board).not.toContain('onWebglLost');

    const controller = readSrc('src/games/prime-gold/game-controller.ts');
    expect(controller).toContain("addEventListener('mp3d-context-lost'");
    expect(controller).toContain(
      "markBoard3dWebGlFallback(boardHostEl, 'context-lost')"
    );
    expect(controller).toContain('onBoard3dContextLost');
  });

  it('P1 R-SHELL-07: setGameRouteCleanup try/finally runs shell.cleanup when destroy throws', () => {
    const src = readSrc('src/ui/game-route-mounts.ts');
    expect(src).toMatch(
      /setCurrentCleanup\(\(\) => \{\s*try \{\s*destroyGame\(\);\s*\} finally \{\s*shell\.cleanup\(\);/
    );

    // Listener return-to-baseline: shell keydown unbound even when destroy throws.
    const probe = vi.fn();
    document.addEventListener('keydown', probe);

    let boundKeydown: ((e: KeyboardEvent) => void) | null = vi.fn();
    document.addEventListener('keydown', boundKeydown!);
    const shellCleanup = vi.fn(() => {
      if (boundKeydown) {
        document.removeEventListener('keydown', boundKeydown);
        boundKeydown = null;
      }
    });
    const destroyGame = vi.fn(() => {
      throw new Error('destroy failed');
    });

    // Local replica of FIXED setGameRouteCleanup wrapper semantics.
    const cleanup = () => {
      try {
        destroyGame();
      } finally {
        shellCleanup();
      }
    };

    expect(() => cleanup()).toThrow(/destroy failed/);
    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(boundKeydown).toBeNull();

    probe.mockClear();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    // Only the baseline probe remains — shell listener is gone.
    expect(probe).toHaveBeenCalledOnce();
    document.removeEventListener('keydown', probe);
  });

  it('P1 R-SHELL-08: init*Game throw still shell.cleanup (cleanup registered first)', () => {
    const src = readSrc('src/ui/game-route-mounts.ts');
    expect(src).toContain('function initGameWithRouteCleanup');
    const helperIdx = src.indexOf('function initGameWithRouteCleanup');
    const setIdx = src.indexOf(
      'setGameRouteCleanup(destroyGame, shell)',
      helperIdx
    );
    const initCallIdx = src.indexOf('init();', helperIdx);
    expect(setIdx).toBeGreaterThan(helperIdx);
    expect(initCallIdx).toBeGreaterThan(setIdx);

    // KQ sample: init runs inside initGameWithRouteCleanup callback.
    const kqWrap = src.indexOf('initGameWithRouteCleanup(destroyKQGame');
    const kqInit = src.indexOf('initKQGame(', kqWrap);
    expect(kqWrap).toBeGreaterThan(-1);
    expect(kqInit).toBeGreaterThan(kqWrap);

    const shellCleanup = vi.fn();
    const destroyGame = vi.fn();
    let currentCleanup: (() => void) | null = null;
    const setCurrentCleanup = (fn: (() => void) | null) => {
      currentCleanup = fn;
    };
    const setGameRouteCleanup = (
      destroy: () => void,
      shell: { cleanup: () => void }
    ) => {
      setCurrentCleanup(() => {
        try {
          destroy();
        } finally {
          shell.cleanup();
        }
      });
    };
    const initGameWithRouteCleanup = (
      destroy: () => void,
      shell: { cleanup: () => void },
      init: () => void
    ) => {
      setGameRouteCleanup(destroy, shell);
      try {
        init();
      } catch (err) {
        try {
          destroy();
        } catch {
          // Destroy during aborted init is best-effort.
        }
        shell.cleanup();
        setCurrentCleanup(null);
        throw err;
      }
    };

    const shell = { cleanup: shellCleanup };
    const boom = new Error('init failed');
    expect(() =>
      initGameWithRouteCleanup(destroyGame, shell, () => {
        throw boom;
      })
    ).toThrow(boom);
    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(destroyGame).toHaveBeenCalledOnce();
    expect(currentCleanup).toBeNull();

    // Destroy throw during aborted init must not mask the original init error.
    shellCleanup.mockClear();
    destroyGame.mockImplementation(() => {
      throw new Error('destroy failed');
    });
    expect(() =>
      initGameWithRouteCleanup(destroyGame, shell, () => {
        throw boom;
      })
    ).toThrow(boom);
    expect(shellCleanup).toHaveBeenCalledOnce();
  });

  it('P2 R-IMP-04: bootstrapOwl catches import/init failures (no unhandledrejection)', async () => {
    const src = readSrc('src/pwa/bootstrap-owl.ts');
    expect(src).toMatch(/catch \(err\)/);
    expect(src).toContain("console.error('[bootstrap-owl] init failed'");

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const schedule = vi.fn((cb: () => void) => cb());
    const fail = new Error('owl chunk missing');
    bootstrapOwl({
      schedule,
      enabled: true,
      importOwl: async () => {
        throw fail;
      },
      importOwlUi: async () => ({ owlComponent: { init: vi.fn() } }) as never,
    });

    await vi.waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });
    expect(errSpy.mock.calls.some((c) => String(c[0]).includes('bootstrap-owl'))).toBe(
      true
    );
    // Allow microtasks to flush; rejection must not escape.
    await Promise.resolve();
    await Promise.resolve();
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
    errSpy.mockRestore();
  });

  it('P2 R-SW-01: registerPwa guards registerSW throws (soft-fail + log)', () => {
    const src = readSrc('src/pwa/register.ts');
    expect(src).toContain("console.error('[pwa] service worker registration failed'");

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const registerSW = vi.fn(() => {
      throw new Error('SW registration failed');
    });
    const result = registerPwa({
      enabled: true,
      registerSW,
      reload: vi.fn(),
    });
    expect(result.update).toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
    expect(
      errSpy.mock.calls.some((c) => String(c[0]).includes('[pwa]'))
    ).toBe(true);
    errSpy.mockRestore();
  });

  it('P2 R-SHELL-04 / R-EVT-03: home/menu installs same crash boundary as game routes', () => {
    const src = readSrc('src/main.ts');
    // renderHome binds the shared route boundary before the selector mounts.
    const homeIdx = src.indexOf('function renderHome');
    expect(homeIdx).toBeGreaterThan(-1);
    const bindIdx = src.indexOf('bindRouteErrorBoundary', homeIdx);
    const selectorIdx = src.indexOf('renderGameSelector', homeIdx);
    expect(bindIdx).toBeGreaterThan(homeIdx);
    expect(selectorIdx).toBeGreaterThan(bindIdx);
    // Reuses existing crash UI (installGameErrorBoundary → renderGameCrash).
    expect(src).toContain('installGameErrorBoundary');

    // Behavioral: thrown handler while home boundary active → recoverable UI.
    const rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onReset = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Math Pentathlon',
      container: rootEl,
      onReset,
      onHome: vi.fn(),
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('menu activate boom'),
        message: 'menu activate boom',
      })
    );

    expect(
      rootEl.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(handle.didCatch).toBe(true);
    // Existing crash strings only — no new player-facing copy.
    expect(rootEl.textContent).toContain('Something went wrong in Math Pentathlon');
    expect(rootEl.textContent).toContain('Try again');
    expect(rootEl.textContent).toContain('Back to games');
    rootEl.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    expect(onReset).toHaveBeenCalledOnce();
    handle.dispose();
    errSpy.mockRestore();
  });
});

describe('runtime-error-path-audit — expected fixes (todo / skip)', () => {
  it.skip('TODO(runtime-error-path P3 R-SW-03): registration.update() rejection should be swallowed/logged', () => {
    // Expected: void registration.update().catch(...) or equivalent.
    expect(true).toBe(false);
  });

  it.skip('TODO(runtime-error-path P3 R-JSON-04): gameStateFromJSON should soft-fail if ever bound to UI', () => {
    // Dormant thrower today (tests only). Harden before wiring to player UI.
    expect(true).toBe(false);
  });
});

describe('runtime-error-path-audit — crash UI copy contract (no new player text)', () => {
  it('renderGameCrash keeps existing boundary strings (characterization)', () => {
    const rootEl = document.createElement('div');
    renderGameCrash(rootEl, 'Hex', vi.fn(), vi.fn());
    expect(rootEl.textContent).toContain('Something went wrong in Hex');
    expect(rootEl.textContent).toContain('Try again');
    expect(rootEl.textContent).toContain('Back to games');
  });
});
