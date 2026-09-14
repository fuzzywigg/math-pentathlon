/**
 * Wave 34 — position enum smoke across top/bottom/left/right.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

const POSITIONS = ['top', 'bottom', 'left', 'right'] as const;

describe('Wave 34 tutorial — position enum', () => {
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

  it.each(POSITIONS)('mounts tooltip for position=%s', (position) => {
    manager = new TutorialManager();
    target = document.createElement('div');
    target.className = 'pos-target';
    Object.defineProperty(target, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100,
        top: 100,
        right: 140,
        bottom: 140,
        width: 40,
        height: 40,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(target);

    const config: TutorialConfig = {
      id: `wave34-pos-${position}`,
      name: 'Pos',
      steps: [
        {
          id: 'p',
          title: 'P',
          message: 'm',
          highlightSelector: '.pos-target',
          position,
        },
      ],
    };
    manager.start(config);
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(manager.getCurrentStep()?.position).toBe(position);
    target.remove();
  });
});
