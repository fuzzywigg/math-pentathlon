/**
 * Wave 57 leftover after #267 — Sum startTutorial noop without container. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  startTutorial,
  isTutorialActive,
  newGameVsHuman,
} from '../../src/games/sum-dominoes/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 57 sum — startTutorial noop', () => {
  it('noops without container then activates after mount', () => {
    startTutorial();
    expect(isTutorialActive()).toBe(false);
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
  });
});
