/**
 * burn-1008-mp-ui-coverage-round-2 — characterization for shared UI/shell helpers
 * that remain below tip peers: load-three, coord-map edges, offline, error boundary,
 * settings/feature flags, dom-security, sanitize, pointer lost-capture.
 * Tests-only; pins current behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadThree } from '../../src/ui/three/load-three';
import {
  clientToSvgUser,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';
import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';
import {
  getUserReducedMotionFlag,
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';
import { isBoard3dEnabled } from '../../src/core/feature-flags';
import {
  escapeHtml,
  safeHtml,
  setTrustedMarkup,
} from '../../src/core/dom-security';
import {
  sanitizeAchievements,
  sanitizeDisplayString,
  sanitizeDisplayStringAllowEmpty,
  sanitizeGameStatsMap,
  sanitizeProfile,
} from '../../src/core/storage/sanitize';
import {
  bindCanvasPointerTap,
  bindPrimaryPointerActivate,
  createPointerTapController,
} from '../../src/ui/pointer-hygiene';

describe('burn-1008 ui-cov-r2 load-three', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('dynamically imports the three module', async () => {
    const three = await loadThree();
    expect(three).toBeTruthy();
    expect(typeof three).toBe('object');
  });
});

describe('burn-1008 ui-cov-r2 coord-map edges', () => {
  it('uses scale 1 when viewBox or rect dimension is non-positive', () => {
    const p = clientToSvgUser(
      10,
      20,
      { left: 0, top: 0, width: 0, height: 0 },
      0,
      0
    );
    expect(p).toEqual({ x: 10, y: 20 });
  });

  it('svgUserToGridCell returns null for non-positive cellSize', () => {
    expect(svgUserToGridCell(10, 10, 0, 0)).toBeNull();
    expect(svgUserToGridCell(10, 10, -4, 0)).toBeNull();
  });

  it('resolveCanvas2dPixelRatio treats NaN dpr/cap as safe defaults', () => {
    expect(resolveCanvas2dPixelRatio(Number.NaN)).toBe(1);
    expect(resolveCanvas2dPixelRatio(3, Number.NaN)).toBe(2);
    expect(resolveCanvas2dPixelRatio(3, 0)).toBe(2);
    expect(resolveCanvas2dPixelRatio(3, -1)).toBe(2);
  });
});

describe('burn-1008 ui-cov-r2 offline helpers', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-offline');
    vi.restoreAllMocks();
  });

  it('isBrowserOffline reflects navigator.onLine', () => {
    const desc = Object.getOwnPropertyDescriptor(navigator, 'onLine');
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    expect(isBrowserOffline()).toBe(true);
    expect(gameLoadErrorHint()).toMatch(/offline/i);
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    expect(isBrowserOffline()).toBe(false);
    expect(gameLoadErrorHint(false)).toMatch(/connection/i);
    if (desc) Object.defineProperty(navigator, 'onLine', desc);
  });

  it('bindOfflineDocumentFlag syncs data-offline and unsubscribes', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    const unbind = bindOfflineDocumentFlag();
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    window.dispatchEvent(new Event('online'));
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);

    unbind();
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    window.dispatchEvent(new Event('offline'));
    // Unsubscribed — attribute should stay cleared from last sync
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);
  });
});

describe('burn-1008 ui-cov-r2 game-error-boundary edges', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('ignores resource ErrorEvents without error object', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });

    window.dispatchEvent(
      new ErrorEvent('error', { message: 'img fail' /* no error */ })
    );
    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(handle.didCatch).toBe(false);
    handle.dispose();
  });

  it('swallows onBeforeShow throws and still renders crash UI once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handle = installGameErrorBoundary({
      gameName: 'Calla',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow: () => {
        throw new Error('cleanup boom');
      },
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('runtime'),
        message: 'runtime',
      })
    );
    expect(
      root.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(handle.didCatch).toBe(true);
    // Listeners removed after catch — a second install is required to catch again.
    expect(root.querySelectorAll('[data-testid="game-error-boundary"]').length).toBe(
      1
    );
    handle.dispose();
    errSpy.mockRestore();
  });

  it('disposed boundary is inert; renderGameCrash still works standalone', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const handle = installGameErrorBoundary({
      gameName: 'FIAR',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });
    handle.dispose();
    expect(handle.didCatch).toBe(false);
    expect(root.querySelector('[data-testid="game-error-boundary"]')).toBeNull();
    renderGameCrash(root, 'FIAR', vi.fn(), vi.fn());
    expect(root.querySelector('[data-action="reset"]')).toBeTruthy();
  });
});

