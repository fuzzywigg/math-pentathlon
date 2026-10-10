/**
 * q-mp-584 / UI coverage round 57 — stars-bars board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice or timing asserts. Stub AI only for setup.
 * No Stars & Bars history cap. Hex Hard 450ms untouched. Zero src product edits.
 *
 * Live tip post1012 residual arms (remeasured after r17/r31 on tip):
 * controller newGame(false) aiPlayer `: null` (L122); status fallthrough when
 * phase is neither selecting/placing/gameOver (L166 else); tutorial listener
 * else on `step-changed` (L375). board-ui calculatePreviewScore undefined-cell
 * return (L572) stays intentional — renderBoard continues before preview.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell } from './helpers/dom';
import { createInitialState } from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';
import { CONFIG } from '../../src/games/stars-bars/types';
import * as starsAi from '../../src/games/stars-bars/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  try {
    const mod = await import('../../src/games/stars-bars/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

describe('q-mp-584 ui-cov-r57 stars-bars controller residuals', () => {
  it('newGame(false) clears aiPlayer null arm + retains difficulty', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');
    vi.spyOn(starsAi, 'getAIMove').mockReturnValue(null);

    const shell = mountAppShell();
    const ctrl = initGame(shell, true, 'hard');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    expect(shell.querySelector('.stars-status')).toBeTruthy();

    // HvH toggle: aiPlayer ternary alternate (`: null`) + diff omitted retain.
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(document.getElementById('app')?.dataset.opponent).not.toBe('ai');
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    expect(shell.querySelector('.stars-scores')).toBeTruthy();
    expect(shell.querySelector('.stars-board')).toBeTruthy();

    // Explicit difficulty override on HvH path still paints chrome.
    ctrl.newGame(false, 'easy');
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(shell.querySelector('.stars-controls, .stars-game-area')).toBeTruthy();

    destroyGame();
  });

  it('status fallthrough for non-canonical phase leaves status chrome only', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);

    // Reach the placingCard else-if with a phase outside the union so every
    // prior status arm is false and the placingCard condition is also false.
    const bogusPhase = 'awaitingDeal' as StarsState['phase'];
    ctrl.state = {
      ...createInitialState(),
      winner: null,
      phase: bogusPhase,
      currentPlayer: 'player1',
      selectedCard: null,
      playerScores: { player1: 0, player2: 0 },
    };
    ctrl.update();

    expect(ctrl.state.phase).toBe(bogusPhase);
    expect(ctrl.state.winner).toBeNull();
    const status = shell.querySelector('.stars-status.player1');
    expect(status).toBeTruthy();
    // Fallthrough leaves text unset — structure/class only (no copy pin).
    expect((status as HTMLElement).textContent ?? '').toBe('');
    expect(shell.querySelector('.stars-winner-banner')).toBeNull();
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    expect(shell.querySelector('.stars-board')).toBeTruthy();
    expect(shell.querySelectorAll('.stars-score')).toHaveLength(2);

    destroyGame();
  });

  it('tutorial step-changed keeps listener; completed remount still works', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');

    const shell = mountAppShell();
    initGame(shell, false);
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);

    // Listener else arm: step-changed is neither completed nor exited.
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    expect(shell.querySelector('.stars-status')).toBeTruthy();

    // Listener still subscribed — completed still remounts HvH.
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    expect(shell.querySelector('.stars-board')).toBeTruthy();
    expect(shell.querySelectorAll('.stars-hand-container').length).toBe(2);

    destroyGame();
  });

  it('placingCard human status still mounts after select (regression chrome)', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);
    const deal = createInitialState();
    const card = deal.playerHands.player1[0]!;
    ctrl.state = {
      ...deal,
      currentPlayer: 'player1',
      phase: 'placingCard',
      selectedCard: card,
      winner: null,
      playerScores: { player1: 0, player2: 0 },
    };
    ctrl.update();

    expect(ctrl.state.phase).toBe('placingCard');
    expect(ctrl.state.selectedCard?.id).toBe(card.id);
    expect(shell.querySelector('.stars-status.player1')).toBeTruthy();
    expect(shell.querySelector('.stars-cell.valid')).toBeTruthy();
    expect(shell.querySelector('.stars-card.selected')).toBeTruthy();
    // Clear-selection control present (class chrome only).
    expect(shell.querySelector('.stars-btn.stars-btn-secondary')).toBeTruthy();
    expect(shell.querySelectorAll('.stars-score').length).toBe(2);
    expect(CONFIG.BOARD_SIZE).toBe(5);

    destroyGame();
  });
});
