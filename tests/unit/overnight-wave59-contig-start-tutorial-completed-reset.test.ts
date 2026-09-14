/**
 * Wave 59 Contig/SD residual — Contig tutorial completed remount. Tests-only.
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

describe('Wave 59 contig — tutorial completed', () => {
  it('complete deactivates and remounts roll CTA', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(/0/);
  });
});
