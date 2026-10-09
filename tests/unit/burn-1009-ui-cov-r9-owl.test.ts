/**
 * q-mp-196 / UI coverage round 9 — residual `src/ui/owl` characterization.
 * Pointer/coast/mood/reduced-motion arms not locked by r2/r6/r7.
 * Tests-only; no AI choice/timing or player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OwlComponent, owlComponent } from '../../src/ui/owl';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';

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
  root.setPointerCapture = vi.fn();
  root.releasePointerCapture = vi.fn();
  root.hasPointerCapture = vi.fn(() => true);
  document.elementFromPoint = vi.fn(
    () => null
  ) as typeof document.elementFromPoint;
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

describe('q-mp-196 ui-cov-r9 owl-component residuals', () => {
  let owl: OwlComponent;
  let root: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    setUserReducedMotionFlag(false);
    owlSystem.hide();
    owlSystem.dismissMessage();
    document.body.innerHTML = '';
    owl = new OwlComponent();
    owl.init();
    root = owl.getElement()!;
    stubPointer(root);
  });

  afterEach(() => {
    owl.destroy();
    owlComponent.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
    setUserReducedMotionFlag(false);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('ignores second primary pointerdown while already dragging', () => {
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);

    character.dispatchEvent(
      ptr('pointerdown', {
        pointerId: 3,
        clientX: 340,
        clientY: 40,
      })
    );
    expect(owl.getIsDragging()).toBe(true);
    expect(root.classList.contains('owl-dragging')).toBe(true);
  });

  it('ignores foreign pointerId on move / up / cancel', () => {
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));

    root.dispatchEvent(
      ptr('pointermove', { pointerId: 9, clientX: 100, clientY: 400 })
    );
    expect(owl.getDidDrag()).toBe(false);
    expect(root.style.left).toBe('300px');

    root.dispatchEvent(
      ptr('pointerup', { pointerId: 9, clientX: 100, clientY: 400 })
    );
    expect(owl.getIsDragging()).toBe(true);

    root.dispatchEvent(
      ptr('pointercancel', { pointerId: 9, clientX: 100, clientY: 400 })
    );
    expect(owl.getIsDragging()).toBe(true);

    root.dispatchEvent(ptr('pointerup', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(false);
  });

  it('setPointerCapture throw still starts drag; hasPointerCapture false skips release', () => {
    root.setPointerCapture = vi.fn(() => {
      throw new Error('capture gone');
    });
    root.hasPointerCapture = vi.fn(() => false);

    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);
    expect(root.classList.contains('owl-dragging')).toBe(true);

    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 300 }));
    expect(owl.getDidDrag()).toBe(true);
    root.dispatchEvent(ptr('pointerup', { clientX: 200, clientY: 300 }));
    expect(owl.getIsDragging()).toBe(false);
    expect(root.releasePointerCapture).not.toHaveBeenCalled();
  });

  it('releasePointerCapture throw on up and cancel is swallowed', () => {
    root.releasePointerCapture = vi.fn(() => {
      throw new Error('already released');
    });
    const character = root.querySelector('.owl-character')!;

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 180, clientY: 280 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 180, clientY: 280 }));
    expect(owl.getIsDragging()).toBe(false);

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 160, clientY: 260 }));
    root.dispatchEvent(ptr('pointercancel', { clientX: 160, clientY: 260 }));
    expect(owl.getIsDragging()).toBe(false);
    expect(root.style.left).toBe('');
  });

  it('missing elementFromPoint still inspects drop with null under-target', () => {
    const speakSpy = vi
      .spyOn(owlSystem, 'speakNow')
      .mockImplementation(() => undefined);
    const original = document.elementFromPoint;
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: undefined,
    });

    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 120, clientY: 400 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 120, clientY: 400 }));

    expect(speakSpy).toHaveBeenCalled();
    expect(speakSpy.mock.calls[0]?.[1]).toBe('thinking');
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: original,
    });
  });

  it('near-zero release velocity rests without scheduling coast raf', () => {
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const character = root.querySelector('.owl-character')!;

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    // Cross threshold…
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 200 }));
    // …then settle with a final move that yields ~0 Δ for velocity.
    root.dispatchEvent(ptr('pointermove', { clientX: 200, clientY: 200 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 200, clientY: 200 }));

    expect(owl.getDidDrag()).toBe(true);
    expect(root.classList.contains('owl-resting')).toBe(true);
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('vertical edge clamp zeros vy while coasting then rests', async () => {
    vi.useFakeTimers();
    const character = root.querySelector('.owl-character')!;

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    for (let i = 0; i < 6; i++) {
      root.dispatchEvent(
        ptr('pointermove', { clientX: 320, clientY: 30 - i * 20 })
      );
    }
    root.dispatchEvent(ptr('pointerup', { clientX: 320, clientY: -80 }));

    expect(root.classList.contains('owl-resting')).toBe(true);
    for (let i = 0; i < 40; i++) {
      await vi.advanceTimersByTimeAsync(16);
    }
    expect(root.style.top).not.toBe('');
  });

  it('mood class matrix + same-message textContent rewrite skip', () => {
    owlSystem.show();
    const moods = [
      'happy',
      'encouraging',
      'celebrating',
      'thinking',
      'sleepy',
      'proud',
    ] as const;
    for (const mood of moods) {
      owlSystem.speakNow('r9-stable-msg', mood);
      expect(root.classList.contains(`owl-mood-${mood}`)).toBe(true);
      for (const other of moods) {
        if (other !== mood) {
          expect(root.classList.contains(`owl-mood-${other}`)).toBe(false);
        }
      }
    }

    const messageEl = root.querySelector('.owl-message') as HTMLElement;
    const before = messageEl.textContent;
    expect(typeof before).toBe('string');
    expect(before!.length).toBeGreaterThan(0);
    // Same text again — updateUI must not churn aria-live content.
    owlSystem.speakNow('r9-stable-msg', 'happy');
    expect(messageEl.textContent).toBe(before);
  });

  it('reduced-motion skips click bounce and pupil tracking', () => {
    setUserReducedMotionFlag(true);
    const character = root.querySelector('.owl-character') as HTMLElement;
    const pupil = root.querySelector('.owl-pupil') as HTMLElement;

    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(false);

    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
    );
    expect(pupil.style.transform).toBe('');
  });

  it('pupil tracking skips while dragging; destroy clears click bounce timer', () => {
    vi.useFakeTimers();
    const character = root.querySelector('.owl-character') as HTMLElement;
    const pupil = root.querySelector('.owl-pupil') as HTMLElement;

    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(true);
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 10, clientY: 10 })
    );
    expect(pupil.style.transform).toBe('');

    root.dispatchEvent(ptr('pointerup', { clientX: 320, clientY: 30 }));
    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(true);
    owl.destroy();
    expect(owl.getElement()).toBeNull();
    // Timer fire after destroy must not throw / resurrect class on missing node.
    vi.advanceTimersByTime(500);
  });

  it('character click after drag is ignored; bubble is not a drag handle', () => {
    const character = root.querySelector('.owl-character') as HTMLElement;
    (owl as unknown as { didDrag: boolean }).didDrag = true;
    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(false);
    expect((owl as unknown as { didDrag: boolean }).didDrag).toBe(false);

    const bubble = root.querySelector('.owl-bubble')!;
    bubble.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    expect(owl.getIsDragging()).toBe(false);
  });

  it('index barrel re-exports singleton and class', () => {
    expect(typeof OwlComponent).toBe('function');
    expect(owlComponent).toBeInstanceOf(OwlComponent);
    owlComponent.destroy();
    owlComponent.init();
    expect(owlComponent.getElement()?.id).toBe('ollie-owl');
    owlComponent.destroy();
    expect(owlComponent.getElement()).toBeNull();
  });
});
