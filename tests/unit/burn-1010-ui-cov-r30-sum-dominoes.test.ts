/**
 * q-mp-400 / UI coverage round 30 — sum-dominoes board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  CONFIG,
  type Domino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import {
  injectSDStyles,
  renderBoard,
  renderDice,
  renderHand,
} from '../../src/games/sum-dominoes/board-ui';
import * as sumAi from '../../src/games/sum-dominoes/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['sd-styles'],
  fakeTimers: true,
});

afterEach(async () => {
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

describe('q-mp-400 ui-cov-r30 sum-dominoes board-ui residuals', () => {
  it('sparse board row skip + unknown pip face + inject idempotence', () => {
    const base = createInitialState();
    const sparseBoard = Array.from({ length: CONFIG.BOARD_SIZE }, () =>
      undefined
    ) as unknown as SumDominoesState['board'];
    const sparse: SumDominoesState = { ...base, board: sparseBoard };

    const board = renderBoard(sparse, () => undefined);
    expect(board.classList.contains('sd-board')).toBe(true);
    // Every row skipped → no cells/dominoes painted.
    expect(board.querySelectorAll('.sd-cell')).toHaveLength(0);
    expect(board.querySelectorAll('.sd-domino')).toHaveLength(0);

    // Unknown face values hit getPipPositions fallback (`|| []`).
    const dice = renderDice([7, 9] as [number, number], () => undefined, false);
    expect(dice.classList.contains('sd-dice-display')).toBe(false);
    expect(dice.querySelector('.sd-dice-display')).toBeTruthy();
    expect(dice.querySelectorAll('.sd-die')).toHaveLength(2);
    expect(dice.querySelectorAll('.sd-die-pip')).toHaveLength(0);

    injectSDStyles();
    injectSDStyles();
    expect(document.querySelectorAll('#sd-styles')).toHaveLength(1);
  });

  it('disabled roll chrome + empty non-current hand', () => {
    const onRoll = vi.fn();
    const emptyDice = renderDice(null, onRoll, false);
    const rollBtn = emptyDice.querySelector(
      '.sd-roll-btn'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    expect(rollBtn.disabled).toBe(true);

    const enabled = renderDice(null, onRoll, true);
    const liveBtn = enabled.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(liveBtn.disabled).toBe(false);
    liveBtn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);

    const state = seedBoard();
    const hand = renderHand(
      {
        ...state,
        phase: 'placing',
        currentDice: [3, 3],
        currentPlayer: 'player2',
        selectedDomino: 'ghost',
        hands: {
          player1: [],
          player2: [makeDomino('p2-a', 1, 1, 'player2')],
        },
      },
      'player1',
      () => undefined
    );
    expect(hand.classList.contains('sd-hand-player1')).toBe(true);
    expect(hand.getAttribute('role')).toBe('list');
    expect(hand.querySelectorAll('.sd-hand-domino')).toHaveLength(0);
  });
});

describe('q-mp-400 ui-cov-r30 sum-dominoes controller residuals', () => {
  it('post-destroy paint drop + startTutorial without mount', async () => {
    const {
      initGame,
      destroyGame,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/sum-dominoes/game-controller');

    const root = mountRoot();
    const ctrl = initGame(root);
    expect(root.querySelector('.sd-game-area')).toBeTruthy();

    destroyGame();
    expect(root.innerHTML).toBe('');

    // Paint after destroy must no-op (activeContainer cleared).
    const before = root.innerHTML;
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();
    expect(root.innerHTML).toBe(before);

    // No active mount → startTutorial early-returns.
    expect(isTutorialActive()).toBe(false);
    startTutorial();
    expect(isTutorialActive()).toBe(false);
  });

  it('player2 hand click + stale human handlers under computer seat', async () => {
    const { initGame, destroyGame } = await import(
      '../../src/games/sum-dominoes/game-controller'
    );

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);

    const playable = makeDomino('p2-play', 6, 1, 'player2');
    ctrl.state = {
      ...seedBoard(),
      hands: { player1: [], player2: [playable] },
      currentPlayer: 'player2',
      currentDice: [3, 4],
      phase: 'placing',
      selectedDomino: null,
      winner: null,
    };
    ctrl.update();

    const p2Tile = shell.querySelector(
      '.sd-hand-player2 .sd-hand-domino-playable'
    ) as HTMLElement | null;
    expect(p2Tile).toBeTruthy();
    p2Tile!.click();
    expect(ctrl.state.selectedDomino).toBe('p2-play');
    expect(
      shell.querySelector('.sd-status')?.classList.contains('player2')
    ).toBe(true);

    // Human rolling → capture Roll, then flip to computer seat without paint.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'rolling',
      currentDice: null,
      selectedDomino: null,
      winner: null,
    };
    ctrl.update();
    const rollBtn = shell.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    expect(rollBtn.disabled).toBe(false);
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    };
    rollBtn.click();
    expect(ctrl.state.currentDice).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Human placing → capture hand/cell, then flip seat without paint.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...seedBoard(),
      hands: {
        // face 1 + seed face 6 = dice sum 7
        player1: [makeDomino('p1-a', 6, 1, 'player1')],
        player2: [],
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
    ) as HTMLElement;
    expect(handTile).toBeTruthy();
    handTile.click();
    expect(ctrl.state.selectedDomino).toBe('p1-a');
    const validCell = shell.querySelector('.sd-cell-valid') as HTMLElement;
    expect(validCell).toBeTruthy();
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      winner: null,
    };
    const selectedBefore = ctrl.state.selectedDomino;
    handTile.click();
    validCell.click();
    expect(ctrl.state.selectedDomino).toBe(selectedBefore);
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Human passing → capture Pass, then flip seat without paint.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'passing',
      selectedDomino: null,
      winner: null,
      passCount: 0,
    };
    ctrl.update();
    const passBtn = shell.querySelector('.sd-pass-btn') as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'passing',
      winner: null,
      passCount: 0,
    };
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('passing');

    destroyGame();
  });

  it('tutorial roll hooks (handleAction + refreshHighlight)', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/sum-dominoes/game-controller');

    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);

    const rollBtn = shell.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    const handleSpy = vi.spyOn(tutorialManager, 'handleAction');
    const refreshSpy = vi.spyOn(tutorialManager, 'refreshHighlight');
    rollBtn.click();
    expect(handleSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
    expect(shell.querySelector('.sd-dice-display')).toBeTruthy();
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('stubbed AI controller arms — winner/null-seat/roll/place/pass (structure)', async () => {
    const { newGameVsAI, initGame, destroyGame } = await import(
      '../../src/games/sum-dominoes/game-controller'
    );
    const moveSpy = vi.spyOn(sumAi, 'getAIMove');

    // Winner early-return inside makeAIMove: arm timer, then set winner.
    const aiRoot = mountAppShell();
    const aiCtrl = newGameVsAI(aiRoot, 'easy');
    aiCtrl.state = {
      ...aiCtrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    };
    aiCtrl.update();
    expect(aiRoot.querySelector('.sd-computer-thinking')).toBeTruthy();
    aiCtrl.state = { ...aiCtrl.state, winner: 'player1' };
    await vi.advanceTimersByTimeAsync(2000);
    expect(aiCtrl.state.winner).toBe('player1');
    expect(moveSpy).not.toHaveBeenCalled();
    destroyGame();

    // Null aiPlayer early-return: arm timer, clear aiPlayer before fire.
    const nullSeatRoot = mountAppShell();
    const nullSeat = newGameVsAI(nullSeatRoot, 'easy');
    nullSeat.state = {
      ...nullSeat.state,
      winner: null,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
    };
    nullSeat.update();
    nullSeat.aiPlayer = null;
    await vi.advanceTimersByTimeAsync(2000);
    expect(nullSeat.state.phase).toBe('rolling');
    expect(nullSeat.state.currentDice).toBeNull();
    destroyGame();

    // Rolling arm: after think pause, dice are set (phase placing or passing).
    // Advance only the first think delay so a possible pass recurse cannot clear dice.
    const rollRoot = mountAppShell();
    const rollCtrl = newGameVsAI(rollRoot, 'easy');
    moveSpy.mockReturnValue(null);
    rollCtrl.state = {
      ...seedBoard(),
      hands: {
        player1: [],
        player2: [makeDomino('ai-d', 6, 1, 'player2')],
      },
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      selectedDomino: null,
      winner: null,
    };
    rollCtrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(rollCtrl.state.currentDice).not.toBeNull();
    expect(
      rollCtrl.state.phase === 'placing' || rollCtrl.state.phase === 'passing'
    ).toBe(true);
    // Fire the post-roll recurse schedule (structure only; stub stays null).
    await vi.advanceTimersByTimeAsync(600);
    expect(rollRoot.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();

    // Placing + stubbed move → getAIMove consulted (structure only).
    const placeRoot = mountAppShell();
    const placeCtrl = newGameVsAI(placeRoot, 'easy');
    const stubDomino = makeDomino('ai-place', 6, 1, 'player2');
    placeCtrl.state = {
      ...seedBoard(),
      hands: { player1: [], player2: [stubDomino] },
      currentPlayer: 'player2',
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: null,
      winner: null,
    };
    moveSpy.mockReturnValue({
      dominoId: 'ai-place',
      position: { row: CONFIG.CENTER_ROW - 1, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    });
    const handBefore = placeCtrl.state.hands.player2.length;
    placeCtrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(moveSpy).toHaveBeenCalled();
    expect(placeRoot.querySelector('.sd-game-area')).toBeTruthy();
    expect(placeCtrl.state.hands.player2.length).toBeLessThanOrEqual(handBefore);
    destroyGame();

    // Passing phase AI arm.
    const passRoot = mountAppShell();
    const passCtrl = newGameVsAI(passRoot, 'easy');
    moveSpy.mockClear();
    passCtrl.state = {
      ...passCtrl.state,
      currentPlayer: 'player2',
      phase: 'passing',
      currentDice: [1, 1],
      winner: null,
      passCount: 0,
    };
    const seatBeforePass = passCtrl.state.currentPlayer;
    passCtrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(passCtrl.state.currentPlayer).not.toBe(seatBeforePass);
    expect(moveSpy).not.toHaveBeenCalled();
    destroyGame();

    // newGame difficulty retain when diff omitted + chrome without #app.
    const bare = mountRoot();
    const bareCtrl = initGame(bare, true, 'hard');
    bareCtrl.newGame(true);
    expect(bareCtrl.aiDifficulty).toBe('hard');
    expect(bareCtrl.isAI).toBe(true);
    expect(bare.querySelector('.sd-game-area')).toBeTruthy();
    destroyGame();
  });
});

