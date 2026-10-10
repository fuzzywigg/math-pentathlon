/**
 * q-mp-295 / UI coverage round 16 — `src/ui/owl` branch residuals.
 * Lifecycle / ResizeObserver / resting-eyes / reduced-motion coast / edge clamps.
 * Tests-only; no AI choice/timing or player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OwlComponent } from '../../src/ui/owl';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';

function stubPointer(root: HTMLElement, rect: Partial<DOMRect> = {}): void {
  const base = {
    x: 300,
    y: 8,
    left: 300,
    top: 8,
    right: 364,
    bottom: 72,
    width: 64,
    height: 64,
    toJSON: () => ({}),
    ...rect,
  };
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(base as DOMRect);
  root.setPointerCapture = vi.fn();
  root.releasePointerCapture = vi.fn();
  root.hasPointerCapture = vi.fn(() => true);
  document.elementFromPoint = vi.fn(
    () => null
  ) as typeof document.elementFromPoint;
}

function ptr(
  type: string,
  init: Partial<PointerEventInit> & { clientX?: number; clientY?: number } = {}
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    clientX: 0,
    clientY: 0,
    ...init,
  });
}

describe('q-mp-295 ui-cov-r16 owl branch residuals', () => {
  let owl: OwlComponent;
  let root: HTMLElement;
  const OriginalRO = globalThis.ResizeObserver;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    setUserReducedMotionFlag(false);
    owlSystem.hide();
    owlSystem.dismissMessage();
    document.body.innerHTML = '';
    owl = new OwlComponent();
  });

  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
    setUserReducedMotionFlag(false);
    globalThis.ResizeObserver = OriginalRO;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('ignores non-primary mouse button on pointerdown', () => {
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(
      ptr('pointerdown', {
        pointerType: 'mouse',
        button: 2,
        buttons: 2,
        clientX: 320,
        clientY: 30,
      })
    );
    expect(owl.getIsDragging()).toBe(false);
  });

  it('drags from minimized handle and skips expand click after real drag', () => {
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    owl.minimize();
    expect(root.classList.contains('owl-minimized-state')).toBe(true);

    const mini = root.querySelector('.owl-minimized')!;
    mini.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 200 }));
    expect(owl.getDidDrag()).toBe(true);
    root.dispatchEvent(ptr('pointerup', { clientX: 200, clientY: 200 }));
    expect(root.classList.contains('owl-resting')).toBe(true);

    // Click after drag must not expand (didDrag gate).
    (mini as HTMLButtonElement).click();
    expect(root.classList.contains('owl-minimized-state')).toBe(true);
    expect(owl.getDidDrag()).toBe(false);
  });

  it('zero-size rect falls back to 64px cache on pointerdown', () => {
    owl.init();
    root = owl.getElement()!;
    stubPointer(root, { width: 0, height: 0, right: 300, bottom: 8 });
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 200 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 200, clientY: 200 }));
    expect(root.classList.contains('owl-resting')).toBe(true);
  });

  it('pointercancel without capture skips releasePointerCapture', () => {
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    root.hasPointerCapture = vi.fn(() => false);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 180, clientY: 260 }));
    root.dispatchEvent(ptr('pointercancel', { clientX: 180, clientY: 260 }));
    expect(owl.getIsDragging()).toBe(false);
    expect(root.releasePointerCapture).not.toHaveBeenCalled();
    expect(root.style.left).toBe('');
  });

  it('reduced-motion coast snaps without scheduling raf', () => {
    setUserReducedMotionFlag(true);
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 400 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 100, clientY: 400 }));
    expect(root.classList.contains('owl-resting')).toBe(true);
    expect(rafSpy).not.toHaveBeenCalled();
    expect(root.style.left).not.toBe('');
  });

  it('horizontal edge clamp zeros vx while coasting', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root, {
      left: 10,
      x: 10,
      right: 74,
      width: 64,
      height: 64,
    });
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 40, clientY: 40 }));
    for (let i = 0; i < 6; i++) {
      root.dispatchEvent(
        ptr('pointermove', { clientX: 40 - i * 30, clientY: 40 })
      );
    }
    root.dispatchEvent(ptr('pointerup', { clientX: -80, clientY: 40 }));
    expect(root.classList.contains('owl-resting')).toBe(true);
    for (let i = 0; i < 40; i++) {
      await vi.advanceTimersByTimeAsync(16);
    }
    const left = parseFloat(root.style.left);
    expect(Number.isFinite(left)).toBe(true);
    expect(left).toBeLessThanOrEqual(10);
  });

  it('resting owl resolves eye center from inline left/top cache', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 300 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 200, clientY: 300 }));
    expect(root.classList.contains('owl-resting')).toBe(true);

    const pupil = root.querySelector('.owl-pupil') as HTMLElement;
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
    );
    await vi.advanceTimersByTimeAsync(32);
    expect(pupil.style.transform).toMatch(/translate\(/);
  });

  it('docked eye center cache hit skips second layout read', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const reads = { n: 0 };
    vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
      reads.n += 1;
      return {
        x: 300,
        y: 8,
        left: 300,
        top: 8,
        right: 364,
        bottom: 72,
        width: 64,
        height: 64,
        toJSON: () => ({}),
      } as DOMRect;
    });

    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
    );
    await vi.advanceTimersByTimeAsync(32);
    const afterFirst = reads.n;
    expect(afterFirst).toBeGreaterThanOrEqual(1);

    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 40, clientY: 50 })
    );
    await vi.advanceTimersByTimeAsync(32);
    // Cache hit: second frame must not re-measure the docked rect.
    expect(reads.n).toBe(afterFirst);
  });

  it('eye tracking skipped while minimized; viewport resize invalidates cache', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    owl.minimize();
    const pupil = root.querySelector('.owl-pupil') as HTMLElement;
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
    );
    await vi.advanceTimersByTimeAsync(32);
    expect(pupil.style.transform).toBe('');

    owl.expand();
    window.dispatchEvent(new Event('resize'));
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 20, clientY: 20 })
    );
    await vi.advanceTimersByTimeAsync(32);
    expect(pupil.style.transform).toMatch(/translate\(/);
  });

  it('re-click clears prior bounce timer; destroy cancels pending eye raf', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character') as HTMLElement;

    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(true);
    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(true);
    await vi.advanceTimersByTimeAsync(500);
    expect(root.classList.contains('owl-clicked')).toBe(false);

    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 5, clientY: 5 })
    );
    owl.destroy();
    expect(owl.getElement()).toBeNull();
    await vi.advanceTimersByTimeAsync(32);
  });

  it('destroy mid-coast clears raf without resurrecting container', async () => {
    vi.useFakeTimers();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 80, clientY: 400 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 80, clientY: 400 }));
    expect(root.classList.contains('owl-resting')).toBe(true);
    owl.destroy();
    expect(owl.getElement()).toBeNull();
    await vi.advanceTimersByTimeAsync(200);
  });

  it('ResizeObserver absent falls back to refreshSizeCache', () => {
    // @ts-expect-error intentional delete for residual arm
    delete globalThis.ResizeObserver;
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    expect(root.id).toBe('ollie-owl');
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);
  });

  it('ResizeObserver empty entry is a no-op; contentRect seeds size', () => {
    type ROCb = (entries: ResizeObserverEntry[]) => void;
    let cb: ROCb | null = null;
    class FakeRO {
      constructor(fn: ROCb) {
        cb = fn;
      }
      observe(): void {
        /* seed via cb */
      }
      disconnect(): void {
        /* noop */
      }
      unobserve(): void {
        /* noop */
      }
    }
    globalThis.ResizeObserver = FakeRO as unknown as typeof ResizeObserver;

    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    expect(cb).toBeTypeOf('function');

    cb!([]);
    cb!([
      {
        target: root,
        contentRect: {
          x: 0,
          y: 0,
          width: 80,
          height: 90,
          top: 0,
          left: 0,
          bottom: 90,
          right: 80,
          toJSON: () => ({}),
        },
        borderBoxSize: undefined,
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);

    // Force resting eyes to use cachedSize from contentRect path.
    root.classList.add('owl-resting');
    root.style.left = '10px';
    root.style.top = '20px';
    vi.useFakeTimers();
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 100, clientY: 100 })
    );
    return vi.advanceTimersByTimeAsync(32).then(() => {
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      expect(pupil.style.transform).toMatch(/translate\(/);
    });
  });

  it('ResizeObserver borderBoxSize seeds cache when present', () => {
    type ROCb = (entries: ResizeObserverEntry[]) => void;
    let cb: ROCb | null = null;
    class FakeRO {
      constructor(fn: ROCb) {
        cb = fn;
      }
      observe(): void {
        /* seed via cb */
      }
      disconnect(): void {
        /* noop */
      }
      unobserve(): void {
        /* noop */
      }
    }
    globalThis.ResizeObserver = FakeRO as unknown as typeof ResizeObserver;

    owl.init();
    root = owl.getElement()!;
    expect(cb).toBeTypeOf('function');
    cb!([
      {
        target: root,
        contentRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [{ inlineSize: 72, blockSize: 68 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    expect(root.id).toBe('ollie-owl');
  });

  it('innerWidth/innerHeight zero fallbacks still clamp coast', () => {
    setUserReducedMotionFlag(true);
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
    const iw = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    const ih = Object.getOwnPropertyDescriptor(window, 'innerHeight');
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: () => 0,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      get: () => 0,
    });
    try {
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 400 }));
      root.dispatchEvent(ptr('pointerup', { clientX: 100, clientY: 400 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      expect(root.style.left).not.toBe('');
    } finally {
      if (iw) {
        Object.defineProperty(window, 'innerWidth', iw);
      }
      if (ih) {
        Object.defineProperty(window, 'innerHeight', ih);
      }
    }
  });
});
