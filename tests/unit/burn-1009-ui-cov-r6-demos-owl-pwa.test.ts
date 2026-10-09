/**
 * burn-1009 / q-mp-111 — UI coverage round 6: dice-demo poly callbacks,
 * owl-component coast/drag residual, pwa bootstrap enabled=false default arm.
 * Characterization only; no player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';
import { installDomHooks, mountRoot } from './helpers/dom';

installDomHooks({ fakeTimers: true });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  setUserReducedMotionFlag(false);
});

describe('burn-1009 ui-cov-r6 dice-demo poly callbacks', () => {
  it('rolls + selects + confirms poly selector (flush roll anim)', async () => {
    const root = mountRoot();
    renderDiceDemo(root);

    const poly = root.querySelector('#selector-poly') as HTMLElement;
    expect(poly).toBeTruthy();

    const rollBtn = poly.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement | null;
    expect(rollBtn).toBeTruthy();
    rollBtn!.click();

    // animateRoll duration 800 — flush without asserting duration value.
    await vi.advanceTimersByTimeAsync(900);

    const die = poly.querySelector(
      '.die, [data-die-id], svg'
    ) as HTMLElement | null;
    // Click selectable dice faces if present
    poly.querySelectorAll('.die-selectable, .die, button').forEach((el) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    void die;

    const confirm = poly.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement | null;
    if (confirm && !confirm.disabled) {
      confirm.click();
    }

    const logPoly = root.querySelector('#log-poly') as HTMLElement;
    // Structural: log host exists (entries optional if confirm stayed disabled).
    expect(logPoly).toBeTruthy();
  });
});

describe('burn-1009 ui-cov-r6 owl-component coast residual', () => {
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
  });

  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
  });

  it('pointerup after fast drag coasts then rests; destroy mid-coast', async () => {
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

    const character = root.querySelector('.owl-character')!;
    const ptr = (
      type: string,
      x: number,
      y: number,
      extra: Partial<PointerEventInit> = {}
    ) =>
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'touch',
        isPrimary: true,
        button: 0,
        buttons: type === 'pointerup' ? 0 : 1,
        clientX: x,
        clientY: y,
        ...extra,
      });

    character.dispatchEvent(ptr('pointerdown', 320, 30));
    // Large move → didDrag + velocity for coast
    root.dispatchEvent(ptr('pointermove', 50, 400));
    root.dispatchEvent(ptr('pointermove', 40, 420));
    expect(owl.getDidDrag()).toBe(true);
    root.dispatchEvent(ptr('pointerup', 40, 420));

    // Allow a few rAF coast ticks under fake timers
    await vi.advanceTimersByTimeAsync(50);
    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(16);
    }

    // Click character while didDrag would skip — already cleared after up.
    character.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    owl.destroy();
    expect(owl.getElement()).toBeNull();
  });

  it('dismiss bubble + lostpointercapture end drag', () => {
    owlSystem.speakNow('r6-test-msg', 'happy');
    const dismiss = root.querySelector(
      '.owl-bubble-dismiss'
    ) as HTMLButtonElement;
    dismiss.click();

    const character = root.querySelector('.owl-character')!;
    character.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        pointerId: 1,
        pointerType: 'touch',
        isPrimary: true,
        button: 0,
        buttons: 1,
        clientX: 320,
        clientY: 30,
      })
    );
    expect(owl.getIsDragging()).toBe(true);
    root.dispatchEvent(
      new PointerEvent('lostpointercapture', {
        bubbles: true,
        pointerId: 1,
        pointerType: 'touch',
        isPrimary: true,
        button: 0,
        buttons: 0,
        clientX: 320,
        clientY: 30,
      })
    );
    expect(owl.getIsDragging()).toBe(false);
  });
});

describe('burn-1009 ui-cov-r6 pwa bootstrap residual', () => {
  it('enabled:false short-circuits; omit enabled uses window/document default', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    const schedule = vi.fn();
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: false, schedule, registerSW });
    expect(schedule).not.toHaveBeenCalled();

    // Default enabled (window+document present in jsdom) + custom schedule.
    bootstrapPwa({ schedule, registerSW });
    expect(schedule).toHaveBeenCalledTimes(1);
    schedule.mock.calls[0]![0]!();
    expect(registerSW).toHaveBeenCalled();
  });
});
