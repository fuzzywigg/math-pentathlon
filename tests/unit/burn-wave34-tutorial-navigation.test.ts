/**
 * Wave 34 — nextStep / prevStep / complete navigation matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-nav', name: 'Nav', steps };
}

describe('Wave 34 tutorial — navigation', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('nextStep advances until final then completes', () => {
    manager = new TutorialManager();
    const events: string[] = [];
    manager.on((e) => events.push(e.type));
    manager.start(
      cfg([
        { id: 's0', title: '0', message: 'm0' },
        { id: 's1', title: '1', message: 'm1' },
        { id: 's2', title: '2', message: 'm2' },
      ])
    );
    manager.nextStep();
    expect(manager.getCurrentStep()?.id).toBe('s1');
    expect(events).toContain('step-changed');
    manager.nextStep();
    expect(manager.getCurrentStep()?.id).toBe('s2');
    manager.nextStep();
    expect(manager.getIsActive()).toBe(false);
    expect(manager.getCurrentStep()).toBeNull();
    expect(events.filter((t) => t === 'completed')).toHaveLength(1);
  });

  it('prevStep no-ops at index 0 and walks back afterward', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: '0', message: 'm0' },
        { id: 's1', title: '1', message: 'm1' },
      ])
    );
    manager.prevStep();
    expect(manager.getCurrentStepIndex()).toBe(0);
    manager.nextStep();
    expect(manager.getCurrentStepIndex()).toBe(1);
    manager.prevStep();
    expect(manager.getCurrentStep()?.id).toBe('s0');
  });

  it('next/prev are no-ops when inactive', () => {
    manager = new TutorialManager();
    manager.nextStep();
    manager.prevStep();
    expect(manager.getIsActive()).toBe(false);
  });

  it('complete clears overlay and deactivates', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'only', title: 'T', message: 'M' }]));
    expect(document.querySelector('.tutorial-overlay')).toBeTruthy();
    manager.complete();
    expect(manager.getIsActive()).toBe(false);
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
  });

  it('invokes onComplete before advancing', () => {
    manager = new TutorialManager();
    const onComplete = vi.fn();
    manager.start(
      cfg([
        { id: 's0', title: '0', message: 'm0', onComplete },
        { id: 's1', title: '1', message: 'm1' },
      ])
    );
    manager.nextStep();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(manager.getCurrentStep()?.id).toBe('s1');
  });
});
