/**
 * Wave 34 — TutorialEvent subscribe / unsubscribe / payload matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  TutorialManager,
  type TutorialConfig,
  type TutorialEvent,
} from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-events', name: 'Events', steps };
}

describe('Wave 34 tutorial — events', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('step-changed carries index + step identity', () => {
    manager = new TutorialManager();
    const seen: TutorialEvent[] = [];
    manager.on((e) => seen.push(e));
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ])
    );
    manager.nextStep();
    const change = seen.find((e) => e.type === 'step-changed');
    expect(change?.stepIndex).toBe(1);
    expect(change?.step?.id).toBe('b');
  });

  it('unsubscribe stops further delivery', () => {
    manager = new TutorialManager();
    const calls: string[] = [];
    const off = manager.on((e) => calls.push(e.type));
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ])
    );
    off();
    manager.nextStep();
    manager.exit();
    expect(calls).toEqual([]);
  });

  it('multiple handlers all receive completed', () => {
    manager = new TutorialManager();
    const a: string[] = [];
    const b: string[] = [];
    manager.on((e) => a.push(e.type));
    manager.on((e) => b.push(e.type));
    manager.start(cfg([{ id: 'only', title: 'T', message: 'M' }]));
    manager.nextStep();
    expect(a).toContain('completed');
    expect(b).toContain('completed');
  });
});
