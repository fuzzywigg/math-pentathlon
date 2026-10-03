/**
 * Wave 58 Contig/SD residual — Contig startTutorial becomes active. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  startTutorial,
  isTutorialActive,
} from '../../src/games/contig-60/game-controller';
import { tutorialManager } from '../../src/core/tutorial';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  if (tutorialManager.getIsActive()) tutorialManager.exit();
});

describe('Wave 58 contig — startTutorial active', () => {
  it('activates contig-60-basics after init', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(contig60Tutorial.id).toBe('contig-60-basics');
  });
});
