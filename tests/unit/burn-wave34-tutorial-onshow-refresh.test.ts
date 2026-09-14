/**
 * Wave 34 — onShow callback + refreshHighlight re-entry.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-show', name: 'Show', steps };
}

describe('Wave 34 tutorial — onShow + refreshHighlight', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('invokes onShow when a step is displayed', () => {
    manager = new TutorialManager();
    const onShow0 = vi.fn();
    const onShow1 = vi.fn();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a', onShow: onShow0 },
        { id: 's1', title: 'B', message: 'b', onShow: onShow1 },
      ])
    );
    expect(onShow0).toHaveBeenCalledTimes(1);
    expect(onShow1).not.toHaveBeenCalled();
    manager.nextStep();
    expect(onShow1).toHaveBeenCalledTimes(1);
  });

  it('refreshHighlight no-ops when inactive', () => {
    manager = new TutorialManager();
    manager.refreshHighlight();
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
  });

  it('refreshHighlight re-runs show for active tutorial', () => {
    manager = new TutorialManager();
    const onShow = vi.fn();
    manager.start(cfg([{ id: 's0', title: 'A', message: 'a', onShow }]));
    expect(onShow).toHaveBeenCalledTimes(1);
    manager.refreshHighlight();
    expect(onShow).toHaveBeenCalledTimes(2);
    expect(manager.getCurrentStep()?.id).toBe('s0');
  });
});
