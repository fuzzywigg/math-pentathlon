/**
 * Wave 34 — counter text exact format across steps.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-counter', name: 'Counter', steps };
}

describe('Wave 34 tutorial — step counter format', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('formats Step i of N for each index', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
        { id: 's2', title: 'C', message: 'c' },
      ])
    );
    const counter = () =>
      (document.querySelector('.tutorial-step-counter') as HTMLElement)
        .textContent;
    expect(counter()).toBe('Step 1 of 3');
    manager.nextStep();
    expect(counter()).toBe('Step 2 of 3');
    manager.nextStep();
    expect(counter()).toBe('Step 3 of 3');
  });
});
