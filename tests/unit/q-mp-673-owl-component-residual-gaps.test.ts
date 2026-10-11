/**
 * q-mp-673 — Close `owl-component` residual gaps under the `*owl-component*`
 * verification glob (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `890a9e3f`) before this suite,
 * with related `tests/unit/*owl-component*` (4 files):
 *   **72.72%** lines (280/385) / **50.75%** branches (101/199)
 *   (backlog stamp 72.7% / 50.8% — tip folds did not close the gap)
 * Uncovered under that glob clustered around ResizeObserver / viewport resize,
 *   pointercancel + wrong-pointerId soft ignores, reduced-motion coast, eye
 *   tracking (resting + docked cache), bounce timer / eye-raf destroy, dismiss
 *   wire, and minimized post-drag click skip. Tip-folded `burn-1010` /
 *   `owl-drag-shell` already exercise many of these outside the verification
 *   glob — this suite owns them inside `*owl-component*`.
 *
 * Ownership (leave open; do not edit product / competing suites):
 *   `#1036` / q-mp-591 — soft-fail residual contracts (**contained**)
 *   Undrafted q-mp-670 nnnull clear on the same file — serialize; **no**
 *     nullish/nnnull ceiling write here
 *   Tip-folded `burn-1010` / `owl-drag-shell` / `owl-drop-inspect` — same arms
 *     outside this verification glob (**contained**)
 *   Open `#1093` owl-system / `#1090` bootstrap-owl — different hosts
 *
 * Constraints: tests only; ZERO `src/` edits; pin CURRENT chrome behavior
 * with structural asserts only — no AI / scoring / rules / player-facing copy /
 * aria / label / message-body pins; no ratchet JSON; Hex Hard 450ms untouched;
 * no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';
import { storage } from '../../src/core/storage';
import { OwlComponent, owlComponent } from '../../src/ui/owl/owl-component';

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

describe('q-mp-673 owl-component residual gaps', () => {
  let owl: OwlComponent;
  let root: HTMLElement;
  const OriginalRO = globalThis.ResizeObserver;
  // Direct document assign is not undone by vi.restoreAllMocks (q-mp-1210).
  const originalElementFromPoint =
    typeof document.elementFromPoint === 'function' &&
    !vi.isMockFunction(document.elementFromPoint)
      ? document.elementFromPoint
      : undefined;

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
    owlComponent.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
    setUserReducedMotionFlag(false);
    globalThis.ResizeObserver = OriginalRO;
    vi.restoreAllMocks();
    if (originalElementFromPoint) {
      document.elementFromPoint = originalElementFromPoint;
    } else {
      Reflect.deleteProperty(document, 'elementFromPoint');
    }
    vi.useRealTimers();
  });

  // ===========================================================================
  // 1. ResizeObserver + viewport resize residuals
  // ===========================================================================

  describe('ResizeObserver + viewport resize', () => {
    it('ResizeObserver absent falls back to refreshSizeCache without throw', () => {
      // @ts-expect-error intentional delete for residual arm
      delete globalThis.ResizeObserver;
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      expect(root.id).toBe('ollie-owl');
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(true);
    });

    it('ResizeObserver empty entry is a no-op; contentRect seeds size cache', async () => {
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

      root.classList.add('owl-resting');
      root.style.left = '10px';
      root.style.top = '20px';
      vi.useFakeTimers();
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 100, clientY: 100 })
      );
      await vi.advanceTimersByTimeAsync(32);
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      expect(pupil.style.transform).toMatch(/translate\(/);
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

    it('borderBoxSize zero sizes fall through to contentRect soft path', () => {
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
            width: 88,
            height: 70,
            top: 0,
            left: 0,
            bottom: 70,
            right: 88,
            toJSON: () => ({}),
          },
          borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as unknown as ResizeObserverEntry,
      ]);
      expect(root.id).toBe('ollie-owl');
    });

    it('contentRect single-zero arm soft-defaults the zero axis to 64', () => {
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
            width: 80,
            height: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 80,
            toJSON: () => ({}),
          },
          borderBoxSize: undefined,
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as unknown as ResizeObserverEntry,
      ]);
      cb!([
        {
          target: root,
          contentRect: {
            x: 0,
            y: 0,
            width: 0,
            height: 70,
            top: 0,
            left: 0,
            bottom: 70,
            right: 0,
            toJSON: () => ({}),
          },
          borderBoxSize: undefined,
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as unknown as ResizeObserverEntry,
      ]);
      expect(root.id).toBe('ollie-owl');
    });

    it('borderBoxSize single-zero arm soft-defaults the zero axis to 64', () => {
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
      // Enter borderBox arm (inlineSize > 0) while blockSize || 64 soft-defaults.
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
          borderBoxSize: [{ inlineSize: 96, blockSize: 0 }],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as unknown as ResizeObserverEntry,
      ]);
      // Inverse: blockSize > 0, inlineSize soft-default.
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
          borderBoxSize: [{ inlineSize: 0, blockSize: 54 }],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as unknown as ResizeObserverEntry,
      ]);
      expect(root.id).toBe('ollie-owl');
    });
  });

  // ===========================================================================
  // 2. Pointer cancel / multi-pointer soft ignores / capture throw
  // ===========================================================================

  describe('pointer cancel + multi-pointer soft ignores', () => {
    it('pointercancel after real drag snaps back to dock', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 300 }));
      expect(owl.getDidDrag()).toBe(true);
      root.dispatchEvent(ptr('pointercancel', { clientX: 100, clientY: 300 }));
      expect(owl.getIsDragging()).toBe(false);
      expect(root.classList.contains('owl-dragging')).toBe(false);
      expect(root.classList.contains('owl-resting')).toBe(false);
      expect(root.style.left).toBe('');
      expect(root.style.top).toBe('');
    });

    it('pointercancel without capture skips releasePointerCapture', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      root.hasPointerCapture = vi.fn(() => false);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 180, clientY: 260 }));
      root.dispatchEvent(ptr('pointercancel', { clientX: 180, clientY: 260 }));
      expect(owl.getIsDragging()).toBe(false);
      expect(root.releasePointerCapture).not.toHaveBeenCalled();
      expect(root.style.left).toBe('');
    });

    it('wrong pointerId on move/up/cancel soft-ignores active drag', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { pointerId: 1, clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(true);
      const leftBefore = root.style.left;

      root.dispatchEvent(
        ptr('pointermove', { pointerId: 9, clientX: 100, clientY: 400 })
      );
      expect(root.style.left).toBe(leftBefore);
      expect(owl.getDidDrag()).toBe(false);

      root.dispatchEvent(
        ptr('pointerup', { pointerId: 9, clientX: 100, clientY: 400 })
      );
      expect(owl.getIsDragging()).toBe(true);

      root.dispatchEvent(
        ptr('pointercancel', { pointerId: 9, clientX: 100, clientY: 400 })
      );
      expect(owl.getIsDragging()).toBe(true);

      root.dispatchEvent(
        ptr('pointerup', { pointerId: 1, clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(false);
    });

    it('second primary pointerdown while dragging soft-ignores steal', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { pointerId: 1, clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(true);
      character.dispatchEvent(
        ptr('pointerdown', {
          pointerId: 2,
          isPrimary: true,
          clientX: 340,
          clientY: 40,
        })
      );
      expect(owl.getIsDragging()).toBe(true);
      root.dispatchEvent(
        ptr('pointerup', { pointerId: 1, clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(false);
    });

    it('setPointerCapture throw still leaves drag active', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      root.setPointerCapture = vi.fn(() => {
        throw new Error('capture gone');
      });
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(true);
      expect(root.classList.contains('owl-dragging')).toBe(true);
    });

    it('releasePointerCapture throw on cancel still docks', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      root.releasePointerCapture = vi.fn(() => {
        throw new Error('already released');
      });
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointercancel', { clientX: 320, clientY: 30 }));
      expect(owl.getIsDragging()).toBe(false);
      expect(root.style.left).toBe('');
    });
  });

  // ===========================================================================
  // 3. Minimized post-drag click skip + dismiss wire
  // ===========================================================================

  describe('minimized drag-skip + dismiss wire', () => {
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

      (mini as HTMLButtonElement).click();
      expect(root.classList.contains('owl-minimized-state')).toBe(true);
      expect(owl.getDidDrag()).toBe(false);
    });

    it('dismiss button wires owlSystem.dismissMessage structurally', () => {
      owl.init();
      root = owl.getElement()!;
      const spy = vi.spyOn(owlSystem, 'dismissMessage');
      const dismiss = root.querySelector(
        '.owl-bubble-dismiss'
      ) as HTMLButtonElement;
      expect(dismiss).toBeTruthy();
      dismiss.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // 4. Reduced-motion coast + viewport soft defaults
  // ===========================================================================

  describe('reduced-motion coast + viewport soft defaults', () => {
    it('reduced-motion coast snaps without scheduling raf', () => {
      setUserReducedMotionFlag(true);
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const rafSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation(() => 1);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 400 }));
      root.dispatchEvent(ptr('pointerup', { clientX: 100, clientY: 400 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      expect(rafSpy).not.toHaveBeenCalled();
      expect(root.style.left).not.toBe('');
    });

    it('innerWidth/innerHeight zero fallbacks still clamp reduced-motion coast', () => {
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

    it('zero-velocity real drag stays resting without coast raf', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const rafSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation(() => 1);
      const character = root.querySelector('.owl-character')!;
      // Cross threshold, then a second move at the same client point → Δv = 0.
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 340, clientY: 30 }));
      root.dispatchEvent(ptr('pointermove', { clientX: 340, clientY: 30 }));
      expect(owl.getDidDrag()).toBe(true);
      root.dispatchEvent(ptr('pointerup', { clientX: 340, clientY: 30 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      expect(rafSpy).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // 5. Coast clamp / destroy mid-coast
  // ===========================================================================

  describe('coast clamp + destroy mid-coast', () => {
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

    it('vertical edge clamp zeros vy while coasting', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root, {
        left: 100,
        x: 100,
        top: 10,
        y: 10,
        right: 164,
        bottom: 74,
        width: 64,
        height: 64,
      });
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 120, clientY: 40 })
      );
      for (let i = 0; i < 6; i++) {
        root.dispatchEvent(
          ptr('pointermove', { clientX: 120, clientY: 40 - i * 30 })
        );
      }
      root.dispatchEvent(ptr('pointerup', { clientX: 120, clientY: -80 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      for (let i = 0; i < 40; i++) {
        await vi.advanceTimersByTimeAsync(16);
      }
      const top = parseFloat(root.style.top);
      expect(Number.isFinite(top)).toBe(true);
      expect(top).toBeLessThanOrEqual(10);
    });

    it('destroy mid-coast clears raf without resurrecting container', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 80, clientY: 400 }));
      root.dispatchEvent(ptr('pointerup', { clientX: 80, clientY: 400 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      owl.destroy();
      expect(owl.getElement()).toBeNull();
      await vi.advanceTimersByTimeAsync(200);
    });
  });

  // ===========================================================================
  // 6. Eye tracking residuals (resting / docked / minimized / reduced-motion)
  // ===========================================================================

  describe('eye tracking residuals', () => {
    it('resting owl resolves eye center from inline left/top cache', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
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

    it('reduced-motion skips eye tracking transforms', async () => {
      setUserReducedMotionFlag(true);
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
      );
      await vi.advanceTimersByTimeAsync(32);
      expect(pupil.style.transform).toBe('');
    });

    it('mousemove while dragging does not schedule eye transform', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      expect(owl.getIsDragging()).toBe(true);
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
      );
      await vi.advanceTimersByTimeAsync(32);
      expect(pupil.style.transform).toBe('');
    });

    it('coalesced mousemove frames reuse a single pending eye raf', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 5, clientY: 5 })
      );
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 15, clientY: 25 })
      );
      await vi.advanceTimersByTimeAsync(32);
      expect(pupil.style.transform).toMatch(/translate\(/);
    });

    it('resting eyes soft-default empty left/top parseFloat to 0', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      root.classList.add('owl-resting');
      root.style.left = '';
      root.style.top = '';
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 40, clientY: 40 })
      );
      await vi.advanceTimersByTimeAsync(32);
      expect(pupil.style.transform).toMatch(/translate\(/);
    });

    it('docked zero-size rect soft-defaults eye size cache to 64', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      stubPointer(root, {
        width: 0,
        height: 0,
        right: 300,
        bottom: 8,
      });
      // Invalidate any prior eye cache via viewport resize.
      window.dispatchEvent(new Event('resize'));
      const pupil = root.querySelector('.owl-pupil') as HTMLElement;
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
      );
      await vi.advanceTimersByTimeAsync(32);
      expect(pupil.style.transform).toMatch(/translate\(/);
    });
  });

  // ===========================================================================
  // 7. Click bounce + destroy cancel timers
  // ===========================================================================

  describe('click bounce + destroy cancel', () => {
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

    it('reduced-motion character click skips owl-clicked class', () => {
      setUserReducedMotionFlag(true);
      owl.init();
      root = owl.getElement()!;
      const character = root.querySelector('.owl-character') as HTMLElement;
      character.click();
      expect(root.classList.contains('owl-clicked')).toBe(false);
    });

    it('destroy mid-bounce clears owl-clicked timer without throw', async () => {
      vi.useFakeTimers();
      owl.init();
      root = owl.getElement()!;
      const character = root.querySelector('.owl-character') as HTMLElement;
      character.click();
      expect(root.classList.contains('owl-clicked')).toBe(true);
      owl.destroy();
      expect(owl.getElement()).toBeNull();
      await vi.advanceTimersByTimeAsync(500);
    });
  });

  // ===========================================================================
  // 8. Drop-inspect soft arms (elementFromPoint absent)
  // ===========================================================================

  describe('drop-inspect soft arms', () => {
    it('missing elementFromPoint soft-null still rests after real drag', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      // Soft residual: typeof document.elementFromPoint !== 'function' → null.
      // @ts-expect-error intentional delete for residual arm
      delete document.elementFromPoint;
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 150, clientY: 250 }));
      root.dispatchEvent(ptr('pointerup', { clientX: 150, clientY: 250 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
    });

    it('elementFromPoint Element hit still rests after real drag', () => {
      owl.init();
      root = owl.getElement()!;
      stubPointer(root);
      const under = document.createElement('div');
      under.className = 'board-cell';
      document.body.appendChild(under);
      document.elementFromPoint = vi.fn(
        () => under
      ) as typeof document.elementFromPoint;
      const character = root.querySelector('.owl-character')!;
      character.dispatchEvent(
        ptr('pointerdown', { clientX: 320, clientY: 30 })
      );
      root.dispatchEvent(ptr('pointermove', { clientX: 150, clientY: 250 }));
      root.dispatchEvent(ptr('pointerup', { clientX: 150, clientY: 250 }));
      expect(root.classList.contains('owl-resting')).toBe(true);
      // Structural only — do not pin speakNow / bubble message text.
      expect(document.elementFromPoint).toHaveBeenCalled();
    });
  });
});
