/**
 * Wave 57 leftover after #257 — Fab tutorial completed renews HvH. Tests-only.
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

describe('Wave 57 fab — tutorial completed renew', () => {
  it('complete remounts selectingBar1 HvH board', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    newGameVsHuman(container);
    startTutorial();
    expect(isTutorialActive()).toBe(true);

    const marker = document.createElement('div');
    marker.id = 'wave57-fab-marker';
    container.appendChild(marker);

    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(container.querySelector('#wave57-fab-marker')).toBeNull();
    expect(container.querySelector('.fab-status')).toBeTruthy();
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Select first fraction bar/
    );
    expect(container.querySelector('.fab-history')).toBeNull();
  });
});
