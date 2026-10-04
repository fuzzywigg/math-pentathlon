import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  canPaint3d,
  shouldPreserveDrawingBuffer,
  bindPageVisibility,
  TABLET_PIXEL_RATIO_CAP,
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
