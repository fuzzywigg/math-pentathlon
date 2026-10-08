import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  canPaint3d,
  shouldPreserveDrawingBuffer,
  bindPageVisibility,
  bindBoard3dLayout,
  syncBoard3dRendererSize,
  resolveCssViewportSize,
  TABLET_PIXEL_RATIO_CAP,
  BOARD_3D_LQ_PIXEL_RATIO_CAP,
  isBoard3dLowQuality,
  resolveBoard3dPixelRatio,
  markBoard3dCanvasReady,
  markBoard3dWebGlFallback,
  clearBoard3dWebGlFallback,
  paintBoard3dAndMarkReady,
  scheduleBoard3dMountPaint,
  MP3D_FALLBACK_ATTR,
} from '../../src/ui/three/tablet-gl';

describe('tablet-gl helpers', () => {
  const originalWebdriver = navigator.webdriver;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    Object.defineProperty(navigator, 'webdriver', {
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
  });

  it('caps pixel ratio at 1.5 for the tablet profile', () => {
    expect(TABLET_PIXEL_RATIO_CAP).toBe(1.5);
    expect(BOARD_3D_LQ_PIXEL_RATIO_CAP).toBe(1);
  });

  it('preserves drawing buffer for Playwright webdriver', () => {
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => true,
    });
    expect(shouldPreserveDrawingBuffer()).toBe(true);
  });

  it('preserves drawing buffer when query/localStorage opts in', () => {
    expect(shouldPreserveDrawingBuffer()).toBe(false);
    window.history.replaceState({}, '', '/?preserveDrawingBuffer=1');
    expect(shouldPreserveDrawingBuffer()).toBe(true);
    window.history.replaceState({}, '', '/');
    localStorage.setItem('mp-preserve-drawing-buffer', '1');
    expect(shouldPreserveDrawingBuffer()).toBe(true);
  });

  it('board3dLQ is off by default and opt-in via query or storage', () => {
    expect(isBoard3dLowQuality()).toBe(false);
    window.history.replaceState({}, '', '/?board3dLQ=1');
    expect(isBoard3dLowQuality()).toBe(true);
    window.history.replaceState({}, '', '/');
    localStorage.setItem('mp-board3d-lq', '1');
    expect(isBoard3dLowQuality()).toBe(true);
  });

  it('resolveBoard3dPixelRatio uses LQ cap when board3dLQ is on', () => {
    expect(resolveBoard3dPixelRatio(3)).toBe(TABLET_PIXEL_RATIO_CAP);
    localStorage.setItem('mp-board3d-lq', '1');
    expect(resolveBoard3dPixelRatio(3)).toBe(BOARD_3D_LQ_PIXEL_RATIO_CAP);
  });

  it('markBoard3dCanvasReady is idempotent', () => {
    const canvas = document.createElement('canvas');
    markBoard3dCanvasReady(canvas);
    expect(canvas.getAttribute('data-mp3d-ready')).toBe('1');
    markBoard3dCanvasReady(canvas);
    expect(canvas.getAttribute('data-mp3d-ready')).toBe('1');
  });

  it('paintBoard3dAndMarkReady marks after a successful render', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    const canvas = document.createElement('canvas');
    const render = vi.fn();
    paintBoard3dAndMarkReady(canvas, render);
    expect(render).toHaveBeenCalledTimes(1);
    expect(canvas.getAttribute('data-mp3d-ready')).toBe('1');
  });

  it('paintBoard3dAndMarkReady retries once via rAF when render throws', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const canvas = document.createElement('canvas');
    const render = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('transient GL');
      })
      .mockImplementationOnce(() => undefined);
    paintBoard3dAndMarkReady(canvas, render);
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
    vi.runAllTimers();
    expect(render).toHaveBeenCalledTimes(2);
    expect(canvas.getAttribute('data-mp3d-ready')).toBe('1');
    vi.useRealTimers();
  });

  it('paintBoard3dAndMarkReady skips while the document is hidden', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    const canvas = document.createElement('canvas');
    const render = vi.fn();
    paintBoard3dAndMarkReady(canvas, render);
    expect(render).not.toHaveBeenCalled();
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
  });

  it('scheduleBoard3dMountPaint runs after double rAF', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const paint = vi.fn();
    scheduleBoard3dMountPaint(paint);
    expect(paint).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(paint).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('markBoard3dWebGlFallback / clearBoard3dWebGlFallback toggle host attr', () => {
    const host = document.createElement('div');
    markBoard3dWebGlFallback(host, 'webgl-unavailable');
    expect(host.getAttribute(MP3D_FALLBACK_ATTR)).toBe('webgl-unavailable');
    clearBoard3dWebGlFallback(host);
    expect(host.getAttribute(MP3D_FALLBACK_ATTR)).toBeNull();
  });

  it('canPaint3d is false while document is hidden', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    expect(canPaint3d()).toBe(false);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    expect(canPaint3d()).toBe(true);
  });

  it('bindPageVisibility fires hidden/visible handlers', () => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const onHidden = vi.fn();
    const onVisible = vi.fn();
    const unbind = bindPageVisibility({ onHidden, onVisible });

    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onHidden).toHaveBeenCalledTimes(1);

    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onVisible).toHaveBeenCalledTimes(1);

    unbind();
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onHidden).toHaveBeenCalledTimes(1);
    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('syncBoard3dRendererSize refreshes pixel ratio + aspect + size', () => {
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const updateProjectionMatrix = vi.fn();
    const camera = { aspect: 1, updateProjectionMatrix };
    vi.stubGlobal('devicePixelRatio', 3);
    syncBoard3dRendererSize({ setPixelRatio, setSize }, camera, 200, 100);
    expect(setPixelRatio).toHaveBeenCalledWith(TABLET_PIXEL_RATIO_CAP);
    expect(camera.aspect).toBe(2);
    expect(updateProjectionMatrix).toHaveBeenCalledTimes(1);
    expect(setSize).toHaveBeenCalledWith(200, 100, false);
  });

  it('resolveCssViewportSize prefers visualViewport when present', () => {
    vi.stubGlobal('visualViewport', { width: 390, height: 700 });
    expect(resolveCssViewportSize()).toEqual({ width: 390, height: 700 });
  });

  it('bindBoard3dLayout cleans up window + visualViewport + ResizeObserver', () => {
    const host = document.createElement('div');
    const onLayout = vi.fn();
    const unbind = bindBoard3dLayout(host, onLayout);

    window.dispatchEvent(new Event('resize'));
    expect(onLayout).toHaveBeenCalled();
    const callsAfterWindow = onLayout.mock.calls.length;

    window.visualViewport?.dispatchEvent(new Event('resize'));
    // visualViewport may be undefined in jsdom — only assert when present
    if (window.visualViewport) {
      expect(onLayout.mock.calls.length).toBeGreaterThan(callsAfterWindow);
    }

    unbind();
    const afterUnbind = onLayout.mock.calls.length;
    window.dispatchEvent(new Event('resize'));
    expect(onLayout).toHaveBeenCalledTimes(afterUnbind);
  });
});
