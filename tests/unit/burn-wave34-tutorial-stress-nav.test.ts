/**
 * Wave 34 — stress: many steps + rapid next/prev conservation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  TutorialManager,
  type TutorialConfig,
  type TutorialStep,
} from '../../src/core/tutorial';

function makeSteps(n: number): TutorialStep[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `s${i}`,
    title: `T${i}`,
    message: `M${i}`,
  }));
}

describe('Wave 34 tutorial — stress navigation', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('walks 12 steps forward then completes with one overlay', () => {
    manager = new TutorialManager();
    const config: TutorialConfig = {
      id: 'wave34-stress',
      name: 'Stress',
      steps: makeSteps(12),
    };
    manager.start(config);
    expect(manager.getTotalSteps()).toBe(12);
    for (let i = 0; i < 11; i++) {
      manager.nextStep();
      expect(manager.getCurrentStepIndex()).toBe(i + 1);
      expect(document.querySelectorAll('.tutorial-overlay')).toHaveLength(1);
    }
    manager.nextStep();
    expect(manager.getIsActive()).toBe(false);
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
  });

  it('rapid next/prev oscillation keeps index in range', () => {
    manager = new TutorialManager();
    manager.start({
      id: 'wave34-osc',
      name: 'Osc',
      steps: makeSteps(5),
    });
    for (let i = 0; i < 20; i++) {
      if (i % 3 === 0) manager.prevStep();
      else manager.nextStep();
      if (!manager.getIsActive()) break;
      expect(manager.getCurrentStepIndex()).toBeGreaterThanOrEqual(0);
      expect(manager.getCurrentStepIndex()).toBeLessThan(5);
    }
  });
});
