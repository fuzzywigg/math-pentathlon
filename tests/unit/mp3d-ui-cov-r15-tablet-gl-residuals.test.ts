/**
 * q-mp-270 / UI coverage round 15 — residual tablet-gl host helpers.
 * Characterization only; no AI / timing / layout-binder overlap with #764.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bindPageVisibility,
  isBoard3dLowQuality,
  markBoard3dCanvasReady,
  paintBoard3dAndMarkReady,
  shouldPreserveDrawingBuffer,
} from '../../src/ui/three/tablet-gl';

describe('q-mp-270 ui-cov-r15 tablet-gl residuals', () => {
  const originalWebdriver = navigator.webdriver;
  const originalRaf = globalThis.requestAnimationFrame;

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
    globalThis.requestAnimationFrame = originalRaf;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('paintBoard3dAndMarkReady leaves canvas unmarked when first paint throws and rAF is missing', () => {
    // @ts-expect-error — force the typeof !== 'function' arm
    globalThis.requestAnimationFrame = undefined;
    const canvas = document.createElement('canvas');
    const render = vi.fn(() => {
      throw new Error('transient gl');
    });
    paintBoard3dAndMarkReady(canvas, render);
    expect(render).toHaveBeenCalledTimes(1);
    expect(canvas.getAttribute('data-mp3d-ready')).toBeNull();
  });

  it('explicit false URL flags beat storage opt-in for preserve + board3dLQ', () => {
    localStorage.setItem('mp-preserve-drawing-buffer', '1');
    localStorage.setItem('mp-board3d-lq', '1');
    window.history.replaceState(
      {},
      '',
      '/?preserveDrawingBuffer=0&board3dLQ=false'
    );
    expect(shouldPreserveDrawingBuffer()).toBe(false);
    expect(isBoard3dLowQuality()).toBe(false);
  });

  it('bindPageVisibility onHidden-only + markBoard3dCanvasReady dispatches mp3d-ready', () => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const onHidden = vi.fn();
    const unbind = bindPageVisibility({ onHidden });
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onHidden).toHaveBeenCalledTimes(1);
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(onHidden).toHaveBeenCalledTimes(1);
    unbind();

    const canvas = document.createElement('canvas');
    const ready = vi.fn();
    canvas.addEventListener('mp3d-ready', ready);
    markBoard3dCanvasReady(canvas);
    expect(canvas.getAttribute('data-mp3d-ready')).toBe('1');
    expect(ready).toHaveBeenCalledTimes(1);
    const detail = (ready.mock.calls[0]?.[0] as CustomEvent).detail as {
      ready: boolean;
    };
    expect(detail.ready).toBe(true);
  });
});
