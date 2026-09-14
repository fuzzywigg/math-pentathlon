/**
 * Wave 34 — exit / Escape / mid-start overlay cleanup.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-exit', name: 'Exit', steps };
}

describe('Wave 34 tutorial — exit paths', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('exit emits exited and removes overlay', () => {
    manager = new TutorialManager();
    const types: string[] = [];
    manager.on((e) => types.push(e.type));
    manager.start(cfg([{ id: 's0', title: 'T', message: 'M' }]));
    manager.exit();
    expect(manager.getIsActive()).toBe(false);
    expect(types).toContain('exited');
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
    expect(document.querySelector('.tutorial-tooltip')).toBeNull();
  });

  it('Escape key exits while active', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 's0', title: 'T', message: 'M' }]));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(manager.getIsActive()).toBe(false);
  });

  it('exit button in tooltip triggers exit', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 's0', title: 'T', message: 'M' }]));
    const btn = document.querySelector(
      '.tutorial-exit-btn'
    ) as HTMLButtonElement;
    btn.click();
    expect(manager.getIsActive()).toBe(false);
  });

  it('restart while active replaces overlay without leaking nodes', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 's0', title: 'T', message: 'M' }]));
    manager.start(
      cfg([
        { id: 'n0', title: 'N', message: 'new' },
        { id: 'n1', title: 'N2', message: 'new2' },
      ])
    );
    expect(document.querySelectorAll('.tutorial-overlay')).toHaveLength(1);
    expect(document.querySelectorAll('.tutorial-tooltip')).toHaveLength(1);
    expect(manager.getCurrentStep()?.id).toBe('n0');
    expect(manager.getTotalSteps()).toBe(2);
  });
});
