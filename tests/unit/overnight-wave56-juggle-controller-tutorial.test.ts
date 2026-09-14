/**
 * Wave 56 leftover after #256 — Juggle controller tutorial complete/exit.
 * Mirrors calla wave50 controller tutorial leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { tutorialManager } from '../../src/core/tutorial';
import {
  initGame,
  startTutorial,
  isTutorialActive,
  newGameVsHuman,
} from '../../src/games/juggle/game-controller';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
});

describe('Wave 56 juggle — controller tutorial', () => {
  it('complete remounts HvH board; exit clears active flag', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
    expect(tutorialManager.getTotalSteps()).toBe(7);

    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.juggle-roll-btn, .juggle-boards')).toBeTruthy();

    startTutorial();
    tutorialManager.nextStep();
    expect(tutorialManager.getCurrentStep()?.id).toBe('objective');
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
  });
});
