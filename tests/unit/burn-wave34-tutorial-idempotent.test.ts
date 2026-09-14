/**
 * Wave 34 — double exit / complete idempotency & inactive safety.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-idem', name: 'Idem', steps };
}

describe('Wave 34 tutorial — idempotent teardown', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('exit twice does not throw and stays inactive', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'a' }]));
    manager.exit();
    manager.exit();
    expect(manager.getIsActive()).toBe(false);
    expect(document.querySelectorAll('.tutorial-overlay')).toHaveLength(0);
  });

  it('complete then exit stays clean', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(cfg([{ id: 'a', title: 'A', message: 'a' }]));
    manager.complete();
    manager.exit();
    expect(types.filter((t) => t === 'completed')).toHaveLength(1);
    expect(types.filter((t) => t === 'exited')).toHaveLength(1);
  });

  it('handleAction after complete returns false', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'a',
          title: 'A',
          message: 'a',
          requiredAction: { type: 'click-cell', row: 1, col: 1 },
        },
      ])
    );
    manager.complete();
    expect(manager.handleAction('click-cell', { row: 1, col: 1 })).toBe(false);
  });
});
