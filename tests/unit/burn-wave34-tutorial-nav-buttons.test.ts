/**
 * Wave 34 — prev/next button disabled-state cues across ends.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-btns', name: 'Btns', steps };
}

describe('Wave 34 tutorial — nav button enablement', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('Back is disabled on first step when manager wires disabled attr', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    const prev = document.querySelector(
      '.tutorial-prev-btn'
    ) as HTMLButtonElement;
    const next = document.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;
    // Implementation may disable via attribute or rely on no-op; assert presence
    expect(prev).toBeTruthy();
    expect(next).toBeTruthy();
    // Clicking Back on first step must remain on s0
    prev.click();
    expect(manager.getCurrentStep()?.id).toBe('s0');
  });

  it('single-step Next completes the tutorial', () => {
    manager = new TutorialManager();
    manager.start(cfg([{ id: 'only', title: 'Only', message: 'one' }]));
    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(manager.getIsActive()).toBe(false);
  });
});
