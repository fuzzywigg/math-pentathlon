/**
 * Wave 40 — tutorial inactive next/prev/refresh/handleAction no-ops.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager } from '../../src/core/tutorial';

describe('Wave 40 tutorial — inactive no-ops', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('next/prev/refresh/handleAction do nothing before start', () => {
    manager = new TutorialManager();
    expect(manager.getIsActive()).toBe(false);
    manager.nextStep();
    manager.prevStep();
    manager.refreshHighlight();
    expect(manager.handleAction('click-cell', { row: 1, col: 1 })).toBe(false);
    expect(manager.handleAction('click', { selector: '.x' })).toBe(false);
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
    expect(manager.getCurrentStep()).toBeNull();
    expect(manager.getCurrentStepIndex()).toBe(0);
  });

  it('after exit navigation stays a no-op and DOM stays cleared', () => {
    manager = new TutorialManager();
    manager.start({
      id: 'w40-inactive',
      name: 'Inactive',
      steps: [
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ],
    });
    manager.exit();
    expect(manager.getIsActive()).toBe(false);
    expect(manager.getCurrentStep()).toBeNull();
    expect(manager.getTotalSteps()).toBe(0);

    manager.nextStep();
    manager.prevStep();
    manager.refreshHighlight();
    expect(manager.handleAction('click', { selector: '.x' })).toBe(false);
    expect(document.querySelector('.tutorial-tooltip')).toBeNull();
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
  });

  it('prevStep at index 0 is a no-op while active', () => {
    manager = new TutorialManager();
    manager.start({
      id: 'w40-prev0',
      name: 'Prev0',
      steps: [
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ],
    });
    manager.prevStep();
    expect(manager.getCurrentStepIndex()).toBe(0);
    expect(manager.getCurrentStep()?.id).toBe('a');
  });
});
