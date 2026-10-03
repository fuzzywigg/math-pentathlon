/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — frac × pinball startTutorial welcome step.
 * Wave56 only asserted isTutorialActive boolean. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { tutorialManager } from '../../src/core/tutorial';
import {
  initGame as initFrac,
  startTutorial as startFracTutorial,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPin,
  startTutorial as startPinTutorial,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  tutorialManager.exit();
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 handshake — tutorial welcome step', () => {
  it('startTutorial lands on welcome for both leftovers', () => {
    const fracRoot = document.createElement('div');
    const pinRoot = document.createElement('div');
    document.body.append(fracRoot, pinRoot);
    initFrac(fracRoot);
    startFracTutorial();
    expect(tutorialManager.getIsActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
    tutorialManager.exit();

    initPin(pinRoot);
    startPinTutorial();
    expect(tutorialManager.getIsActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
  });
});
