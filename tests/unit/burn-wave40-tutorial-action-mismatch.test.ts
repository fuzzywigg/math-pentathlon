/**
 * Wave 40 — tutorial handleAction type mismatch leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'w40-mm', name: 'MM', steps };
}

describe('Wave 40 tutorial — action mismatch', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('click action on click-cell step returns false', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'need-cell',
          title: 'Cell',
          message: 'tap cell',
          requiredAction: { type: 'click-cell', row: 2, col: 3 },
        },
        { id: 'done', title: 'Done', message: 'ok' },
      ])
    );
    expect(manager.handleAction('click', { selector: '.anything' })).toBe(
      false
    );
    expect(manager.handleAction('click')).toBe(false);
    expect(manager.getCurrentStep()?.id).toBe('need-cell');
    expect(manager.getCurrentStepIndex()).toBe(0);
  });

  it('click-cell action on click step returns false', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'need-click',
          title: 'Click',
          message: 'btn',
          requiredAction: { type: 'click', selector: '.go' },
        },
        { id: 'after', title: 'After', message: 'ok' },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 0, col: 0 })).toBe(false);
    expect(manager.getCurrentStep()?.id).toBe('need-click');
  });

  it('matching types still require matching payload', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'cell',
          title: 'Cell',
          message: 'm',
          requiredAction: { type: 'click-cell', row: 1, col: 1 },
        },
        { id: 'done', title: 'Done', message: 'ok' },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 1, col: 0 })).toBe(false);
    expect(manager.handleAction('click-cell', { row: 1, col: 1 })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('done');
  });
});
