import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';

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

describe('Ollie drag shell (Cycle-2 A)', () => {
  let owl: OwlComponent;
  let root: HTMLElement;

  beforeEach(() => {
    owl = new OwlComponent();
    owl.init();
    root = owl.getElement()!;
    expect(root).toBeTruthy();

    // jsdom: stable dock rect + pointer capture stubs
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

    // Cycle-2 B hit-test: jsdom has no elementFromPoint
    document.elementFromPoint = vi.fn(() => null) as typeof document.elementFromPoint;
  });

  afterEach(() => {
    owl.destroy();
    vi.restoreAllMocks();
  });

  it('moves Ollie with pointer capture while dragging', () => {
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    expect(owl.getIsDragging()).toBe(true);
    expect(root.classList.contains('owl-dragging')).toBe(true);
    expect(root.setPointerCapture).toHaveBeenCalledWith(1);
    // Position locked immediately so transform-origin switch does not jump
    expect(root.style.left).toBe('300px');
    expect(root.style.top).toBe('8px');

    dispatchPointer(root, 'pointermove', { clientX: 200, clientY: 400 });
    expect(root.style.left).toBe('180px'); // 200 - (320-300)
    expect(root.style.top).toBe('378px'); // 400 - (30-8)
    expect(root.style.right).toBe('auto');
    expect(root.style.bottom).toBe('auto');
  });

  it('snaps back to dock on pointerup', () => {
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 150, clientY: 500 });
    expect(root.style.left).not.toBe('');

    dispatchPointer(root, 'pointerup', { clientX: 150, clientY: 500 });
    expect(owl.getIsDragging()).toBe(false);
    expect(root.classList.contains('owl-dragging')).toBe(false);
    expect(root.style.left).toBe('');
    expect(root.style.top).toBe('');
    expect(root.style.right).toBe('');
    expect(root.style.bottom).toBe('');
  });

  it('snaps back to dock on pointercancel', () => {
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 100, clientY: 300 });
    dispatchPointer(root, 'pointercancel', { clientX: 100, clientY: 300 });

    expect(root.style.left).toBe('');
    expect(root.style.top).toBe('');
    expect(owl.getIsDragging()).toBe(false);
  });

  it('does not start drag from bubble chrome', () => {
    const bubble = root.querySelector('.owl-bubble')!;
    // Make bubble a valid EventTarget under character tree checks
    dispatchPointer(bubble, 'pointerdown', { clientX: 200, clientY: 20 });
    expect(owl.getIsDragging()).toBe(false);
    expect(root.classList.contains('owl-dragging')).toBe(false);
  });

  it('snapBackToDock clears inline position', () => {
    root.style.left = '10px';
    root.style.top = '20px';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    owl.snapBackToDock();
    expect(root.style.left).toBe('');
    expect(root.style.top).toBe('');
  });
});
