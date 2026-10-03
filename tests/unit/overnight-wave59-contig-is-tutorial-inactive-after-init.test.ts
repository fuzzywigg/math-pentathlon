/**
 * Wave 59 Contig/SD residual — Contig tutorial inactive after init. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  isTutorialActive,
} from '../../src/games/contig-60/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 59 contig — tutorial inactive after init', () => {
  it('isTutorialActive is false after initGame alone', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(isTutorialActive()).toBe(false);
  });
});
