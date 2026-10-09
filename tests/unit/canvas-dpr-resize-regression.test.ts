/**
 * q-mp-258 — Canvas DPR / resize regression lock-in for shared helpers.
 *
 * Pins the burn-1008 audit contract on `coord-map.ts` + `tablet-gl.ts`
 * (`syncBoard3dRendererSize`, DPR cap, visualViewport / ResizeObserver layout
 * binders) so regressions fail under jsdom + mocks (no network / WebGL HW).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CANVAS_2D_PIXEL_RATIO_CAP,
  clientToNdc,
  clientToSvgUser,
  configureCanvas2dBackingStore,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';
import {
  TABLET_PIXEL_RATIO_CAP,
  bindBoard3dLayout,
  resolveBoard3dPixelRatio,
  resolveCssViewportSize,
  syncBoard3dRendererSize,
} from '../../src/ui/three/tablet-gl';

type LayoutVv = EventTarget & { width: number; height: number };

function stubVisualViewport(width: number, height: number): LayoutVv {
  const vv = new EventTarget() as LayoutVv;
  vv.width = width;
  vv.height = height;
  vi.stubGlobal('visualViewport', vv);
  return vv;
}

describe('q-mp-258 canvas DPR/resize regression — coord-map', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('2D DPR cap stays 2 across 1× / 2× / 3× device ratios', () => {
    expect(CANVAS_2D_PIXEL_RATIO_CAP).toBe(2);
    expect(resolveCanvas2dPixelRatio(1)).toBe(1);
    expect(resolveCanvas2dPixelRatio(2)).toBe(2);
    expect(resolveCanvas2dPixelRatio(3)).toBe(2);
    expect(resolveCanvas2dPixelRatio(2.75)).toBe(2);
  });

  it('configureCanvas2dBackingStore re-sizes CSS + buffer after orientation change', () => {
    const canvas = document.createElement('canvas');
    // Portrait phone CSS, 3× DPR → capped 2× backing store.
    expect(configureCanvas2dBackingStore(canvas, 390, 700, { dpr: 3 })).toBe(2);
    expect(canvas.width).toBe(780);
    expect(canvas.height).toBe(1400);
    expect(canvas.style.width).toBe('390px');
    expect(canvas.style.height).toBe('700px');

    // Landscape "orientation" — CSS flips; backing store follows capped DPR.
    expect(configureCanvas2dBackingStore(canvas, 700, 390, { dpr: 3 })).toBe(2);
    expect(canvas.width).toBe(1400);
    expect(canvas.height).toBe(780);
    expect(canvas.style.width).toBe('700px');
    expect(canvas.style.height).toBe('390px');
  });

  it('configureCanvas2dBackingStore floors tiny CSS to 1px backing store', () => {
    const canvas = document.createElement('canvas');
    configureCanvas2dBackingStore(canvas, 0, 0, { dpr: 2 });
    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(1);
  });

  it('clientToNdc corners stay correct after CSS host resize', () => {
    const before = { left: 0, top: 0, width: 200, height: 100 };
    expect(clientToNdc(0, 0, before)).toEqual({ x: -1, y: 1 });
    expect(clientToNdc(200, 100, before)).toEqual({ x: 1, y: -1 });
    expect(clientToNdc(100, 50, before)).toEqual({ x: 0, y: 0 });

    // Host shrinks (e.g. keyboard / split view) — same CSS click must remap.
    const after = { left: 0, top: 0, width: 100, height: 50 };
    expect(clientToNdc(0, 0, after)).toEqual({ x: -1, y: 1 });
    expect(clientToNdc(100, 50, after)).toEqual({ x: 1, y: -1 });
    expect(clientToNdc(50, 25, after)).toEqual({ x: 0, y: 0 });
    // Old corner is now outside the new rect → positive NDC past edge.
    expect(clientToNdc(200, 100, after)?.x).toBeGreaterThan(1);
  });

  it('SVG hit-test cell is stable when CSS scale changes after resize', () => {
    const cellSize = 20;
    const padding = 4;
    const viewBox = 3 * cellSize + padding * 2;
    const userX = padding + 2 * cellSize + cellSize / 2;
    const userY = padding + 1 * cellSize + cellSize / 2;
    const expected = svgUserToGridCell(userX, userY, cellSize, padding);

    for (const cssScale of [1, 0.5, 0.25]) {
      const rect = {
        left: 8,
        top: 12,
        width: viewBox * cssScale,
        height: viewBox * cssScale,
      };
      const { x, y } = clientToSvgUser(
        rect.left + userX * cssScale,
        rect.top + userY * cssScale,
        rect,
        viewBox,
        viewBox
      );
      expect(svgUserToGridCell(x, y, cellSize, padding)).toEqual(expected);
    }
  });
});

describe('q-mp-258 canvas DPR/resize regression — tablet-gl layout binders', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('syncBoard3dRendererSize re-reads DPR each call and keeps tablet cap', () => {
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const updateProjectionMatrix = vi.fn();
    const camera = { aspect: 1, updateProjectionMatrix };
    const renderer = { setPixelRatio, setSize };

    vi.stubGlobal('devicePixelRatio', 1);
    syncBoard3dRendererSize(renderer, camera, 320, 240);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1);
    expect(camera.aspect).toBeCloseTo(320 / 240);
    expect(setSize).toHaveBeenLastCalledWith(320, 240, false);

    // Monitor / OS scale jumps to 3× — sync must re-read and cap at 1.5.
    vi.stubGlobal('devicePixelRatio', 3);
    syncBoard3dRendererSize(renderer, camera, 640, 360);
    expect(resolveBoard3dPixelRatio()).toBe(TABLET_PIXEL_RATIO_CAP);
    expect(setPixelRatio).toHaveBeenLastCalledWith(TABLET_PIXEL_RATIO_CAP);
    expect(camera.aspect).toBeCloseTo(640 / 360);
    expect(setSize).toHaveBeenLastCalledWith(640, 360, false);
    expect(updateProjectionMatrix).toHaveBeenCalledTimes(2);
    // Never pass updateStyle=true — CSS host owns layout size.
    for (const call of setSize.mock.calls) {
      expect(call[2]).toBe(false);
    }
  });

  it('resolveCssViewportSize prefers visualViewport over innerWidth/Height', () => {
    stubVisualViewport(390, 700);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });
    expect(resolveCssViewportSize()).toEqual({ width: 390, height: 700 });
  });

  it('bindBoard3dLayout fires on window, visualViewport, and ResizeObserver', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onLayout = vi.fn();
    const vv = stubVisualViewport(390, 700);

    const observed: Element[] = [];
    const disconnect = vi.fn();
    class MockRO {
      private readonly cb: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) {
        this.cb = cb;
      }
      observe(el: Element): void {
        observed.push(el);
        // Simulate a post-bind layout notification (orientation / host grow).
        this.cb(
          [
            {
              target: el,
              contentRect: {
                x: 0,
                y: 0,
                width: 400,
                height: 300,
                top: 0,
                left: 0,
                bottom: 300,
                right: 400,
                toJSON: () => ({}),
              },
            } as ResizeObserverEntry,
          ],
          this as unknown as ResizeObserver
        );
      }
      unobserve(): void {
        /* no-op */
      }
      disconnect(): void {
        disconnect();
      }
    }
    vi.stubGlobal('ResizeObserver', MockRO);

    const unbind = bindBoard3dLayout(host, onLayout);
    expect(observed).toContain(host);
    expect(onLayout.mock.calls.length).toBeGreaterThanOrEqual(1);
    const afterRo = onLayout.mock.calls.length;

    window.dispatchEvent(new Event('resize'));
    expect(onLayout.mock.calls.length).toBe(afterRo + 1);

    vv.dispatchEvent(new Event('resize'));
    expect(onLayout.mock.calls.length).toBe(afterRo + 2);

    unbind();
    expect(disconnect).toHaveBeenCalledTimes(1);
    const afterUnbind = onLayout.mock.calls.length;
    window.dispatchEvent(new Event('resize'));
    vv.dispatchEvent(new Event('resize'));
    expect(onLayout).toHaveBeenCalledTimes(afterUnbind);

    host.remove();
  });

  it('layout binder → sync → NDC stays consistent after CSS host resize', () => {
    const host = document.createElement('div');
    const size = { w: 200, h: 100 };
    Object.defineProperty(host, 'clientWidth', {
      configurable: true,
      get: () => size.w,
    });
    Object.defineProperty(host, 'clientHeight', {
      configurable: true,
      get: () => size.h,
    });

    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const camera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    vi.stubGlobal('devicePixelRatio', 2.5);

    const applyLayout = (): void => {
      syncBoard3dRendererSize(
        { setPixelRatio, setSize },
        camera,
        host.clientWidth,
        host.clientHeight
      );
    };

    const vv = stubVisualViewport(390, 700);
    const unbind = bindBoard3dLayout(host, applyLayout);

    // Initial layout via window resize (host still 200×100).
    window.dispatchEvent(new Event('resize'));
    expect(setSize).toHaveBeenLastCalledWith(200, 100, false);
    expect(setPixelRatio).toHaveBeenLastCalledWith(TABLET_PIXEL_RATIO_CAP);
    expect(
      clientToNdc(100, 50, { left: 0, top: 0, width: 200, height: 100 })
    ).toEqual({ x: 0, y: 0 });

    // Host CSS grows; visualViewport signals layout (mobile chrome collapse).
    size.w = 400;
    size.h = 200;
    vv.width = 400;
    vv.height = 200;
    vv.dispatchEvent(new Event('resize'));
    expect(setSize).toHaveBeenLastCalledWith(400, 200, false);
    expect(camera.aspect).toBeCloseTo(2);
    expect(
      clientToNdc(200, 100, { left: 0, top: 0, width: 400, height: 200 })
    ).toEqual({ x: 0, y: 0 });
    expect(
      clientToNdc(0, 0, { left: 0, top: 0, width: 400, height: 200 })
    ).toEqual({ x: -1, y: 1 });

    unbind();
  });
});
