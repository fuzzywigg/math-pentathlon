/**
 * Wave 34 — highlight selector present / missing / center position.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-hl', name: 'HL', steps };
}

describe('Wave 34 tutorial — highlight matrix', () => {
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

  it('shows ring when selector exists', () => {
    manager = new TutorialManager();
    target = document.createElement('button');
    target.className = 'hl-target';
    document.body.appendChild(target);
    manager.start(
      cfg([
        {
          id: 'h',
          title: 'H',
          message: 'm',
          highlightSelector: '.hl-target',
          position: 'bottom',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('block');
  });

  it('hides ring when selector missing', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'h',
          title: 'H',
          message: 'm',
          highlightSelector: '.never-present',
          position: 'top',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('none');
  });

  it('center position still mounts tooltip', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'c',
          title: 'Center',
          message: 'mid',
          position: 'center',
        },
      ])
    );
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(manager.getCurrentStep()?.position).toBe('center');
  });
});
