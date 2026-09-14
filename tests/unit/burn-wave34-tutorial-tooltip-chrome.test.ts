/**
 * Wave 34 — tooltip chrome (counter / title / message / buttons).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-chrome', name: 'Chrome', steps };
}

describe('Wave 34 tutorial — tooltip chrome', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('renders step counter title and message for step 1 of N', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'Hello', message: 'World body' },
        { id: 's1', title: 'Next', message: 'Later' },
      ])
    );
    const tooltip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(
      tooltip.querySelector('.tutorial-step-counter')?.textContent
    ).toMatch(/1/);
    expect(tooltip.querySelector('.tutorial-tooltip-title')?.textContent).toBe(
      'Hello'
    );
    expect(
      tooltip.querySelector('.tutorial-tooltip-message')?.textContent
    ).toContain('World');
  });

  it('updates counter when advancing', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    manager.nextStep();
    const counter = document.querySelector(
      '.tutorial-step-counter'
    ) as HTMLElement;
    expect(counter.textContent).toMatch(/2/);
    expect(document.querySelector('.tutorial-tooltip-title')?.textContent).toBe(
      'B'
    );
  });

  it('Next button advances when no requiredAction', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(manager.getCurrentStep()?.id).toBe('s1');
  });

  it('Back button walks to previous step', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    manager.nextStep();
    (document.querySelector('.tutorial-prev-btn') as HTMLButtonElement).click();
    expect(manager.getCurrentStep()?.id).toBe('s0');
  });
});
