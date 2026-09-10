import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';

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

describe('Ollie drop-inspect (Cycle-2 B)', () => {
  let owl: OwlComponent;
  let root: HTMLElement;
  let speakSpy: ReturnType<typeof vi.spyOn>;
  let dropTarget: HTMLElement;

  beforeEach(() => {
    owl = new OwlComponent();
    owl.init();
    root = owl.getElement()!;
    expect(root).toBeTruthy();

    dropTarget = document.createElement('div');
    dropTarget.className = 'cell';
    dropTarget.dataset.row = '2';
    dropTarget.dataset.col = '4';
    document.body.appendChild(dropTarget);

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

    speakSpy = vi.spyOn(owlSystem, 'speakNow').mockImplementation(() => undefined);
    // jsdom lacks elementFromPoint — install a stub then spy
    document.elementFromPoint = vi.fn(() => dropTarget) as typeof document.elementFromPoint;
  });

  afterEach(() => {
    owl.destroy();
    dropTarget.remove();
    vi.restoreAllMocks();
  });

  it('on real drag drop: hit-tests under owl, speaks STUB, snaps back', () => {
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 150, clientY: 500 });
    dispatchPointer(root, 'pointerup', { clientX: 150, clientY: 500 });

    expect(document.elementFromPoint).toHaveBeenCalledWith(150, 500);
    expect(speakSpy).toHaveBeenCalledTimes(1);
    const speech = speakSpy.mock.calls[0][0] as string;
    expect(speech).toContain('[STUB inspect]');
    expect(speech).toContain('row 2');
    expect(speech).toContain('column 4');

    // Snap-back still happens (Cycle-2 A)
    expect(root.style.left).toBe('');
    expect(root.style.top).toBe('');
    expect(owl.getIsDragging()).toBe(false);
  });

  it('does not speak on tap without drag threshold', () => {
    const character = root.querySelector('.owl-character')!;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    // Move under threshold (6px)
    dispatchPointer(root, 'pointermove', { clientX: 322, clientY: 31 });
    dispatchPointer(root, 'pointerup', { clientX: 322, clientY: 31 });

    expect(speakSpy).not.toHaveBeenCalled();
    expect(root.style.left).toBe('');
  });

  it('momentarily disables pointer-events for hit-test so owl does not block', () => {
    const character = root.querySelector('.owl-character')!;
    const peValues: string[] = [];

    document.elementFromPoint = vi.fn(() => {
      peValues.push(root.style.pointerEvents);
      return dropTarget;
    }) as typeof document.elementFromPoint;

    dispatchPointer(character, 'pointerdown', { clientX: 320, clientY: 30 });
    dispatchPointer(root, 'pointermove', { clientX: 100, clientY: 300 });
    dispatchPointer(root, 'pointerup', { clientX: 100, clientY: 300 });

    expect(peValues).toContain('none');
    // Restored after hit-test
    expect(root.style.pointerEvents).not.toBe('none');
  });
});

describe('owlSystem.speakNow', () => {
  afterEach(() => {
    owlSystem.dismissMessage();
    vi.useRealTimers();
  });

  it('sets bubble text immediately without MESSAGE_LIBRARY', () => {
    vi.useFakeTimers();
    owlSystem.speakNow('[STUB inspect] hello from drop', 'thinking');
    const state = owlSystem.getState();
    expect(state.message?.text).toBe('[STUB inspect] hello from drop');
    expect(state.mood).toBe('thinking');
    expect(state.message?.id).toMatch(/^ollie-inspect-stub-/);
  });
});
