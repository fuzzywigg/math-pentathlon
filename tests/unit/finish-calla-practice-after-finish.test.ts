/**
 * ON-20260928-W1-MP-FINISH item 4 — Calla Finish drops into interactive practice.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { tutorialManager } from '../../src/core/tutorial';
import {
  initGame,
  startTutorial,
  isTutorialActive,
  getGameState,
  startPracticeGame,
} from '../../src/games/calla/game-controller';

afterEach(() => {
  if (tutorialManager.getIsActive()) tutorialManager.exit();
  document.body.innerHTML = '';
});

describe('MP-FINISH item 4 — Calla practice after Finish', () => {
  it('Finish button ends tutorial and yields an interactive practice board', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    startTutorial();
    expect(isTutorialActive()).toBe(true);

    const total = tutorialManager.getTotalSteps();
    for (let i = 0; i < total - 1; i++) {
      tutorialManager.nextStep();
    }
    expect(tutorialManager.getCurrentStep()?.id).toBe('complete');

    const finishBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Finish'
    );
    expect(finishBtn).toBeTruthy();
    finishBtn!.click();

    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.calla-board')).toBeTruthy();

    const validPit = board.querySelector('.calla-pit-valid');
    expect(validPit).toBeTruthy();

    const before = getGameState().moveHistory.length;
    validPit!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThan(before);
  });

  it('startPracticeGame mounts a clickable HvH opening position', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    startPracticeGame();
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().moveHistory).toHaveLength(0);

    const validPit = board.querySelector('.calla-pit-valid');
    expect(validPit).toBeTruthy();
    validPit!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThan(0);
  });
});
