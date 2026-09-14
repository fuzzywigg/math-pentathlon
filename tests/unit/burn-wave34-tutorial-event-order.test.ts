/**
 * Wave 34 — event ordering across next / complete / exit.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-order', name: 'Order', steps };
}

describe('Wave 34 tutorial — event order', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('emits step-changed then completed on last next', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ])
    );
    manager.nextStep();
    manager.nextStep();
    expect(types).toEqual(['step-changed', 'completed']);
  });

  it('exit mid-flow emits exited without completed', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(
      cfg([
        { id: 'a', title: 'A', message: 'a' },
        { id: 'b', title: 'B', message: 'b' },
      ])
    );
    manager.nextStep();
    manager.exit();
    expect(types).toEqual(['step-changed', 'exited']);
    expect(types).not.toContain('completed');
  });

  it('complete() emits completed without step-changed when already on last', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(cfg([{ id: 'only', title: 'O', message: 'o' }]));
    manager.complete();
    expect(types).toEqual(['completed']);
  });
});
