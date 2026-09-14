/**
 * Wave 34 — click selector exact-match edges (undefined / empty).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-sel-edge', name: 'SelEdge', steps };
}

describe('Wave 34 tutorial — click selector edges', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('rejects undefined / empty / partial selector payloads', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'c',
          title: 'C',
          message: 'm',
          requiredAction: { type: 'click', selector: '.exact' },
        },
      ])
    );
    expect(manager.handleAction('click')).toBe(false);
    expect(manager.handleAction('click', {})).toBe(false);
    expect(manager.handleAction('click', { selector: '' })).toBe(false);
    expect(manager.handleAction('click', { selector: '.exact ' })).toBe(false);
    expect(manager.handleAction('click', { selector: '.exact' })).toBe(true);
  });

  it('completes tutorial when gated final step is satisfied', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(
      cfg([
        {
          id: 'only',
          title: 'Only',
          message: 'm',
          requiredAction: { type: 'click', selector: '.done' },
        },
      ])
    );
    expect(manager.handleAction('click', { selector: '.done' })).toBe(true);
    expect(manager.getIsActive()).toBe(false);
    expect(types).toContain('completed');
  });
});
