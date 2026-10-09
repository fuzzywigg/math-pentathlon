/**
 * q-mp-167 / UI coverage round 8 — residual tablet-gl arms.
 * Characterization only; no AI / timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bindBoard3dLayout,
  bindPageVisibility,
  canPaint3d,
  isBoard3dLowQuality,
  paintBoard3dAndMarkReady,
  resolveBoard3dPixelRatio,
  resolveCssViewportSize,
  scheduleBoard3dMountPaint,
  shouldPreserveDrawingBuffer,
  syncBoard3dRendererSize,
  BOARD_3D_LQ_PIXEL_RATIO_CAP,
  TABLET_PIXEL_RATIO_CAP,
} from '../../src/ui/three/tablet-gl';
import { loadThree } from '../../src/ui/three/load-three';

describe('q-mp-167 ui-cov-r8 tablet-gl residuals', () => {
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
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('readFlag catch path returns false when location search throws', () => {
    const bad = {
      get search() {
        throw new Error('search boom');
      },
      get hash() {
        return '';
      },
    };
    vi.stubGlobal('location', bad);
    expect(shouldPreserveDrawingBuffer()).toBe(false);
    expect(isBoard3dLowQuality()).toBe(false);
  });

  it('syncBoard3dRendererSize uses LQ pixel-ratio cap when opted in', () => {
    localStorage.setItem('mp-board3d-lq', '1');
    vi.stubGlobal('devicePixelRatio', 3);
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const camera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    syncBoard3dRendererSize({ setPixelRatio, setSize }, camera, 0, 0);
    expect(setPixelRatio).toHaveBeenCalledWith(BOARD_3D_LQ_PIXEL_RATIO_CAP);
    expect(camera.aspect).toBe(1);
    expect(setSize).toHaveBeenCalledWith(1, 1, false);
  });

  it('paintBoard3dAndMarkReady rAF retry aborts when tab hides mid-flight', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const canvas = document.createElement('canvas');
    const render = vi.fn(() => {
      throw new Error('transient');
    });
    paintBoard3dAndMarkReady(canvas, render);
    expect(render).toHaveBeenCalledTimes(1);
    hidden = true;
    vi.runAllTimers();
    expect(render).toHaveBeenCalledTimes(1);
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
  });

  it('scheduleBoard3dMountPaint drops when cancelled between outer and inner rAF', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
    const paint = vi.fn();
    const cancel = scheduleBoard3dMountPaint(paint);
    // Advance only the outer frame, then cancel before inner runs.
    vi.advanceTimersToNextTimer();
    cancel();
    vi.runAllTimers();
    expect(paint).not.toHaveBeenCalled();
  });

  it('bindPageVisibility no-ops handlers when only one side is provided', () => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const onVisible = vi.fn();
    const unbind = bindPageVisibility({ onVisible });
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onVisible).not.toHaveBeenCalled();
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onVisible).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('bindBoard3dLayout observes host via ResizeObserver when present', () => {
    const host = document.createElement('div');
    const onLayout = vi.fn();
    const unbind = bindBoard3dLayout(host, onLayout);
    expect(typeof unbind).toBe('function');
    unbind();
  });

  it('resolveCssViewportSize falls back when visualViewport reports 0', () => {
    vi.stubGlobal('visualViewport', { width: 0, height: 0 });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 640,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 480,
    });
    expect(resolveCssViewportSize()).toEqual({ width: 640, height: 480 });
  });

  it('resolveBoard3dPixelRatio defaults devicePixelRatio when omitted', () => {
    vi.stubGlobal('devicePixelRatio', 2.5);
    expect(resolveBoard3dPixelRatio()).toBe(TABLET_PIXEL_RATIO_CAP);
    expect(canPaint3d()).toBe(true);
  });

  it('loadThree resolves the three module object', async () => {
    const mod = await loadThree();
    expect(mod).toBeTruthy();
    expect(typeof mod).toBe('object');
    expect(typeof mod.WebGLRenderer).toBe('function');
  }, 30_000);
});
