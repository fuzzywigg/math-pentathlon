/**
 * Wave 34 — singleton tutorialManager export handshake.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  tutorialManager,
  TutorialManager,
  type TutorialConfig,
} from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-singleton', name: 'Singleton', steps };
}

describe('Wave 34 tutorial — singleton export', () => {
  afterEach(() => {
    tutorialManager.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('tutorialManager is a TutorialManager instance', () => {
    expect(tutorialManager).toBeInstanceOf(TutorialManager);
  });

  it('singleton start/exit cycle works independently of fresh instances', () => {
    const local = new TutorialManager();
    tutorialManager.start(cfg([{ id: 'g', title: 'G', message: 'g' }]));
    expect(tutorialManager.getIsActive()).toBe(true);
    expect(local.getIsActive()).toBe(false);
    tutorialManager.exit();
    expect(tutorialManager.getIsActive()).toBe(false);
  });
});
