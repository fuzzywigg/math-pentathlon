/**
 * Overnight HEAVY leftover — Calla controller tutorial complete vs exit.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { tutorialManager } from '../../src/core/tutorial';
import {
  initGame,
  startTutorial,
  isTutorialActive,
  getGameState,
  newGameVsHuman,
} from '../../src/games/calla/game-controller';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
});

describe('Overnight wave50 calla — controller tutorial', () => {
  it('complete unsubscribes and remounts a fresh HvH board; exit does not', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThan(0);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe('welcome');
    expect(tutorialManager.getTotalSteps()).toBe(10);
    expect(getGameState().moveHistory).toHaveLength(0);

    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getGameState().moveHistory).toHaveLength(0);
    expect(getGameState().currentPlayer).toBe('player1');
    expect(board.querySelector('.calla-board')).toBeTruthy();

    startTutorial();
    tutorialManager.nextStep();
    expect(tutorialManager.getCurrentStep()?.id).toBe('goal');
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
  });
});
