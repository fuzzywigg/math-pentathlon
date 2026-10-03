/**
 * Wave 59 Contig/SD residual — Sum tutorial inactive after init. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  newGameVsHuman,
  isTutorialActive,
} from '../../src/games/sum-dominoes/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 59 sum — tutorial inactive after init', () => {
  it('isTutorialActive false after newGameVsHuman alone', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(isTutorialActive()).toBe(false);
  });
});
