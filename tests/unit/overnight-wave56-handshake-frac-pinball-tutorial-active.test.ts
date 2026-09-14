/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact / Pinball isTutorialActive leftover.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame as initFrac,
  startTutorial as startFracTutorial,
  isTutorialActive as isFracTutorial,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPin,
  startTutorial as startPinTutorial,
  isTutorialActive as isPinTutorial,
} from '../../src/games/fraction-pinball/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 handshake — tutorial active', () => {
  it('startTutorial flips isTutorialActive for both leftovers', () => {
    const fracRoot = document.createElement('div');
    const pinRoot = document.createElement('div');
    document.body.append(fracRoot, pinRoot);
    initFrac(fracRoot);
    initPin(pinRoot);
    expect(isFracTutorial()).toBe(false);
    expect(isPinTutorial()).toBe(false);
    startFracTutorial();
    expect(isFracTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isFracTutorial()).toBe(false);
    startPinTutorial();
    expect(isPinTutorial()).toBe(true);
    tutorialManager.exit();
    expect(isPinTutorial()).toBe(false);
  });
});
