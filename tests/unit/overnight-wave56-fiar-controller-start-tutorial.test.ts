/**
 * Wave 56 leftover after #255/#256 — FIAR startTutorial / isTutorialActive. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  startTutorial,
  isTutorialActive,
} from '../../src/games/fiar/game-controller';
import { tutorialManager } from '../../src/core/tutorial';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — startTutorial', () => {
  it('activates welcome step then exit clears active', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(isTutorialActive()).toBe(false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
  });
});
