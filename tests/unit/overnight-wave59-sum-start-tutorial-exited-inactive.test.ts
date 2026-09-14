/**
 * Wave 59 Contig/SD residual — Sum tutorial exit leaves inactive. Tests-only.
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

describe('Wave 59 sum — tutorial exited', () => {
  it('exit deactivates while roll chrome remains', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.sd-roll-btn')).toBeTruthy();
  });
});
