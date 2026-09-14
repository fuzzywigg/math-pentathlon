/**
 * Wave 34 — multi-step montage handshake (events + actions + chrome).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  TutorialManager,
  type TutorialConfig,
  type TutorialEvent,
} from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-hand', name: 'Handshake', steps };
}

describe('Wave 34 tutorial — handshake montage', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('plays intro → gated action → free next → complete', () => {
    manager = new TutorialManager();
    const log: TutorialEvent['type'][] = [];
    const onShowGate = vi.fn();
    const onCompleteIntro = vi.fn();
    manager.on((e) => log.push(e.type));

    manager.start(
      cfg([
        {
          id: 'intro',
          title: 'Intro',
          message: 'welcome',
          position: 'center',
          onComplete: onCompleteIntro,
        },
        {
          id: 'gate',
          title: 'Gate',
          message: 'click me',
          requiredAction: { type: 'click', selector: '.go-btn' },
          onShow: onShowGate,
        },
        {
          id: 'wrap',
          title: 'Wrap',
          message: 'done soon',
        },
      ])
    );

    expect(manager.getCurrentStep()?.id).toBe('intro');
    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(onCompleteIntro).toHaveBeenCalled();
    expect(manager.getCurrentStep()?.id).toBe('gate');
    expect(onShowGate).toHaveBeenCalled();

    (document.querySelector('.tutorial-next-btn') as HTMLButtonElement).click();
    expect(manager.getCurrentStep()?.id).toBe('gate');

    expect(manager.handleAction('click', { selector: '.go-btn' })).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('wrap');
    manager.nextStep();
    expect(manager.getIsActive()).toBe(false);
    expect(log).toEqual(expect.arrayContaining(['step-changed', 'completed']));
  });
});
