/**
 * q-mp-705 — Close `tablet-gl` residual branches under the *tablet-gl* /
 * *tablet* verify glob (tests-only characterization).
 *
 * Pins CURRENT soft-fail / viewport / cancel arms exactly as-is.
 * No layout/visual product edits; no copy/aria/label pins; no WebGL product
 * path changes (helpers only; mock rAF / viewport globals).
 *
 * Unreachable keep (document only): `hashQueryParams` L37 `typeof window ===
 * 'undefined'` — private helper is only called from `readFlag` after that
 * function already returned on missing `window`, so the true arm cannot fire
 * through the public API without a product edit.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resolveCssViewportSize,
  scheduleBoard3dMountPaint,
} from '../../src/ui/three/tablet-gl';

describe('q-mp-705 tablet-gl residual branches', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('resolveCssViewportSize — final || 0 arms (L250–251)', () => {
    it('returns zeros when visualViewport and inner dimensions are all falsy', () => {
      vi.stubGlobal('visualViewport', { width: 0, height: 0 });
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 0,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 0,
      });

      expect(resolveCssViewportSize()).toEqual({ width: 0, height: 0 });
    });

    it('returns zeros when visualViewport is missing and inners are falsy', () => {
      vi.stubGlobal('visualViewport', undefined);
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 0,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 0,
      });

      expect(resolveCssViewportSize()).toEqual({ width: 0, height: 0 });
    });
  });

  describe('scheduleBoard3dMountPaint — falsy outerId cancel (L201)', () => {
    it('cancel skips cancelAnimationFrame when rAF returns 0', () => {
      const cancelSpy = vi.fn();
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn(() => 0)
      );
      vi.stubGlobal('cancelAnimationFrame', cancelSpy);

      const paint = vi.fn();
      const cancel = scheduleBoard3dMountPaint(paint);
      cancel();

      // outerId === 0 is falsy → `if (outerId)` soft-skips cancelAnimationFrame
      expect(cancelSpy).not.toHaveBeenCalled();
      expect(paint).not.toHaveBeenCalled();
    });
  });
});
