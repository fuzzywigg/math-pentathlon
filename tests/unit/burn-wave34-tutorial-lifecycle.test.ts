/**
 * Wave 34 — TutorialManager start / inactive getters / empty config.
 * Deepens tutorial core beyond tutorial.test.ts chrome + wave 22 runtime.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-life', name: 'Life', steps };
}

describe('Wave 34 tutorial — inactive defaults', () => {
  it('reports inactive null step / zero index / zero total before start', () => {
    const manager = new TutorialManager();
    expect(manager.getIsActive()).toBe(false);
    expect(manager.getCurrentStep()).toBeNull();
    expect(manager.getCurrentStepIndex()).toBe(0);
    expect(manager.getTotalSteps()).toBe(0);
  });
});

describe('Wave 34 tutorial — start activates first step', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('start sets active, index 0, and total from config', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: 'first' },
        { id: 'b', title: 'B', message: 'second' },
      ])
    );
    expect(manager.getIsActive()).toBe(true);
    expect(manager.getCurrentStepIndex()).toBe(0);
    expect(manager.getTotalSteps()).toBe(2);
    expect(manager.getCurrentStep()?.id).toBe('a');
    expect(document.querySelector('.tutorial-overlay')).toBeTruthy();
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
  });

  it('empty steps still activates with null current step', () => {
    manager = new TutorialManager();
    manager.start(cfg([]));
    expect(manager.getIsActive()).toBe(true);
    expect(manager.getTotalSteps()).toBe(0);
    expect(manager.getCurrentStep()).toBeNull();
  });
});
