import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  canPaint3d,
  shouldPreserveDrawingBuffer,
  bindPageVisibility,
  TABLET_PIXEL_RATIO_CAP,
  BOARD_3D_LQ_PIXEL_RATIO_CAP,
  isBoard3dLowQuality,
  resolveBoard3dPixelRatio,
  markBoard3dCanvasReady,
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
});
