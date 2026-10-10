/**
 * q-mp-661 — Close `pointer-hygiene` residual gaps under the verify glob
 * `tests/unit/*pointer-hygiene*` (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1023` @ `f3497955`):
 * - With related suites: **96.18%** lines / **95.0%** branches
 * - Uncovered stmt clusters: ~149, 203, 244–245, 302
 *   (cancel mismatch early-return; capture:false; lostpointercapture while
 *   pending; bindPrimaryPointerActivate onCancel)
 *
 * Ownership (leave alone; do not edit product / competing suites):
 * - `#984` / q-mp-523 soft-fail catch arms — leave open (**contained**)
 * - Older tip drafts `#787`/`278`, `#901`/`423`, `#896`/`402`, `#987`/`527`
 *   — leave open (**contained**); burn-1008 covers some of these paths but
 *   is outside the `*pointer-hygiene*` glob
 *
 * Constraints: tests only; no `src/` / AI / scoring / rules / legal-move /
 * copy / aria edits; Hex Hard 450ms untouched; no network; no ratchet JSON.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  bindCanvasPointerTap,
  bindPrimaryPointerActivate,
  createPointerTapController,
} from '../../src/ui/pointer-hygiene';

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

describe('q-mp-661 pointer-hygiene — cancel mismatch residual (~149)', () => {
  it('ignores pointercancel for a different pointerId while pending', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { pointerId: 1 }));
    expect(tap.getState().phase).toBe('pending');

    tap.onPointerCancel(pointer('pointercancel', { pointerId: 99 }));
    expect(tap.getState().phase).toBe('pending');
    expect(tap.getState().pointerId).toBe(1);

    tap.onPointerCancel(pointer('pointercancel', { pointerId: 1 }));
    expect(tap.getState().phase).toBe('idle');
    expect(tap.getState().claimed).toBe(false);
  });
});

describe('q-mp-661 pointer-hygiene — capture:false residual (~203)', () => {
  let canvas: HTMLDivElement;

  beforeEach(() => {
    canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
    vi.restoreAllMocks();
  });

  it('skips setPointerCapture when capture is false and still taps', () => {
    const onTap = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap,
      capture: false,
    });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 3 }));
    expect(canvas.setPointerCapture).not.toHaveBeenCalled();

    canvas.dispatchEvent(pointer('pointerup', { pointerId: 3 }));
    expect(onTap).toHaveBeenCalledTimes(1);

    unbind();
  });
});

describe('q-mp-661 pointer-hygiene — lostpointercapture pending (~244–245)', () => {
  let canvas: HTMLDivElement;

  beforeEach(() => {
    canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
    vi.restoreAllMocks();
  });

  it('treats lostpointercapture while pending like cancel + gesture end', () => {
    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 4 }));
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(4);

    canvas.dispatchEvent(pointer('lostpointercapture', { pointerId: 4 }));
    expect(onGestureEnd).toHaveBeenCalledTimes(1);

    canvas.dispatchEvent(pointer('pointerup', { pointerId: 4 }));
    expect(onTap).not.toHaveBeenCalled();

    unbind();
  });
});

describe('q-mp-661 pointer-hygiene — bindPrimaryPointerActivate cancel (~302)', () => {
  it('pointercancel clears the pending gesture without activating', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);

    el.dispatchEvent(pointer('pointerdown', { pointerId: 5, clientX: 1 }));
    el.dispatchEvent(pointer('pointercancel', { pointerId: 5 }));
    el.dispatchEvent(pointer('pointerup', { pointerId: 5 }));
    expect(activate).not.toHaveBeenCalled();

    // No claim from cancel — click fallback remains available.
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);

    unbind();
    el.remove();
  });
});
