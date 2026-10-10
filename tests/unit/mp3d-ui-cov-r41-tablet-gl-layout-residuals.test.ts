/**
 * q-mp-470 / UI coverage round 41 — tablet-gl layout binder residuals
 * (visualViewport + ResizeObserver arms). Tests only; no product edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindBoard3dLayout } from '../../src/ui/three/tablet-gl';

describe('q-mp-470 ui-cov-r41 tablet-gl layout residuals', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('fires onLayout from visualViewport resize and ResizeObserver', () => {
    const onLayout = vi.fn();
    const vvListeners = new Map<string, EventListener>();
    const vv = {
      addEventListener: vi.fn((type: string, cb: EventListener) => {
        vvListeners.set(type, cb);
      }),
      removeEventListener: vi.fn((type: string) => {
        vvListeners.delete(type);
      }),
    };
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: vv,
    });

    const observe = vi.fn();
    const disconnect = vi.fn();
    let roCb: ResizeObserverCallback | null = null;
    class FakeResizeObserver {
      constructor(cb: ResizeObserverCallback) {
        roCb = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
    }
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);

    const host = document.createElement('div');
    document.body.appendChild(host);
    const unbind = bindBoard3dLayout(host, onLayout);

    expect(vv.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    expect(observe).toHaveBeenCalledWith(host);

    vvListeners.get('resize')?.(new Event('resize'));
    expect(onLayout).toHaveBeenCalledTimes(1);

    roCb?.([] as unknown as ResizeObserverEntry[], {} as ResizeObserver);
    expect(onLayout).toHaveBeenCalledTimes(2);

    window.dispatchEvent(new Event('resize'));
    expect(onLayout).toHaveBeenCalledTimes(3);

    unbind();
    expect(vv.removeEventListener).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
