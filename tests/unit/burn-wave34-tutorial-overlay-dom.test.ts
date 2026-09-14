/**
 * Wave 34 — overlay DOM structure contracts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-dom', name: 'DOM', steps };
}

describe('Wave 34 tutorial — overlay DOM contract', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('overlay contains backdrop + highlight ring', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'm' }]));
    const overlay = document.querySelector('.tutorial-overlay') as HTMLElement;
    expect(overlay.querySelector('.tutorial-backdrop')).toBeTruthy();
    expect(overlay.querySelector('.tutorial-highlight-ring')).toBeTruthy();
  });

  it('tooltip contains header / title / message / actions', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'm' }]));
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip.querySelector('.tutorial-tooltip-header')).toBeTruthy();
    expect(tip.querySelector('.tutorial-tooltip-title')).toBeTruthy();
    expect(tip.querySelector('.tutorial-tooltip-message')).toBeTruthy();
    expect(tip.querySelector('.tutorial-tooltip-actions')).toBeTruthy();
    expect(tip.querySelector('.tutorial-prev-btn')).toBeTruthy();
    expect(tip.querySelector('.tutorial-next-btn')).toBeTruthy();
    expect(tip.querySelector('.tutorial-exit-btn')).toBeTruthy();
  });

  it('complete removes both overlay and tooltip from document', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'm' }]));
    manager.complete();
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
    expect(document.querySelector('.tutorial-tooltip')).toBeNull();
  });
});
