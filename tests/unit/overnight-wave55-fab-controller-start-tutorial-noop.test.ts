/**
 * Wave 55 leftover after #249/#250 — Fab startTutorial before init is no-op. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  startTutorial,
  isTutorialActive,
  newGameVsHuman,
} from '../../src/games/fab-a-diffy/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — startTutorial noop', () => {
  it('returns early without activeContainer; works after init', () => {
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    const container = document.createElement('div');
    document.body.appendChild(container);
    newGameVsHuman(container);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
  });
});
