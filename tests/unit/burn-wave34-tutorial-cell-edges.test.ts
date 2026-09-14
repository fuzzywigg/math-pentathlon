/**
 * Wave 34 — click-cell wrong coords / partial data edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-cell-edge', name: 'CellEdge', steps };
}

describe('Wave 34 tutorial — click-cell edges', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('row match alone is insufficient', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'c',
          title: 'C',
          message: 'm',
          requiredAction: { type: 'click-cell', row: 4, col: 7 },
        },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 4, col: 0 })).toBe(false);
    expect(manager.handleAction('click-cell', { row: 0, col: 7 })).toBe(false);
    expect(manager.handleAction('click-cell', { row: 4 })).toBe(false);
    expect(manager.handleAction('click-cell', { col: 7 })).toBe(false);
    expect(manager.handleAction('click-cell')).toBe(false);
  });

  it('exact row/col completes even without selector data', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'c',
          title: 'C',
          message: 'm',
          requiredAction: { type: 'click-cell', row: 4, col: 7 },
        },
        { id: 'd', title: 'D', message: 'done' },
      ])
    );
    expect(manager.handleAction('click-cell', { row: 4, col: 7 })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('d');
  });
});
