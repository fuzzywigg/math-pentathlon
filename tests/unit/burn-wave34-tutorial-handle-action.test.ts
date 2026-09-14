/**
 * Wave 34 — handleAction click-cell / click selector matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-action', name: 'Action', steps };
}

describe('Wave 34 tutorial — handleAction click-cell', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('matching cell advances; mismatch returns false', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'tap',
          title: 'Tap',
          message: 'cell',
          requiredAction: { type: 'click-cell', row: 2, col: 3 },
        },
        { id: 'done', title: 'Done', message: 'ok' },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 0, col: 0 })).toBe(false);
    expect(manager.getCurrentStep()?.id).toBe('tap');
    expect(manager.handleAction('click-cell', { row: 2, col: 3 })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('done');
  });

  it('wrong action type does not advance click-cell step', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'tap',
          title: 'Tap',
          message: 'cell',
          requiredAction: { type: 'click-cell', row: 1, col: 1 },
        },
      ])
    );
    expect(manager.handleAction('click', { selector: '.x' })).toBe(false);
    expect(manager.getIsActive()).toBe(true);
  });
});

describe('Wave 34 tutorial — handleAction click selector', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('matching selector advances; other selector rejected', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'btn',
          title: 'Btn',
          message: 'click',
          requiredAction: { type: 'click', selector: '.roll-btn' },
        },
        { id: 'after', title: 'After', message: 'ok' },
      ])
    );
    expect(manager.handleAction('click', { selector: '.other' })).toBe(false);
    expect(manager.handleAction('click', { selector: '.roll-btn' })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('after');
  });

  it('returns false when step has no requiredAction', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'free', title: 'Free', message: 'next' }]));
    expect(manager.handleAction('click-cell', { row: 0, col: 0 })).toBe(false);
  });

  it('returns false when inactive', () => {
    manager = new TutorialManager();
    expect(manager.handleAction('click-cell', { row: 1, col: 1 })).toBe(false);
  });
});