describe('burn-1008 ui-cov-r2 settings + feature flags', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  afterEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
  });

  it('peekReducedMotion rejects arrays / non-objects / missing settings', () => {
    localStorage.setItem('math-pentathlon-progress', JSON.stringify([1, 2]));
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem('math-pentathlon-progress', JSON.stringify('nope'));
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      'math-pentathlon-progress',
      JSON.stringify({ settings: null })
    );
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      'math-pentathlon-progress',
      JSON.stringify({ settings: [] })
    );
    expect(getUserReducedMotionFlag()).toBe(false);

    resetSettingsFlagsForTests();
    localStorage.setItem(
      'math-pentathlon-progress',
      JSON.stringify({ settings: { reducedMotion: true } })
    );
    expect(getUserReducedMotionFlag()).toBe(true);
    setUserReducedMotionFlag(false);
    expect(getUserReducedMotionFlag()).toBe(false);
  });

  it('isBoard3dEnabled reads hash/search allowlist tokens', () => {
    expect(isBoard3dEnabled('?board3d=1', null, '')).toBe(true);
    expect(isBoard3dEnabled('', null, '#/game/hex?board3d=true')).toBe(true);
    expect(isBoard3dEnabled('?board3d=0', null, '')).toBe(false);
    expect(isBoard3dEnabled('?board3d=yes-please', null, '')).toBe(false);
  });
});

describe('burn-1008 ui-cov-r2 dom-security + sanitize edges', () => {
  it('escapeHtml / safeHtml / setTrustedMarkup edge branches', () => {
    expect(escapeHtml(`a&b<c>"'`)).toContain('&amp;');
    const frag = safeHtml`<p>${null}${undefined}${document.createTextNode('x')}${5}</p>`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);
    expect(wrap.textContent).toContain('x');
    expect(wrap.textContent).toContain('5');

    setTrustedMarkup(wrap, '<!--c--><script>bad()</script><p>ok<em>1</em></p>');
    expect(wrap.querySelector('script')).toBeNull();
    expect(wrap.querySelector('p')).toBeTruthy();
    expect(wrap.textContent).toContain('ok');
  });

  it('sanitize helpers reject control chars and junk shapes', () => {
    expect(sanitizeDisplayString('\u0000\u0001', 8)).toBeNull();
    expect(sanitizeDisplayStringAllowEmpty(12 as unknown as string, 8)).toBeNull();
    expect(sanitizeProfile({ name: 'a', id: '' })).toBeNull();
    expect(sanitizeProfile({ name: 'a', id: 'id1', avatar: 9 })).toMatchObject({
      avatar: 'default',
    });
    expect(sanitizeAchievements([{ id: '', unlockedAt: 1 }, 'x', { id: 'ok' }])).toEqual([
      { id: 'ok', unlockedAt: 0 },
    ]);
    expect(sanitizeGameStatsMap(null)).toEqual({});
    expect(
      sanitizeGameStatsMap({
        '': { gamesPlayed: 1 },
        hex: 'nope',
        calla: { gameId: 'calla', gamesPlayed: 2 },
      })
    ).toMatchObject({ calla: { gamesPlayed: 2 } });
  });
});

describe('burn-1008 ui-cov-r2 pointer-hygiene edges', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('stale cancelled up clears matching pointer id', () => {
    const tap = createPointerTapController({ slopPx: 4 });
    tap.onPointerDown(
      new PointerEvent('pointerdown', {
        pointerId: 7,
        isPrimary: true,
        clientX: 0,
        clientY: 0,
        bubbles: true,
      })
    );
    tap.onPointerMove(
      new PointerEvent('pointermove', {
        pointerId: 7,
        isPrimary: true,
        clientX: 40,
        clientY: 0,
        bubbles: true,
      })
    );
    expect(tap.getState().phase).toBe('cancelled');
    expect(
      tap.onPointerUp(
        new PointerEvent('pointerup', {
          pointerId: 7,
          isPrimary: true,
          clientX: 40,
          clientY: 0,
          bubbles: true,
        })
      )
    ).toBe(false);
    expect(tap.getState().phase).toBe('idle');
    expect(tap.getState().pointerId).toBeNull();
  });

  it('bindCanvasPointerTap treats lostpointercapture as cancel', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    document.body.appendChild(canvas);
    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        pointerId: 1,
        isPrimary: true,
        clientX: 1,
        clientY: 1,
        bubbles: true,
      })
    );
    canvas.dispatchEvent(
      new PointerEvent('lostpointercapture', {
        pointerId: 1,
        bubbles: true,
      })
    );
    expect(onGestureEnd).toHaveBeenCalled();
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        pointerId: 1,
        isPrimary: true,
        clientX: 1,
        clientY: 1,
        bubbles: true,
      })
    );
    expect(onTap).not.toHaveBeenCalled();
    unbind();
  });

  it('bindCanvasPointerTap swallows setPointerCapture throws', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn(() => {
      throw new Error('gone');
    });
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);
    document.body.appendChild(canvas);
    const onTap = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap });
    expect(() => {
      canvas.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 3,
          isPrimary: true,
          clientX: 2,
          clientY: 2,
          bubbles: true,
        })
      );
    }).not.toThrow();
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        pointerId: 3,
        isPrimary: true,
        clientX: 2,
        clientY: 2,
        bubbles: true,
      })
    );
    expect(onTap).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('bindPrimaryPointerActivate cancel path does not activate', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);
    el.dispatchEvent(
      new PointerEvent('pointerdown', {
        pointerId: 1,
        isPrimary: true,
        clientX: 0,
        clientY: 0,
        bubbles: true,
      })
    );
    el.dispatchEvent(
      new PointerEvent('pointercancel', {
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    expect(activate).not.toHaveBeenCalled();
    unbind();
  });
});
