/**
 * Wave 34 — requiredAction gates Next button.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-gate', name: 'Gate', steps };
}

describe('Wave 34 tutorial — requiredAction Next gate', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('Next click is ignored while requiredAction is pending', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'need',
          title: 'Need',
          message: 'act',
          requiredAction: { type: 'click', selector: '.go' },
        },
        { id: 'after', title: 'After', message: 'ok' },
      ])
    );
    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(manager.getCurrentStep()?.id).toBe('need');
  });

  it('after handleAction satisfies gate, Next works on free step', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'need',
          title: 'Need',
          message: 'act',
          requiredAction: { type: 'click-cell', row: 0, col: 1 },
        },
        { id: 'free', title: 'Free', message: 'go' },
        { id: 'end', title: 'End', message: 'done' },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 0, col: 1 })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('free');
    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(manager.getCurrentStep()?.id).toBe('end');
  });
});
