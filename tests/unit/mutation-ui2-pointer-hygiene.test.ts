import { describe, expect, it } from 'vitest';
import {
  POINTER_TAP_SLOP_PX,
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

describe('mutation-ui2 pointer-hygiene survivors', () => {
  it('exports slop constant exactly 16', () => {
    expect(POINTER_TAP_SLOP_PX).toBe(16);
  });

  it('default slop cancels at >16px and allows movement of exactly 16', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    tap.onPointerMove(pointer('pointermove', { clientX: 16, clientY: 0 }));
    expect(tap.getState().phase).toBe('pending');
    expect(
      tap.onPointerUp(pointer('pointerup', { clientX: 16, clientY: 0 }))
    ).toBe(true);

    const tap2 = createPointerTapController();
    tap2.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    tap2.onPointerMove(pointer('pointermove', { clientX: 17, clientY: 0 }));
    expect(tap2.getState().phase).toBe('cancelled');
  });

  it('requirePrimary defaults true; false allows secondary finger start', () => {
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

  it('initial state startX/startY are 0 before any pointerdown', () => {
    const tap = createPointerTapController();
    expect(tap.getState().startX).toBe(0);
    expect(tap.getState().startY).toBe(0);
    expect(tap.getState().pointerId).toBeNull();
    expect(tap.getState().claimed).toBe(false);
  });

  it('reset restores numeric zeros and clears claimed', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 9, clientY: 4 }));
    tap.markClaimed();
    expect(tap.getState().claimed).toBe(true);
    tap.reset();
    const s = tap.getState();
    expect(s.phase).toBe('idle');
    expect(s.pointerId).toBeNull();
    expect(s.startX).toBe(0);
    expect(s.startY).toBe(0);
    expect(s.claimed).toBe(false);
  });

  it('records start coordinates from the down event (not forced zeros)', () => {
    const tap = createPointerTapController();
    tap.onPointerDown(pointer('pointerdown', { clientX: 3, clientY: 5 }));
    expect(tap.getState().startX).toBe(3);
    expect(tap.getState().startY).toBe(5);
  });
});
