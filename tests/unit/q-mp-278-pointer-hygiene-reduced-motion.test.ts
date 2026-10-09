/**
 * q-mp-278 — Characterize pointer-hygiene + reduced-motion helpers (tests only).
 *
 * Covers enable/disable bind paths, preference-change re-apply, and residual
 * gesture / move branches under jsdom. No AI, scoring, copy, or src edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  POINTER_TAP_SLOP_PX,
  bindCanvasPointerTap,
  bindPrimaryPointerActivate,
  createPointerTapController,
  isPrimaryActivatingPointer,
} from '../../src/ui/pointer-hygiene';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  durationMsForMotion,
  prefersReducedMotion,
  scrollBehaviorForMotion,
} from '../../src/ui/reduced-motion';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

function pointer(
  type: string,
  init: Partial<PointerEventInit> & { pointerId?: number } = {}
): PointerEvent {
  const pointerId = init.pointerId ?? 1;
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    clientX: 0,
    clientY: 0,
    ...init,
  });
}

describe('q-mp-278 pointer-hygiene characterization', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('treats omitted isPrimary as primary (synthetic / test events)', () => {
    const ev = pointer('pointerdown', { pointerType: 'touch' });
    Object.defineProperty(ev, 'isPrimary', {
      configurable: true,
      value: undefined,
    });
    expect(isPrimaryActivatingPointer(ev)).toBe(true);
  });

  it('onPointerMove early-returns when idle or pointerId mismatches', () => {
    const tap = createPointerTapController({ slopPx: 8 });
    // Idle: move must not transition out of idle.
    tap.onPointerMove(pointer('pointermove', { clientX: 40, clientY: 0 }));
    expect(tap.getState().phase).toBe('idle');

    tap.onPointerDown(pointer('pointerdown', { pointerId: 1, clientX: 0 }));
    expect(tap.getState().phase).toBe('pending');
    // Wrong id: still pending, no cancel.
    tap.onPointerMove(
      pointer('pointermove', { pointerId: 99, clientX: 40, clientY: 0 })
    );
    expect(tap.getState().phase).toBe('pending');
  });

  it('bindCanvasPointerTap forwards pointermove into the tap controller', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    document.body.appendChild(canvas);
    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    // Finite slop so move can cancel (default canvas slop is +Infinity).
    const unbind = bindCanvasPointerTap(canvas, {
      onTap,
      onGestureEnd,
      slopPx: 10,
    });

    canvas.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    canvas.dispatchEvent(pointer('pointermove', { clientX: 40, clientY: 0 }));
    canvas.dispatchEvent(pointer('pointerup', { clientX: 40, clientY: 0 }));
    expect(onTap).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('bindCanvasPointerTap cancel releases capture when held; swallows release throws', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn(() => {
      throw new Error('already released');
    });
    canvas.hasPointerCapture = vi.fn(() => true);
    document.body.appendChild(canvas);
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap: vi.fn(),
      onGestureEnd,
    });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 4 }));
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 4 }));
    }).not.toThrow();
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(4);
    expect(onGestureEnd).toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('bindCanvasPointerTap cancel skips release when capture is not held', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);
    document.body.appendChild(canvas);
    const unbind = bindCanvasPointerTap(canvas, { onTap: vi.fn() });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 5 }));
    canvas.dispatchEvent(pointer('pointercancel', { pointerId: 5 }));
    expect(canvas.releasePointerCapture).not.toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('bindCanvasPointerTap cancel tolerates missing hasPointerCapture', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    // Optional-chain branch: hasPointerCapture?.(id) when method is absent.
    // @ts-expect-error intentional for optional-call coverage
    canvas.hasPointerCapture = undefined;
    document.body.appendChild(canvas);
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap: vi.fn(),
      onGestureEnd,
    });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 6 }));
    expect(() => {
      canvas.dispatchEvent(pointer('pointercancel', { pointerId: 6 }));
    }).not.toThrow();
    expect(canvas.releasePointerCapture).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('bindCanvasPointerTap cancel with no tracked pointer skips capture release', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    document.body.appendChild(canvas);
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap: vi.fn(),
      onGestureEnd,
    });

    // No prior down → pointerId null → id !== null branch is false.
    canvas.dispatchEvent(pointer('pointercancel', { pointerId: 9 }));
    expect(canvas.releasePointerCapture).not.toHaveBeenCalled();
    expect(onGestureEnd).toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('lostpointercapture is a no-op when gesture is not pending', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);
    document.body.appendChild(canvas);
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap: vi.fn(),
      onGestureEnd,
    });

    canvas.dispatchEvent(pointer('lostpointercapture', { pointerId: 1 }));
    expect(onGestureEnd).not.toHaveBeenCalled();

    unbind();
    canvas.remove();
  });

  it('bindPrimaryPointerActivate move-beyond-slop blocks pointerup; click still works', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate, {
      slopPx: POINTER_TAP_SLOP_PX,
    });

    el.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    el.dispatchEvent(
      pointer('pointermove', {
        clientX: POINTER_TAP_SLOP_PX + 2,
        clientY: 0,
      })
    );
    el.dispatchEvent(
      pointer('pointerup', {
        clientX: POINTER_TAP_SLOP_PX + 2,
        clientY: 0,
      })
    );
    expect(activate).not.toHaveBeenCalled();

    // No claim from the cancelled pointer path — click fallback remains.
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);

    unbind();
    el.remove();
  });
});

describe('q-mp-278 reduced-motion enable/disable + preference-change', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    resetSettingsFlagsForTests();
  });

  afterEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    resetSettingsFlagsForTests();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('applyReducedMotionPreference no-ops when document is undefined', () => {
    const original = globalThis.document;
    // @ts-expect-error intentional delete for SSR/no-document branch
    delete globalThis.document;
    try {
      expect(() =>
        applyReducedMotionPreference({
          userPrefersReducedMotion: true,
          osPrefersReducedMotion: true,
        })
      ).not.toThrow();
    } finally {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });

  it('enable then disable clears html data-reduced-motion attribute', () => {
    applyReducedMotionPreference({
      userPrefersReducedMotion: true,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );

    applyReducedMotionPreference({
      userPrefersReducedMotion: false,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
  });

  it('bindReducedMotionPreference re-applies on OS preference change (enable + disable)', () => {
    const listeners: Array<() => void> = [];
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((_type: string, cb: () => void) => {
        listeners.push(cb);
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql as unknown as MediaQueryList)
    );
    setUserReducedMotionFlag(false);

    const unbind = bindReducedMotionPreference();
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
    expect(listeners.length).toBe(1);

    // OS flips on → attribute enabled.
    mql.matches = true;
    listeners[0]?.();
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );

    // OS flips off → attribute disabled (user flag still false).
    mql.matches = false;
    listeners[0]?.();
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );

    unbind();
    expect(mql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('legacy addListener path fires preference-change and unsubscribes', () => {
    const listeners: Array<() => void> = [];
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener:
        undefined as unknown as MediaQueryList['addEventListener'],
      removeEventListener:
        undefined as unknown as MediaQueryList['removeEventListener'],
      addListener: vi.fn((cb: () => void) => {
        listeners.push(cb);
      }),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql as unknown as MediaQueryList)
    );
    setUserReducedMotionFlag(false);

    const unbind = bindReducedMotionPreference();
    expect(mql.addListener).toHaveBeenCalled();
    mql.matches = true;
    listeners[0]?.();
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    unbind();
    expect(mql.removeListener).toHaveBeenCalled();
  });

  it('durationMsForMotion and scrollBehaviorForMotion track enable/disable', () => {
    expect(
      durationMsForMotion(300, 12, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(300);
    expect(
      durationMsForMotion(300, 12, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(12);

    setUserReducedMotionFlag(false);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );
    expect(scrollBehaviorForMotion()).toBe('smooth');
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(false);

    setUserReducedMotionFlag(true);
    expect(scrollBehaviorForMotion()).toBe('auto');
  });
});
