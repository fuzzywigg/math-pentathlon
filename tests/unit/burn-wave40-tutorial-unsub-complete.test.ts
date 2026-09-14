/**
 * Wave 40 — tutorial on() unsubscribe and complete clears totals.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  TutorialManager,
  type TutorialConfig,
  type TutorialEvent,
} from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'w40-unsub', name: 'Unsub', steps };
}

describe('Wave 40 tutorial — unsub + complete', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('on() unsubscribe stops further delivery', () => {
    manager = new TutorialManager();
    const seen: TutorialEvent['type'][] = [];
    const unsub = manager.on((e) => seen.push(e.type));

    manager.start(
      cfg([
        { id: 'a', title: 'A', message: '1' },
        { id: 'b', title: 'B', message: '2' },
      ])
    );
    // start does not emit; nextStep does
    manager.nextStep();
    expect(seen).toEqual(['step-changed']);

    unsub();
    manager.nextStep(); // completes
    expect(seen).toEqual(['step-changed']);
    expect(manager.getIsActive()).toBe(false);
  });

  it('complete clears config totals and current step', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: '1' },
        { id: 'b', title: 'B', message: '2' },
        { id: 'c', title: 'C', message: '3' },
      ])
    );
    expect(manager.getTotalSteps()).toBe(3);
    manager.complete();
    expect(types).toContain('completed');
    expect(manager.getIsActive()).toBe(false);
    expect(manager.getTotalSteps()).toBe(0);
    expect(manager.getCurrentStep()).toBeNull();
  });

  it('second subscriber still receives after first unsubscribes', () => {
    manager = new TutorialManager();
    const a: string[] = [];
    const b: string[] = [];
    const offA = manager.on((e) => a.push(e.type));
    manager.on((e) => b.push(e.type));
    manager.start(cfg([{ id: 'only', title: 'O', message: 'o' }]));
    offA();
    manager.complete();
    expect(a).toEqual([]);
    expect(b).toEqual(['completed']);
  });
});
