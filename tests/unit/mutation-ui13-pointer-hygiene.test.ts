/**
 * q-mp-402 mutation audit UI wave 13 — pointer-hygiene structural re-pins.
 * First-20 window already 100% on tip; re-pin slop / primary / claim contracts.
 * Separate from wave-2 / q-mp-278. No copy asserts; no AI / timing.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  POINTER_TAP_SLOP_PX,
  bindCanvasPointerTap,
  bindPrimaryPointerActivate,
  createPointerTapController,
  isPrimaryActivatingPointer,
  suppressBoardContextMenu,
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

describe('mutation-ui13 pointer-hygiene', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('slop constant is exactly 16 (kills ±1 on export)', () => {
    expect(POINTER_TAP_SLOP_PX).toBe(16);
    expect(POINTER_TAP_SLOP_PX).not.toBe(15);
    expect(POINTER_TAP_SLOP_PX).not.toBe(17);
  });

  it('default slop cancels only when movement is strictly greater than 16', () => {
    const atSlop = createPointerTapController();
    atSlop.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    atSlop.onPointerMove(pointer('pointermove', { clientX: 16, clientY: 0 }));
    expect(atSlop.getState().phase).toBe('pending');
    expect(
      atSlop.onPointerUp(pointer('pointerup', { clientX: 16, clientY: 0 }))
    ).toBe(true);

    const pastSlop = createPointerTapController();
    pastSlop.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    pastSlop.onPointerMove(pointer('pointermove', { clientX: 17, clientY: 0 }));
    expect(pastSlop.getState().phase).toBe('cancelled');
    expect(
      pastSlop.onPointerUp(pointer('pointerup', { clientX: 17, clientY: 0 }))
    ).toBe(false);
  });

  it('isPrimaryActivatingPointer rejects secondary and non-left mouse', () => {
    expect(
      isPrimaryActivatingPointer(
        pointer('pointerdown', { isPrimary: false, pointerId: 2 })
      )
    ).toBe(false);
    expect(
      isPrimaryActivatingPointer(
        pointer('pointerdown', { pointerType: 'mouse', button: 2 })
      )
    ).toBe(false);
    expect(
      isPrimaryActivatingPointer(
        pointer('pointerdown', { pointerType: 'mouse', button: 0 })
      )
    ).toBe(true);
  });

  it('treats omitted isPrimary as primary (undefined !== false)', () => {
    const ev = pointer('pointerdown');
    Object.defineProperty(ev, 'isPrimary', {
      configurable: true,
      value: undefined,
    });
    expect(isPrimaryActivatingPointer(ev)).toBe(true);
  });

  it('requirePrimary defaults true; false allows secondary start', () => {
    const strict = createPointerTapController();
    strict.onPointerDown(
      pointer('pointerdown', { isPrimary: false, pointerId: 2 })
    );
    expect(strict.getState().phase).toBe('idle');

    const loose = createPointerTapController({ requirePrimary: false });
    loose.onPointerDown(
      pointer('pointerdown', { isPrimary: false, pointerId: 2 })
    );
    expect(loose.getState().phase).toBe('pending');
    expect(loose.getState().pointerId).toBe(2);
  });

  it('successful up claims and blocks hybrid click echo', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 1, clientY: 1 }));
    expect(
      tap.onPointerUp(pointer('pointerup', { clientX: 1, clientY: 1 }))
    ).toBe(true);
    expect(tap.getState().claimed).toBe(true);
    expect(tap.shouldAcceptClick()).toBe(false);
  });

  it('pointercancel clears without claiming so click may still apply', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown'));
    tap.onPointerCancel(pointer('pointercancel'));
    expect(tap.getState().phase).toBe('idle');
    expect(tap.getState().claimed).toBe(false);
    expect(tap.shouldAcceptClick()).toBe(true);
  });

  it('markClaimed forces claimed and idle', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 4, clientY: 4 }));
    tap.markClaimed();
    expect(tap.getState().claimed).toBe(true);
    expect(tap.getState().phase).toBe('idle');
    expect(tap.getState().pointerId).toBeNull();
    expect(tap.shouldAcceptClick()).toBe(false);
  });

  it('bindPrimaryPointerActivate prefers pointer tap over trailing click', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);
    el.dispatchEvent(pointer('pointerdown', { clientX: 2, clientY: 2 }));
    el.dispatchEvent(pointer('pointerup', { clientX: 2, clientY: 2 }));
    expect(activate).toHaveBeenCalledTimes(1);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);
    unbind();
    el.remove();
  });

  it('bindPrimaryPointerActivate click path works without prior pointer', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);
    unbind();
    el.remove();
  });

  it('suppressBoardContextMenu prevents default and unbinds', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const unbind = suppressBoardContextMenu(el);
    const ev = new Event('contextmenu', { cancelable: true });
    el.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    unbind();
    const ev2 = new Event('contextmenu', { cancelable: true });
    el.dispatchEvent(ev2);
    expect(ev2.defaultPrevented).toBe(false);
    el.remove();
  });

  it('bindCanvasPointerTap activates only matching pointerId', () => {
    const canvas = document.createElement('div');
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => false);
    document.body.appendChild(canvas);
    const onTap = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap });
    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 7, clientX: 0 }));
    canvas.dispatchEvent(pointer('pointerup', { pointerId: 8, clientX: 0 }));
    expect(onTap).not.toHaveBeenCalled();
    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 7, clientX: 0 }));
    canvas.dispatchEvent(pointer('pointerup', { pointerId: 7, clientX: 0 }));
    expect(onTap).toHaveBeenCalledTimes(1);
    unbind();
    canvas.remove();
  });

  it('reset restores numeric zeros and clears claimed', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 9, clientY: 4 }));
    tap.markClaimed();
    tap.reset();
    const s = tap.getState();
    expect(s.phase).toBe('idle');
    expect(s.pointerId).toBeNull();
    expect(s.startX).toBe(0);
    expect(s.startY).toBe(0);
    expect(s.claimed).toBe(false);
  });
});
