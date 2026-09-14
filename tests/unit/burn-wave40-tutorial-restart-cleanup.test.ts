/**
 * Wave 40 — tutorial restart cleans prior overlay leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(id: string, steps: TutorialConfig['steps']): TutorialConfig {
  return { id, name: id, steps };
}

describe('Wave 40 tutorial — restart cleanup', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('start(cfg2) while active leaves a single overlay/tooltip', () => {
    manager = new TutorialManager();
    manager.start(cfg('w40-a', [{ id: 'a', title: 'A', message: 'first' }]));
    expect(document.querySelectorAll('.tutorial-overlay').length).toBe(1);
    expect(document.querySelectorAll('.tutorial-tooltip').length).toBe(1);

    manager.start(
      cfg('w40-b', [
        { id: 'b', title: 'B', message: 'second' },
        { id: 'c', title: 'C', message: 'third' },
      ])
    );

    expect(document.querySelectorAll('.tutorial-overlay').length).toBe(1);
    expect(document.querySelectorAll('.tutorial-tooltip').length).toBe(1);
    expect(manager.getIsActive()).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('b');
    expect(manager.getTotalSteps()).toBe(2);
  });

  it('restart clears prior hit-proxy and tap-cue helpers', () => {
    const cell = document.createElement('div');
    cell.className = 'w40-restart-cell';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100,
        top: 100,
        right: 140,
        bottom: 140,
        width: 40,
        height: 40,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);

    manager = new TutorialManager();
    manager.start(
      cfg('w40-proxy', [
        {
          id: 'tap',
          title: 'Tap',
          message: 'cell',
          highlightSelector: '.w40-restart-cell',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
        },
      ])
    );
    expect(document.querySelector('.tutorial-hit-proxy')).toBeTruthy();

    manager.start(cfg('w40-plain', [{ id: 'plain', title: 'P', message: 'm' }]));
    expect(document.querySelector('.tutorial-hit-proxy')).toBeNull();
    expect(document.querySelector('.tutorial-tap-cue')).toBeNull();
    cell.remove();
  });
});
