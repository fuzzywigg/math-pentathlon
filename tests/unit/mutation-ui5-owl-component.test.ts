/**
 * q-mp-202 mutation audit UI wave 5 — kill survivors in ui/owl/owl-component.
 * Structural drag/init pins — no player-facing speech/copy asserts.
 * Orthogonal to open #715 (q-mp-196 coverage characterization).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

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

describe('mutation-ui5 owl-component', () => {
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

  it('field inits: dragging/didDrag false before init (destroy not yet run)', () => {
    // Survivors: L23/L24 BooleanLiteral false → true on field inits.
    // init()→destroy() resets them; assert on a fresh instance first.
    const fresh = new OwlComponent();
    expect(fresh.getIsDragging()).toBe(false);
    expect(fresh.getDidDrag()).toBe(false);
  });

  it('isMinimized field init false: message without minimize hides notification dot', () => {
    // Survivor: L20 BooleanLiteral false → true — flag true without DOM class.
    owl.init();
    const root = owl.getElement()!;
    expect(root.classList.contains('owl-minimized-state')).toBe(false);
    owlSystem.show();
    owlSystem.speakNow('mutation-ui5 ping', 'thinking');
    const dot = root.querySelector('.owl-notification-dot');
    expect(dot?.classList.contains('visible')).toBe(false);
  });

  it('drag threshold is exactly 6px (5 stays tap; 6 starts real drag)', () => {
    // Survivors: L15 NumericBoundary 6 → 5 / 6 → 7 on DRAG_THRESHOLD_PX.
    owl.init();
    const root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 325, clientY: 30 }); // Δ=5
    dispatchPointer(root, 'pointerup', { clientX: 325, clientY: 30 });
    expect(owl.getDidDrag()).toBe(false);
    expect(root.classList.contains('owl-resting')).toBe(false);

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 326, clientY: 30 }); // Δ=6
    expect(owl.getDidDrag()).toBe(true);
    dispatchPointer(root, 'pointerup', { clientX: 326, clientY: 30 });
    expect(root.classList.contains('owl-resting')).toBe(true);
  });

  it('null pointer target is not a drag handle (isDragHandle early false)', () => {
    // Survivors: L173 `||` → `&&`; L174 `return false` → true.
    owl.init();
    const root = owl.getElement()!;
    stubPointer(root);
    const evt = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: 320,
      clientY: 30,
    });
    Object.defineProperty(evt, 'target', { get: () => null });
    expect(() => root.dispatchEvent(evt)).not.toThrow();
    expect(owl.getIsDragging()).toBe(false);
  });

  it('after drag, character click skip clears didDrag so next click animates', () => {
    // Survivor: L154 `this.didDrag = false` → true leaves skip sticky.
    vi.useFakeTimers();
    owl.init();
    const root = owl.getElement()!;
    stubPointer(root);
    const character = root.querySelector('.owl-character') as HTMLElement;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 200, clientY: 400 });
    dispatchPointer(root, 'pointerup', { clientX: 200, clientY: 400 });
    expect(owl.getDidDrag()).toBe(true);

    // First click after drag: skipped, should clear didDrag.
    character.click();
    expect(owl.getDidDrag()).toBe(false);
    expect(root.classList.contains('owl-clicked')).toBe(false);

    // Second click: must run onOwlClick.
    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(true);
    vi.runAllTimers();
  });
});
