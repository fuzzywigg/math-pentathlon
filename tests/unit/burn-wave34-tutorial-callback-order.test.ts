/**
 * Wave 34 — onComplete + onShow ordering relative to events.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-cb-order', name: 'CbOrder', steps };
}

describe('Wave 34 tutorial — callback vs event order', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('onComplete fires before step-changed for intermediate next', () => {
    manager = new TutorialManager();
    const seq: string[] = [];
    manager.on((e) => seq.push(`event:${e.type}`));
    manager.start(
      cfg([
        {
          id: 'a',
          title: 'A',
          message: 'a',
          onComplete: () => seq.push('onComplete:a'),
        },
        {
          id: 'b',
          title: 'B',
          message: 'b',
          onShow: () => seq.push('onShow:b'),
        },
      ])
    );
    seq.length = 0; // drop initial onShow:a if any was recorded before subscribe timing
    // re-subscribe clean after start — initial onShow already happened
    manager.nextStep();
    expect(seq[0]).toBe('onComplete:a');
    expect(seq).toContain('onShow:b');
    expect(seq).toContain('event:step-changed');
    expect(seq.indexOf('onComplete:a')).toBeLessThan(
      seq.indexOf('event:step-changed')
    );
  });

  it('onShow of first step runs during start', () => {
    manager = new TutorialManager();
    const onShow = vi.fn();
    manager.start(cfg([{ id: 'a', title: 'A', message: 'a', onShow }]));
    expect(onShow).toHaveBeenCalledTimes(1);
  });
});
