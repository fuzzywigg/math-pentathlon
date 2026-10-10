/**
 * q-mp-519 / UI coverage round 50 — sum-dominoes board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / call counts.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Stub AI. Hex Hard 450ms untouched. Zero src product edits.
 *
 * Live tip post949 residual arms (remeasured; r30 left lines at 100%):
 * board-ui selectedDomino miss (`if (domino)` else @ L72); controller AI
 * placing without dice / null getAIMove (@ L378 / L381); tutorial
 * step-changed soft-miss on completed||exited (@ L419).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  CONFIG,
  type Domino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard, renderHand } from '../../src/games/sum-dominoes/board-ui';
import * as sumAi from '../../src/games/sum-dominoes/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['sd-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/sum-dominoes/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function seedBoard(): SumDominoesState {
  const base = createInitialState();
  const board = base.board.map((row) => row.map(() => null));
  board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL] = {
    domino: makeDomino('seed', 6, 6, null),
    position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
    orientation: 'horizontal',
  };
  board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL + 1] =
    board[CONFIG.CENTER_ROW]![CONFIG.CENTER_COL];
  return { ...base, board };
}

describe('q-mp-519 ui-cov-r50 sum-dominoes board-ui residuals', () => {
  it('ghost selectedDomino skips valid-cell paint (L72 miss arm)', () => {
    const onCell = vi.fn();
    const state: SumDominoesState = {
      ...seedBoard(),
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: 'ghost-not-in-hand',
      currentPlayer: 'player1',
      hands: {
        player1: [makeDomino('p1-a', 6, 1, 'player1')],
        player2: [],
      },
    };

    const board = renderBoard(state, onCell);
    expect(board.classList.contains('sd-board')).toBe(true);
    // Miss arm: selected id not in hand → no placement set → no valid chrome.
    expect(board.querySelectorAll('.sd-cell-valid')).toHaveLength(0);
    const empty = board.querySelector('.sd-cell') as HTMLElement | null;
    expect(empty).toBeTruthy();
    empty!.click();
    expect(onCell).not.toHaveBeenCalled();
  });

  it('selected hand tile exposes aria-pressed true without copy pins', () => {
    const onHand = vi.fn();
    const tile = makeDomino('pick-me', 6, 1, 'player1');
    const hand = renderHand(
      {
        ...seedBoard(),
        phase: 'placing',
        currentDice: [3, 4],
        selectedDomino: 'pick-me',
        currentPlayer: 'player1',
        hands: { player1: [tile], player2: [] },
      },
      'player1',
      onHand
    );
    const el = hand.querySelector(
      '[data-domino-id="pick-me"]'
    ) as HTMLElement | null;
    expect(el).toBeTruthy();
    expect(el!.classList.contains('sd-hand-domino-selected')).toBe(true);
    expect(el!.classList.contains('sd-hand-domino-playable')).toBe(true);
    expect(el!.getAttribute('role')).toBe('button');
    expect(el!.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('q-mp-519 ui-cov-r50 sum-dominoes controller residuals', () => {
  it('stubbed AI placing + null move keeps placing (L381); no-dice skip (L378)', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/sum-dominoes/game-controller');
    const moveSpy = vi.spyOn(sumAi, 'getAIMove').mockReturnValue(null);

    // Placing with dice + null stub → consults AI, leaves phase/hand structure.
    const placeRoot = mountAppShell();
    const placeCtrl = newGameVsAI(placeRoot, 'easy');
    const stubDomino = makeDomino('ai-null', 6, 1, 'player2');
    placeCtrl.state = {
      ...seedBoard(),
      hands: { player1: [], player2: [stubDomino] },
      currentPlayer: 'player2',
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: null,
      winner: null,
      passCount: 0,
    };
    const handBefore = placeCtrl.state.hands.player2.length;
    const passBefore = placeCtrl.state.passCount;
    placeCtrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(moveSpy).toHaveBeenCalled();
    expect(placeCtrl.state.phase).toBe('placing');
    expect(placeCtrl.state.hands.player2.length).toBe(handBefore);
    expect(placeCtrl.state.passCount).toBe(passBefore);
    expect(placeRoot.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();

    // Placing without dice → L378 compound false; getAIMove not consulted.
    moveSpy.mockClear();
    const noDiceRoot = mountAppShell();
    const noDiceCtrl = newGameVsAI(noDiceRoot, 'easy');
    noDiceCtrl.state = {
      ...seedBoard(),
      hands: { player1: [], player2: [makeDomino('ai-nd', 6, 1, 'player2')] },
      currentPlayer: 'player2',
      phase: 'placing',
      currentDice: null,
      selectedDomino: null,
      winner: null,
    };
    noDiceCtrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(moveSpy).not.toHaveBeenCalled();
    expect(noDiceCtrl.state.phase).toBe('placing');
    expect(noDiceCtrl.state.currentDice).toBeNull();
    expect(noDiceRoot.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();
  });

  it('tutorial step-changed soft-miss; exit/complete lifecycle (L419)', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/sum-dominoes/game-controller');

    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.sd-game-area')).toBeTruthy();

    // start() does not emit step-changed; nextStep does — soft-miss keeps
    // the completed||exited listener subscribed.
    const beforeIdx = tutorialManager.getCurrentStepIndex();
    const total = tutorialManager.getTotalSteps();
    expect(total).toBeGreaterThan(1);
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStepIndex()).toBe(beforeIdx + 1);
    expect(shell.querySelector('.sd-roll-btn')).toBeTruthy();

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.sd-game-area')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.sd-roll-btn')).toBeTruthy();
    expect(shell.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();
  });

  it('human place + pass wiring under live seat (structure only)', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/sum-dominoes/game-controller');

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);
    ctrl.isAI = false;
    ctrl.aiPlayer = null;

    // Select + place while human seat is live (not the stale computer-gate path).
    ctrl.state = {
      ...seedBoard(),
      hands: {
        player1: [makeDomino('p1-live', 6, 1, 'player1')],
        player2: [makeDomino('p2-keep', 5, 5, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [3, 4],
      phase: 'placing',
      selectedDomino: null,
      winner: null,
    };
    ctrl.update();
    const handTile = shell.querySelector(
      '.sd-hand-domino-playable'
    ) as HTMLElement | null;
    expect(handTile).toBeTruthy();
    handTile!.click();
    expect(ctrl.state.selectedDomino).toBe('p1-live');
    const validCell = shell.querySelector(
      '.sd-cell-valid'
    ) as HTMLElement | null;
    expect(validCell).toBeTruthy();
    const handLenBefore = ctrl.state.hands.player1.length;
    validCell!.click();
    expect(ctrl.state.hands.player1.length).toBeLessThan(handLenBefore);
    expect(shell.querySelector('.sd-game-area')).toBeTruthy();

    // Live Pass wiring (not the stale computer-gate click).
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'passing',
      currentDice: [1, 1],
      selectedDomino: null,
      winner: null,
      passCount: 0,
    };
    ctrl.update();
    const passBtn = shell.querySelector(
      '.sd-pass-btn'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    const seatBefore = ctrl.state.currentPlayer;
    passBtn!.click();
    expect(ctrl.state.currentPlayer).not.toBe(seatBefore);
    expect(shell.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();
  });

  it('bare-root sync chrome skip + destroy clears mount', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/sum-dominoes/game-controller');

    // No #app → syncOpponentChrome early-return; board still paints.
    const bare = mountRoot();
    const ctrl = initGame(bare, true, 'medium');
    expect(bare.querySelector('.sd-game-area')).toBeTruthy();
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiDifficulty).toBe('medium');
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(bare.querySelector('.sd-roll-btn')).toBeTruthy();

    destroyGame();
    expect(bare.innerHTML).toBe('');
  });
});
