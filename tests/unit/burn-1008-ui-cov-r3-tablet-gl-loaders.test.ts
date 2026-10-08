/**
 * burn-1008-mp-ui-coverage-round-3 — tablet-gl edge branches + board-3d-loader
 * dynamic-import gates (0% → exercised). Tests-only; pins current behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bindBoard3dLayout,
  canPaint3d,
  clearBoard3dWebGlFallback,
  isBoard3dLowQuality,
  markBoard3dWebGlFallback,
  MP3D_FALLBACK_ATTR,
  paintBoard3dAndMarkReady,
  resolveCssViewportSize,
  scheduleBoard3dMountPaint,
  shouldPreserveDrawingBuffer,
} from '../../src/ui/three/tablet-gl';
import { loadFiarBoard3DModule } from '../../src/games/fiar/board-3d-loader';
import { loadHexAGoneBoard3DModule } from '../../src/games/hex-a-gone/board-3d-loader';
import { loadKingsQuadraphagesBoard3DModule } from '../../src/games/kings-quadraphages/board-3d-loader';
import { loadKwatroSinkoBoard3DModule } from '../../src/games/kwatro-sinko/board-3d-loader';
import { loadPentEmInBoard3DModule } from '../../src/games/pent-em-in/board-3d-loader';
import { loadPrimeGoldBoard3DModule } from '../../src/games/prime-gold/board-3d-loader';
import { loadQueensGuardsBoard3DModule } from '../../src/games/queens-guards/board-3d-loader';
import { loadStarTrackBoard3DModule } from '../../src/games/star-track/board-3d-loader';

describe('burn-1008 ui-cov-r3 tablet-gl edges', () => {
  const originalWebdriver = navigator.webdriver;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => false,
    });
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => originalWebdriver,
    });
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('reads preserveDrawingBuffer / board3dLQ from hash query', () => {
    window.history.replaceState(
      {},
      '',
      '/#/game/fiar?preserveDrawingBuffer=1&board3dLQ=true'
    );
    expect(shouldPreserveDrawingBuffer()).toBe(true);
    expect(isBoard3dLowQuality()).toBe(true);
  });

  it('markBoard3dWebGlFallback defaults empty reason to webgl; null host no-ops', () => {
    markBoard3dWebGlFallback(null, 'ignored');
    markBoard3dWebGlFallback(undefined, 'ignored');
    clearBoard3dWebGlFallback(null);

    const host = document.createElement('div');
    markBoard3dWebGlFallback(host, '');
    expect(host.getAttribute(MP3D_FALLBACK_ATTR)).toBe('webgl');
  });

  it('paintBoard3dAndMarkReady no-ops when already disposed', () => {
    const canvas = document.createElement('canvas');
    const render = vi.fn();
    paintBoard3dAndMarkReady(canvas, render, () => true);
    expect(render).not.toHaveBeenCalled();
  });

  it('paintBoard3dAndMarkReady second throw leaves canvas unmarked', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const canvas = document.createElement('canvas');
    const render = vi.fn(() => {
      throw new Error('still broken');
    });
    paintBoard3dAndMarkReady(canvas, render);
    vi.runAllTimers();
    expect(render).toHaveBeenCalledTimes(2);
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
  });

  it('paintBoard3dAndMarkReady rAF retry aborts when disposed mid-flight', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const canvas = document.createElement('canvas');
    let disposed = false;
    const render = vi.fn(() => {
      throw new Error('transient');
    });
    paintBoard3dAndMarkReady(canvas, render, () => disposed);
    disposed = true;
    vi.runAllTimers();
    expect(render).toHaveBeenCalledTimes(1);
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
  });

  it('scheduleBoard3dMountPaint cancel drops pending frames', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const paint = vi.fn();
    const cancel = scheduleBoard3dMountPaint(paint);
    cancel();
    vi.runAllTimers();
    expect(paint).not.toHaveBeenCalled();
  });

  it('scheduleBoard3dMountPaint falls back to sync paint without rAF', () => {
    const original = globalThis.requestAnimationFrame;
    // @ts-expect-error force missing rAF path
    delete globalThis.requestAnimationFrame;
    const paint = vi.fn();
    const cancel = scheduleBoard3dMountPaint(paint);
    expect(paint).toHaveBeenCalledTimes(1);
    expect(typeof cancel()).toBe('undefined');
    globalThis.requestAnimationFrame = original;
  });

  it('resolveCssViewportSize falls back to innerWidth/innerHeight', () => {
    vi.stubGlobal('visualViewport', undefined);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });
    expect(resolveCssViewportSize()).toEqual({ width: 800, height: 600 });
  });

  it('bindBoard3dLayout still binds resize when ResizeObserver is missing', () => {
    const OriginalRO = globalThis.ResizeObserver;
    // @ts-expect-error force missing RO path
    delete globalThis.ResizeObserver;
    const host = document.createElement('div');
    const onLayout = vi.fn();
    const unbind = bindBoard3dLayout(host, onLayout);
    window.dispatchEvent(new Event('resize'));
    expect(onLayout).toHaveBeenCalled();
    unbind();
    if (OriginalRO) {
      globalThis.ResizeObserver = OriginalRO;
    }
  });

  it('canPaint3d is true when document is visible', () => {
    expect(canPaint3d()).toBe(true);
  });
});

describe('burn-1008 ui-cov-r3 board-3d-loaders', () => {
  it('each game 3d-loader resolves a module object', async () => {
    const modules = await Promise.all([
      loadFiarBoard3DModule(),
      loadHexAGoneBoard3DModule(),
      loadKingsQuadraphagesBoard3DModule(),
      loadKwatroSinkoBoard3DModule(),
      loadPentEmInBoard3DModule(),
      loadPrimeGoldBoard3DModule(),
      loadQueensGuardsBoard3DModule(),
      loadStarTrackBoard3DModule(),
    ]);
    for (const mod of modules) {
      expect(mod).toBeTruthy();
      expect(typeof mod).toBe('object');
    }
  }, 60_000);
});
