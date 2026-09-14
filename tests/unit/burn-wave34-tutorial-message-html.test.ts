/**
 * Wave 34 — HTML message rendering + aria exit control.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-html', name: 'HTML', steps };
}

describe('Wave 34 tutorial — message HTML + a11y', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('renders HTML message content inside tooltip message node', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'html',
          title: 'Rich',
          message: '<p>Look for <strong>Tap here</strong></p>',
        },
      ])
    );
    const msg = document.querySelector(
      '.tutorial-tooltip-message'
    ) as HTMLElement;
    expect(msg.querySelector('strong')?.textContent).toBe('Tap here');
    expect(msg.querySelector('p')).toBeTruthy();
  });

  it('exit control exposes aria-label', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'm' }]));
    const exit = document.querySelector(
      '.tutorial-exit-btn'
    ) as HTMLButtonElement;
    expect(exit.getAttribute('aria-label')).toBe('Exit tutorial');
  });
});
