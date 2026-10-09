/**
 * q-mp-197 — owl-component layout-read cut characterization.
 * Asserts coast ticks do not re-enter getBoundingClientRect; eyes rAF-coalesce.
 * No AI / copy / timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';

function stubPointer(root: HTMLElement): { reads: { n: number } } {
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
    };
  });
  root.setPointerCapture = vi.fn();
  root.releasePointerCapture = vi.fn();
  root.hasPointerCapture = vi.fn(() => true);
  document.elementFromPoint = vi.fn(
    () => null
  ) as typeof document.elementFromPoint;
  return { reads };
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

describe('q-mp-197 owl-component layout reads', () => {
  let owl: OwlComponent;
  let root: HTMLElement;
  let reads: { n: number };

  beforeEach(() => {
    setUserReducedMotionFlag(false);
    document.body.innerHTML = '';
    owl = new OwlComponent();
    owl.init();
    root = owl.getElement()!;
    ({ reads } = stubPointer(root));
  });

  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('coast ticks reuse size cache (no per-frame getBoundingClientRect)', async () => {
    vi.useFakeTimers();
    const character = root.querySelector('.owl-character')!;

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    // Large moves → didDrag + velocity so coast runs several rAF ticks
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 200 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 80, clientY: 400 }));
    const afterDrag = reads.n;

    root.dispatchEvent(ptr('pointerup', { clientX: 80, clientY: 400 }));
    const afterUp = reads.n;

    // Advance many coast frames; pre-fix each tick read width+height (2×/frame).
    await vi.advanceTimersByTimeAsync(500);
    const duringCoast = reads.n - afterUp;

    // pointerdown: 1 read; startCoast refreshSizeCache: 1 read; ticks: 0.
    expect(afterDrag).toBeGreaterThanOrEqual(1);
    expect(afterUp - afterDrag).toBeLessThanOrEqual(1);
    expect(duringCoast).toBe(0);
    expect(root.classList.contains('owl-resting')).toBe(true);
  });

  it('eye tracking coalesces mousemove into one rAF layout refresh when docked', async () => {
    vi.useFakeTimers();
    const before = reads.n;
    for (let i = 0; i < 20; i += 1) {
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 10 + i, clientY: 20 + i })
      );
    }
    expect(reads.n).toBe(before); // scheduled only
    await vi.advanceTimersByTimeAsync(32);
    // One docked center measure for the coalesced frame (not 20).
    expect(reads.n - before).toBeLessThanOrEqual(1);
  });
});
