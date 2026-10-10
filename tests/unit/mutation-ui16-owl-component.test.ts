/**
 * q-mp-478 mutation audit UI wave 16 — kill / re-pin first-20 survivors in
 * ui/owl/owl-component. Structural / numeric field-init pins only — no
 * player-facing speech/copy asserts.
 *
 * Wave-5 left drag-offset / velocity field inits (0→1) as equivalent under
 * pointerdown overwrite. Post914 first-20 window also includes cachedSize /
 * eyeCenter field inits (file grew); pin them on a fresh instance before init
 * so NumericBoundary / BooleanLiteral mutants stay detectable.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

/** Compile-time-private fields are still enumerable at runtime for tests. */
type OwlInitFields = {
  isMinimized: boolean;
  isDragging: boolean;
  didDrag: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  dragStartX: number;
  dragStartY: number;
  lastPosX: number;
  lastPosY: number;
  velocityX: number;
  velocityY: number;
  cachedSizeW: number;
  cachedSizeH: number;
  eyeCenterValid: boolean;
  cachedEyeCenterX: number;
  cachedEyeCenterY: number;
};

function initFields(owl: OwlComponent): OwlInitFields {
  return owl as unknown as OwlInitFields;
}

function dispatchPointer(
  el: Element,
  type: string,
  init: Partial<PointerEventInit> & { clientX: number; clientY: number }
): void {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    ...init,
  });
  el.dispatchEvent(event);
}

function stubPointer(root: HTMLElement): void {
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
    x: 300,
    y: 8,
    left: 300,
    top: 8,
    right: 364,
    bottom: 72,
    width: 64,
    height: 64,
    toJSON: () => ({}),
  });
  if (!root.setPointerCapture) {
    root.setPointerCapture = vi.fn();
  } else {
    vi.spyOn(root, 'setPointerCapture').mockImplementation(() => undefined);
  }
  if (!root.releasePointerCapture) {
    root.releasePointerCapture = vi.fn();
  } else {
    vi.spyOn(root, 'releasePointerCapture').mockImplementation(() => undefined);
  }
  if (!root.hasPointerCapture) {
    root.hasPointerCapture = vi.fn(() => true);
  } else {
    vi.spyOn(root, 'hasPointerCapture').mockReturnValue(true);
  }
  document.elementFromPoint = vi.fn(
    () => null
  ) as typeof document.elementFromPoint;
}

describe('mutation-ui16 owl-component', () => {
  let owl: OwlComponent;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
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
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('field inits: drag offsets / starts / velocity are exactly 0 before init', () => {
    // Survivors: L26–L35 NumericBoundary 0 → 1 (overwritten on pointerdown,
    // but first-20 window is dominated by these inits — pin pre-init state).
    const f = initFields(owl);
    expect(f.dragOffsetX).toBe(0);
    expect(f.dragOffsetY).toBe(0);
    expect(f.dragStartX).toBe(0);
    expect(f.dragStartY).toBe(0);
    expect(f.lastPosX).toBe(0);
    expect(f.lastPosY).toBe(0);
    expect(f.velocityX).toBe(0);
    expect(f.velocityY).toBe(0);
  });

  it('field inits: cachedSize defaults are exactly 64×64 before measure', () => {
    // Survivors: L44/L45 NumericBoundary 64 → 65 / 63.
    const f = initFields(owl);
    expect(f.cachedSizeW).toBe(64);
    expect(f.cachedSizeH).toBe(64);
  });

  it('field inits: eye-center cache is invalid with zero centers', () => {
    // Survivors: L49 false → true; L50/L51 0 → 1.
    const f = initFields(owl);
    expect(f.eyeCenterValid).toBe(false);
    expect(f.cachedEyeCenterX).toBe(0);
    expect(f.cachedEyeCenterY).toBe(0);
  });

  it('field inits: minimize / drag flags false before init', () => {
    // Re-pin L20/L23/L24 BooleanLiteral false → true (wave-5 hold).
    const f = initFields(owl);
    expect(f.isMinimized).toBe(false);
    expect(f.isDragging).toBe(false);
    expect(f.didDrag).toBe(false);
    expect(owl.getIsDragging()).toBe(false);
    expect(owl.getDidDrag()).toBe(false);
  });

  it('drag threshold stays exactly 6px (5 is tap; 6 starts drag)', () => {
    // Re-pin L15 NumericBoundary 6 → 5 / 6 → 7.
    owl.init();
    const root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 325, clientY: 30 }); // Δ=5
    dispatchPointer(root, 'pointerup', { clientX: 325, clientY: 30 });
    expect(owl.getDidDrag()).toBe(false);

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 326, clientY: 30 }); // Δ=6
    expect(owl.getDidDrag()).toBe(true);
    dispatchPointer(root, 'pointerup', { clientX: 326, clientY: 30 });
    expect(root.classList.contains('owl-resting')).toBe(true);
  });
});
