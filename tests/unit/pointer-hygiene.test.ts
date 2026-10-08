import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('isPrimaryActivatingPointer', () => {
  it('accepts primary touch and left mouse', () => {
    expect(
      isPrimaryActivatingPointer(
        pointer('pointerdown', { pointerType: 'touch', isPrimary: true })
      )
    ).toBe(true);
    expect(
      isPrimaryActivatingPointer(
        pointer('pointerdown', { pointerType: 'mouse', button: 0 })
      )
    ).toBe(true);
  });

  it('rejects secondary fingers and non-primary mouse buttons', () => {
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
  });
});

describe('createPointerTapController (drag/tap state machine)', () => {
  it('activates only on matching primary pointerup', () => {
    const tap = createPointerTapController();
    expect(tap.onPointerUp(pointer('pointerup'))).toBe(false);

    tap.onPointerDown(pointer('pointerdown', { clientX: 5, clientY: 5 }));
    expect(tap.getState().phase).toBe('pending');
    expect(
      tap.onPointerUp(pointer('pointerup', { pointerId: 99, clientX: 5, clientY: 5 }))
    ).toBe(false);
    expect(tap.getState().phase).toBe('pending');
    expect(
      tap.onPointerUp(pointer('pointerup', { clientX: 5, clientY: 5 }))
    ).toBe(true);
    expect(tap.getState().claimed).toBe(true);
    expect(tap.shouldAcceptClick()).toBe(false);
  });

  it('pointercancel clears pending without claiming', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 1, clientY: 1 }));
    tap.onPointerMove(
      pointer('pointermove', {
        clientX: 1 + POINTER_TAP_SLOP_PX + 1,
        clientY: 1,
      })
    );
    expect(tap.getState().phase).toBe('cancelled');
    tap.onPointerCancel(pointer('pointercancel'));
    expect(tap.getState().phase).toBe('idle');
    expect(tap.getState().claimed).toBe(false);
    expect(tap.onPointerUp(pointer('pointerup'))).toBe(false);
  });

  it('ignores a second finger while a tap is pending', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { pointerId: 1 }));
    tap.onPointerDown(
      pointer('pointerdown', { pointerId: 2, isPrimary: false })
    );
    expect(tap.getState().pointerId).toBe(1);
    expect(
      tap.onPointerUp(pointer('pointerup', { pointerId: 2, isPrimary: false }))
    ).toBe(false);
    expect(tap.onPointerUp(pointer('pointerup', { pointerId: 1 }))).toBe(true);
  });

  it('movement beyond slop cancels before up', () => {
    const tap = createPointerTapController({ slopPx: 10 });
    tap.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    tap.onPointerMove(pointer('pointermove', { clientX: 40, clientY: 0 }));
    expect(tap.getState().phase).toBe('cancelled');
    expect(tap.onPointerUp(pointer('pointerup', { clientX: 40, clientY: 0 }))).toBe(
      false
    );
  });
});

describe('bindCanvasPointerTap', () => {
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

  it('fires onTap for primary down+up and ignores secondary up', () => {
    const onTap = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap });

    canvas.dispatchEvent(pointer('pointerdown', { pointerId: 1, clientX: 2 }));
    canvas.dispatchEvent(
      pointer('pointerdown', { pointerId: 2, isPrimary: false, clientX: 3 })
    );
    canvas.dispatchEvent(
      pointer('pointerup', { pointerId: 2, isPrimary: false, clientX: 3 })
    );
    expect(onTap).not.toHaveBeenCalled();

    canvas.dispatchEvent(pointer('pointerup', { pointerId: 1, clientX: 2 }));
    expect(onTap).toHaveBeenCalledTimes(1);

    unbind();
  });

  it('does not fire onTap after pointercancel', () => {
    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap, onGestureEnd });

    canvas.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    canvas.dispatchEvent(pointer('pointercancel', { clientX: 0, clientY: 0 }));
    expect(onGestureEnd).toHaveBeenCalled();
    canvas.dispatchEvent(pointer('pointerup', { clientX: 0, clientY: 0 }));
    expect(onTap).not.toHaveBeenCalled();

    unbind();
  });

  it('does not activate from a bare pointerup without prior down', () => {
    const onTap = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, { onTap });
    canvas.dispatchEvent(pointer('pointerup', { clientX: 9, clientY: 9 }));
    expect(onTap).not.toHaveBeenCalled();
    unbind();
  });
});

describe('bindPrimaryPointerActivate', () => {
  it('dedupes hybrid pointer tap + click', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);

    el.dispatchEvent(pointer('pointerdown', { clientX: 1, clientY: 1 }));
    el.dispatchEvent(pointer('pointerup', { clientX: 1, clientY: 1 }));
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);

    unbind();
    el.remove();
  });

  it('allows click-only activation when no pointer session claimed', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const activate = vi.fn();
    const unbind = bindPrimaryPointerActivate(el, activate);

    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(1);

    unbind();
    el.remove();
  });
});

describe('suppressBoardContextMenu', () => {
  it('prevents default on contextmenu', () => {
    const el = document.createElement('div');
    const unbind = suppressBoardContextMenu(el);
    const ev = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    const prevented = !el.dispatchEvent(ev) || ev.defaultPrevented;
    expect(prevented).toBe(true);
    unbind();
  });
});
