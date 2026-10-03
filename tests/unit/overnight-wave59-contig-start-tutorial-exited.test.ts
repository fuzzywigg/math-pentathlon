/**
 * Wave 59 Contig/SD residual — Contig tutorial exit leaves inactive. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  startTutorial,
  isTutorialActive,
} from '../../src/games/contig-60/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 59 contig — tutorial exited', () => {
  it('exit deactivates without requiring complete', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
  });
});
