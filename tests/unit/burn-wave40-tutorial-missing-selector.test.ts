/**
 * Wave 40 — tutorial missing highlightSelector clears ring leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'w40-miss', name: 'Miss', steps };
}

describe('Wave 40 tutorial — missing selector', () => {
  let manager: TutorialManager;
  let target: HTMLElement;

  afterEach(() => {
    manager?.exit();
    target?.remove();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('missing highlightSelector clears ring and clip-path', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'ghost',
          title: 'Ghost',
          message: 'no target',
          highlightSelector: '#w40-does-not-exist',
        },
      ])
    );

    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('none');
    expect(ring.classList.contains('tutorial-highlight-ring--action')).toBe(
      false
    );
    const backdrop = document.querySelector(
      '.tutorial-backdrop'
    ) as HTMLElement;
    expect(backdrop.style.clipPath).toBe('none');
  });

  it('advancing from present selector to missing clears stale ring', () => {
    target = document.createElement('button');
    target.className = 'w40-live-target';
    Object.defineProperty(target, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 20,
        top: 20,
        right: 60,
        bottom: 40,
        width: 40,
        height: 20,
        x: 20,
        y: 20,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(target);

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'live',
          title: 'Live',
          message: 'here',
          highlightSelector: '.w40-live-target',
        },
        {
          id: 'gone',
          title: 'Gone',
          message: 'missing',
          highlightSelector: '.w40-never-in-dom',
        },
      ])
    );

    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('block');

    manager.nextStep();
    expect(manager.getCurrentStep()?.id).toBe('gone');
    expect(ring.style.display).toBe('none');
    const backdrop = document.querySelector(
      '.tutorial-backdrop'
    ) as HTMLElement;
    expect(backdrop.style.clipPath).toBe('none');
  });

  it('no highlightSelector also clears ring via center path', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 'center', title: 'C', message: 'mid', position: 'center' }])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('none');
  });
});
