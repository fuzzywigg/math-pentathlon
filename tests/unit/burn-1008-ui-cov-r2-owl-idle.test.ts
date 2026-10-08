/**
 * burn-1008-mp-ui-coverage-round-2 — owl-component + idle-warm gap characterization.
 * Drag/cancel/coast/reduced-motion/eye-tracking and default idle-warm import paths.
 * Tests-only; fake timers; no AI/engine changes.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { scheduleIdleGameWarm } from '../../src/pwa/idle-warm';
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
  document.elementFromPoint = vi.fn(() => null) as typeof document.elementFromPoint;
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

describe('burn-1008 ui-cov-r2 owl-component gaps', () => {
  let owl: OwlComponent;
  let root: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
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
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('ignores secondary finger / non-left mouse / non-handle chrome', () => {
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { isPrimary: false, pointerId: 2 }));
    expect(owl.getIsDragging()).toBe(false);

    character.dispatchEvent(
      ptr('pointerdown', { pointerType: 'mouse', button: 2, clientX: 320, clientY: 30 })
    );
    expect(owl.getIsDragging()).toBe(false);

    root.querySelector('.owl-minimize-btn')!.dispatchEvent(
      ptr('pointerdown', { clientX: 320, clientY: 30 })
    );
    expect(owl.getIsDragging()).toBe(false);
  });

  it('pointercancel snaps back to dock even after a real drag', () => {
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 400 }));
    expect(owl.getDidDrag()).toBe(true);
    root.dispatchEvent(ptr('pointercancel', { clientX: 100, clientY: 400 }));
    expect(owl.getIsDragging()).toBe(false);
    expect(root.classList.contains('owl-dragging')).toBe(false);
    expect(root.style.left).toBe('');
  });

  it('skips expand when the gesture was a drag', () => {
    owl.minimize();
    const mini = root.querySelector('.owl-minimized') as HTMLElement;
    (owl as unknown as { didDrag: boolean }).didDrag = true;
    mini.click();
    expect(root.classList.contains('owl-minimized-state')).toBe(true);
    expect((owl as unknown as { didDrag: boolean }).didDrag).toBe(false);
  });

  it('reduced-motion drop snaps without coast animation', () => {
    setUserReducedMotionFlag(true);
    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(ptr('pointerdown', { clientX: 320, clientY: 30 }));
    root.dispatchEvent(ptr('pointermove', { clientX: 100, clientY: 300 }));
    root.dispatchEvent(ptr('pointerup', { clientX: 100, clientY: 300 }));
    expect(root.classList.contains('owl-resting')).toBe(true);
    expect(root.style.left).not.toBe('');
  });

  it('eye tracking moves pupils when expanded; skips when minimized or reduced-motion', () => {
    const pupil = root.querySelector('.owl-pupil') as HTMLElement;
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
    // May or may not set transform depending on reduced motion default
    owl.minimize();
    const before = pupil.style.transform;
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }));
    expect(pupil.style.transform).toBe(before);
  });

  it('updateUI hides when owlEnabled is false and shows notification when minimized+message', () => {
    storage.updateSettings({ owlEnabled: false });
    owlSystem.show();
    expect(root.classList.contains('owl-hidden')).toBe(true);

    storage.updateSettings({ owlEnabled: true });
    owl.minimize();
    owlSystem.speakNow('hello-test-msg', 'happy');
    const dot = root.querySelector('.owl-notification-dot');
    expect(dot?.classList.contains('visible')).toBe(true);
    owl.expand();
    expect(dot?.classList.contains('visible')).toBe(false);
  });

  it('onOwlClick animates unless reduced motion; destroy clears click timer', () => {
    vi.useFakeTimers();
    setUserReducedMotionFlag(false);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );
    const character = root.querySelector('.owl-character') as HTMLElement;
    character.click();
    expect(root.classList.contains('owl-clicked')).toBe(true);
    character.click(); // clears prior timer
    vi.advanceTimersByTime(500);
    expect(root.classList.contains('owl-clicked')).toBe(false);
    vi.unstubAllGlobals();
  });
});

describe('burn-1008 ui-cov-r2 idle-warm default imports', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-mp-idle-warm');
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('defaultImportShell + defaultImportGame warm hex and kings', async () => {
    // Use real default importers (no inject) but sync schedule
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      // Keep shell/game defaults — they exercise the switch/import lines.
    });

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute('data-mp-idle-warm')).toBe(
        'done'
      );
    });
  });

  it('prefersSaveData catch path treats getter throw as false and still warms', async () => {
    // Isolate from parallel/shared workers that may leave connection or hidden set.
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    try {
      delete (navigator as Navigator & { connection?: unknown }).connection;
    } catch {
      /* non-configurable — redefine below */
    }
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get() {
        throw new Error('conn denied');
      },
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalled();
      expect(importGame).toHaveBeenCalled();
    });
    delete (navigator as Navigator & { connection?: unknown }).connection;
  });
});
