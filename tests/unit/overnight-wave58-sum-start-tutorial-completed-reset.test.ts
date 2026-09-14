/**
 * Wave 58 Contig/SD residual — Sum tutorial completed resets board. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  newGameVsHuman,
  startTutorial,
  isTutorialActive,
} from '../../src/games/sum-dominoes/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 58 sum — tutorial completed reset', () => {
  it('completed event exits tutorial; exited leaves inactive', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.sd-roll-btn')).toBeTruthy();
  });
});
