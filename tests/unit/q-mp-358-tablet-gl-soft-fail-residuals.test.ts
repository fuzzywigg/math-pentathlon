/**
 * q-mp-358 — characterize tablet-gl soft-fail / LQ / ready-attr / mount-paint
 * residuals. Tests only. Structural asserts on attributes, flags, paint
 * retries, and SSR no-ops. No player-facing copy pins; no keeper-export
 * demotes. Orthogonal to q-mp-344 (void lint brace edit of tablet-gl.ts).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BOARD_3D_LQ_PIXEL_RATIO_CAP,
  TABLET_PIXEL_RATIO_CAP,
  bindBoard3dLayout,
  bindPageVisibility,
  canPaint3d,
  clearBoard3dWebGlFallback,
  isBoard3dLowQuality,
  markBoard3dCanvasReady,
  markBoard3dWebGlFallback,
  MP3D_FALLBACK_ATTR,
  paintBoard3dAndMarkReady,
  resolveBoard3dPixelRatio,
  resolveCssViewportSize,
  scheduleBoard3dMountPaint,
  shouldPreserveDrawingBuffer,
  syncBoard3dRendererSize,
} from '../../src/ui/three/tablet-gl';

const READY_ATTR = 'data-mp3d-ready';

describe('q-mp-358 tablet-gl soft-fail / LQ / ready-attr residuals', () => {
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

  describe('LQ flag matrix', () => {
    it('reads board3dLQ from hash alone when search is empty', () => {
      window.history.replaceState({}, '', '/#/game/fiar?board3dLQ=1');
      expect(isBoard3dLowQuality()).toBe(true);
      expect(resolveBoard3dPixelRatio(3)).toBe(BOARD_3D_LQ_PIXEL_RATIO_CAP);
    });

    it('hash without ? falls through to storage for board3dLQ', () => {
      window.history.replaceState({}, '', '/#/game/fiar');
      expect(isBoard3dLowQuality()).toBe(false);
      localStorage.setItem('mp-board3d-lq', '1');
      expect(isBoard3dLowQuality()).toBe(true);
    });

    it('resolveBoard3dPixelRatio treats falsy window.devicePixelRatio as 1', () => {
      vi.stubGlobal('devicePixelRatio', 0);
      expect(resolveBoard3dPixelRatio()).toBe(1);
      localStorage.setItem('mp-board3d-lq', '1');
      expect(resolveBoard3dPixelRatio()).toBe(BOARD_3D_LQ_PIXEL_RATIO_CAP);
    });

    it('syncBoard3dRendererSize uses tablet cap when LQ is off', () => {
      vi.stubGlobal('devicePixelRatio', 3);
      const setPixelRatio = vi.fn();
      const setSize = vi.fn();
      const camera = { aspect: 1, updateProjectionMatrix: vi.fn() };
      syncBoard3dRendererSize({ setPixelRatio, setSize }, camera, 100, 50);
      expect(setPixelRatio).toHaveBeenCalledWith(TABLET_PIXEL_RATIO_CAP);
      expect(camera.aspect).toBe(2);
      expect(setSize).toHaveBeenCalledWith(100, 50, false);
    });
  });

  describe('ready-attr soft paths', () => {
    it('markBoard3dCanvasReady is a no-op when ready attr is already set', () => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute(READY_ATTR, '1');
      const ready = vi.fn();
      canvas.addEventListener('mp3d-ready', ready);
      markBoard3dCanvasReady(canvas);
      expect(ready).not.toHaveBeenCalled();
      expect(canvas.getAttribute(READY_ATTR)).toBe('1');
    });

    it('paintBoard3dAndMarkReady sets ready attr and bubbles mp3d-ready once', () => {
      const canvas = document.createElement('canvas');
      const host = document.createElement('div');
      host.appendChild(canvas);
      const hostReady = vi.fn();
      host.addEventListener('mp3d-ready', hostReady);
      paintBoard3dAndMarkReady(canvas, vi.fn());
      expect(canvas.getAttribute(READY_ATTR)).toBe('1');
      expect(hostReady).toHaveBeenCalledTimes(1);
      paintBoard3dAndMarkReady(canvas, vi.fn());
      expect(hostReady).toHaveBeenCalledTimes(1);
    });
  });

  describe('context-loss / mount soft-fail matrix', () => {
    it.each([
      ['webglcontextlost', 'webglcontextlost'],
      ['webgl-unavailable', 'webgl-unavailable'],
      ['', 'webgl'],
    ] as const)(
      'markBoard3dWebGlFallback reason %j → attr %j',
      (reason, expected) => {
        const host = document.createElement('div');
        markBoard3dWebGlFallback(host, reason);
        expect(host.getAttribute(MP3D_FALLBACK_ATTR)).toBe(expected);
        clearBoard3dWebGlFallback(host);
        expect(host.getAttribute(MP3D_FALLBACK_ATTR)).toBeNull();
      }
    );

    it('clearBoard3dWebGlFallback no-ops for null and undefined hosts', () => {
      expect(() => clearBoard3dWebGlFallback(null)).not.toThrow();
      expect(() => clearBoard3dWebGlFallback(undefined)).not.toThrow();
    });

    it('paint soft-fail matrix: disposed / hidden / throw+retry / double-throw', () => {
      vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
      const canvas = document.createElement('canvas');

      const disposedRender = vi.fn();
      paintBoard3dAndMarkReady(canvas, disposedRender, () => true);
      expect(disposedRender).not.toHaveBeenCalled();
      expect(canvas.getAttribute(READY_ATTR)).toBeNull();

      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      const hiddenRender = vi.fn();
      paintBoard3dAndMarkReady(canvas, hiddenRender);
      expect(hiddenRender).not.toHaveBeenCalled();

      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      const recover = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('transient gl');
        })
        .mockImplementationOnce(() => undefined);
      paintBoard3dAndMarkReady(canvas, recover);
      expect(canvas.getAttribute(READY_ATTR)).toBeNull();
      vi.runAllTimers();
      expect(recover).toHaveBeenCalledTimes(2);
      expect(canvas.getAttribute(READY_ATTR)).toBe('1');

      canvas.removeAttribute(READY_ATTR);
      const stuck = vi.fn(() => {
        throw new Error('still broken');
      });
      paintBoard3dAndMarkReady(canvas, stuck);
      vi.runAllTimers();
      expect(stuck).toHaveBeenCalledTimes(2);
      expect(canvas.getAttribute(READY_ATTR)).toBeNull();
    });
  });

  describe('mount-paint cancel / cancelAnimationFrame', () => {
    it('cancel after outer rAF cancels the pending inner frame id', () => {
      vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
      const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
      const paint = vi.fn();
      const cancel = scheduleBoard3dMountPaint(paint);
      vi.advanceTimersToNextTimer();
      cancel();
      expect(cancelSpy).toHaveBeenCalled();
      vi.runAllTimers();
      expect(paint).not.toHaveBeenCalled();
    });

    it('scheduleBoard3dMountPaint without rAF paints sync and cancel is a no-op', () => {
      const original = globalThis.requestAnimationFrame;
      // @ts-expect-error force missing rAF path for soft-fail sync paint
      delete globalThis.requestAnimationFrame;
      try {
        const paint = vi.fn();
        const cancel = scheduleBoard3dMountPaint(paint);
        expect(paint).toHaveBeenCalledTimes(1);
        expect(cancel()).toBeUndefined();
      } finally {
        globalThis.requestAnimationFrame = original;
      }
    });
  });

  describe('SSR / missing globals soft defaults', () => {
    it('window-absent arms: LQ off, preserve off, viewport zero, layout no-op', () => {
      const original = globalThis.window;
      // @ts-expect-error intentional delete for non-browser default arms
      delete globalThis.window;
      try {
        expect(isBoard3dLowQuality()).toBe(false);
        expect(shouldPreserveDrawingBuffer()).toBe(false);
        expect(resolveBoard3dPixelRatio()).toBe(1);
        expect(resolveCssViewportSize()).toEqual({ width: 0, height: 0 });
        const unbind = bindBoard3dLayout(
          { nodeType: 1 } as unknown as Element,
          vi.fn()
        );
        expect(typeof unbind).toBe('function');
        expect(unbind()).toBeUndefined();
      } finally {
        Object.defineProperty(globalThis, 'window', {
          configurable: true,
          writable: true,
          value: original,
        });
      }
    });

    it('document-absent arms: canPaint3d true; bindPageVisibility is a no-op', () => {
      const original = globalThis.document;
      // @ts-expect-error intentional delete for non-browser default arms
      delete globalThis.document;
      try {
        expect(canPaint3d()).toBe(true);
        const unbind = bindPageVisibility({
          onHidden: vi.fn(),
          onVisible: vi.fn(),
        });
        expect(typeof unbind).toBe('function');
        expect(unbind()).toBeUndefined();
      } finally {
        Object.defineProperty(globalThis, 'document', {
          configurable: true,
          writable: true,
          value: original,
        });
      }
    });
  });
});
