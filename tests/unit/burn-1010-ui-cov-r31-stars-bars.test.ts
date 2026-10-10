/**
 * q-mp-425 / UI coverage round 31 — stars-bars board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * No Stars & Bars history cap. Hex Hard 450ms untouched.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  createInitialState,
  hasValidMoves,
} from '../../src/games/stars-bars/rules';
import {
  injectStarsStyles,
  renderBoard,
  renderMoveHistory,
  renderPlayerHand,
  renderScores,
} from '../../src/games/stars-bars/board-ui';
import type {
  AttributeCard,
  BoardCell,
  StarsState,
} from '../../src/games/stars-bars/types';
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

function card(
  partial: Partial<AttributeCard> & Pick<AttributeCard, 'id' | 'shape'>
): AttributeCard {
  return {
    color: 'blue',
    size: 'small',
    thickness: 'thin',
    ...partial,
  };
}

function emptyCell(row: number, col: number, isStar = false): BoardCell {
  return { row, col, card: null, owner: null, isStar };
}

function denseEmptyBoard(): BoardCell[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, (_, row) =>
    Array.from({ length: CONFIG.BOARD_SIZE }, (__, col) =>
      emptyCell(
        row,
        col,
        ((row === 0 || row === 4) && (col === 0 || col === 4)) ||
          (row === 2 && col === 2)
      )
    )
  );
}

function selectableHandCards(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('.stars-card')].filter(
    (el) => !el.classList.contains('disabled')
  ) as HTMLElement[];
}

describe('q-mp-425 ui-cov-r31 stars-bars board-ui residuals', () => {
  it('valid cell without selectedCard + sparse preview defensive return', () => {
    const base = createInitialState();
    const cells = denseEmptyBoard();
    // Seed one card so adjacency valids exist; leave selectedCard null so the
    // preview-title arm is skipped (branch at selectedCard guard).
    cells[2]![2] = {
      row: 2,
      col: 2,
      card: card({ id: 'seed', shape: 'circle' }),
      owner: 'player1',
      isStar: true,
    };
    const placingNoSelect: StarsState = {
      ...base,
      cells,
      selectedCard: null,
      phase: 'placingCard',
      playerHands: {
        player1: [card({ id: 'hand-a', shape: 'square' })],
        player2: [],
      },
    };

    const onCell = vi.fn();
    const open = renderBoard(placingNoSelect, onCell, { allowInput: true });
    const valid = open.querySelector('.stars-cell.valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    expect(valid!.title).toBe('');
    valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onCell).toHaveBeenCalled();

    // Sparse hole at a placement coord: empty-board path still lists every
    // (row,col), but renderBoard skips missing cells before preview. Force a
    // selectedCard + hole so calculatePreviewScore's undefined-cell return is
    // reachable if a valid coord somehow survives (defensive arm).
    const sparse = denseEmptyBoard();
    delete (sparse[0] as BoardCell[])[1];
    const selected = card({ id: 'preview-hole', shape: 'triangle' });
    const holeState: StarsState = {
      ...base,
      cells: sparse,
      selectedCard: selected,
      phase: 'placingCard',
      playerHands: { player1: [selected], player2: [] },
    };
    expect(() => renderBoard(holeState, () => undefined)).not.toThrow();
    const painted = renderBoard(holeState, () => undefined);
    expect(painted.querySelectorAll('.stars-cell').length).toBeLessThan(
      CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE
    );

    injectStarsStyles();
    injectStarsStyles();
    expect(
      renderScores(placingNoSelect).querySelectorAll('.stars-score')
    ).toHaveLength(2);
    expect(
      renderMoveHistory({
        ...base,
        moveHistory: [],
      }).querySelectorAll('.stars-move-item')
    ).toHaveLength(0);
    expect(
      renderPlayerHand(
        placingNoSelect,
        'player1',
        () => undefined
      ).querySelectorAll('.stars-card').length
    ).toBe(1);
  });
});

describe('q-mp-425 ui-cov-r31 stars-bars controller residuals', () => {
  it('post-destroy paint drop + startTutorial without mount', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/stars-bars/game-controller');

    const root = mountRoot();
    const ctrl = initGame(root);
    expect(root.querySelector('.stars-game-area')).toBeTruthy();

    destroyGame();
    expect(root.innerHTML).toBe('');

    const before = root.innerHTML;
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();
    expect(root.innerHTML).toBe(before);

    expect(isTutorialActive()).toBe(false);
    startTutorial();
    expect(isTutorialActive()).toBe(false);
  });

  it('tie banner + placing status + player2 hand select', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);

    // Tie terminal: winner null + gameOver paints banner / status arms.
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
      playerScores: {
        player1: CONFIG.TARGET_SCORE,
        player2: CONFIG.TARGET_SCORE,
      },
    };
    ctrl.update();
    expect(ctrl.state.phase).toBe('gameOver');
    expect(ctrl.state.winner).toBeNull();
    expect(shell.querySelector('.stars-winner-banner')).toBeTruthy();
    expect(shell.querySelector('.stars-status')).toBeTruthy();

    // Placing status arm after human card select.
    const deal = createInitialState();
    ctrl.state = {
      ...deal,
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
      winner: null,
    };
    ctrl.update();
    const p1Card = selectableHandCards(shell)[0];
    expect(p1Card).toBeTruthy();
    p1Card!.click();
    expect(ctrl.state.phase).toBe('placingCard');
    expect(ctrl.state.selectedCard).toBeTruthy();
    expect(shell.querySelector('.stars-status.player1')).toBeTruthy();
    expect(shell.querySelector('.stars-cell.valid')).toBeTruthy();

    // Player2 hand activate when it is their seat.
    const p2Deal = createInitialState();
    ctrl.state = {
      ...p2Deal,
      currentPlayer: 'player2',
      phase: 'selectingCard',
      selectedCard: null,
      winner: null,
    };
    ctrl.update();
    const p2Cards = selectableHandCards(shell);
    expect(p2Cards.length).toBeGreaterThan(0);
    const pickId = p2Deal.playerHands.player2[0]!.id;
    p2Cards[0]!.click();
    expect(ctrl.state.selectedCard?.id).toBe(pickId);
    expect(ctrl.state.phase).toBe('placingCard');
    expect(shell.querySelector('.stars-status.player2')).toBeTruthy();

    destroyGame();
  });

  it('newGameVsHuman + tutorial complete/exit + newGame diff retain', async () => {
    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/stars-bars/game-controller');

    const shell = mountAppShell();
    const hvh = newGameVsHuman(shell);
    expect(hvh.isAI).toBe(false);
    expect(hvh.aiPlayer).toBeNull();
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    // completed arm remounts HvH when activeContainer is still set.
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.stars-game-area')).toBeTruthy();
    destroyGame();

    // newGame without difficulty retains prior setting (diff || fallback).
    const aiShell = mountAppShell();
    const aiCtrl = initGame(aiShell, true, 'hard');
    aiCtrl.newGame(true);
    expect(aiCtrl.isAI).toBe(true);
    expect(aiCtrl.aiDifficulty).toBe('hard');
    expect(aiShell.querySelector('.stars-game-area')).toBeTruthy();

    destroyGame();
  });

  it('stubbed AI null-seat early return + pass empty-hand structure', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');
    const moveSpy = vi.spyOn(starsAi, 'getAIMove');

    // Arm timer then clear aiPlayer → makeAIMove early return (structure only).
    const nullSeatRoot = mountAppShell();
    const nullSeat = newGameVsAI(nullSeatRoot, 'easy');
    nullSeat.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingCard',
      winner: null,
    };
    nullSeat.update();
    nullSeat.aiPlayer = null;
    await vi.advanceTimersByTimeAsync(900);
    expect(nullSeat.state.phase).toBe('selectingCard');
    expect(moveSpy).not.toHaveBeenCalled();
    destroyGame();

    // Empty-hand pass chrome still mounts under human seat.
    const passRoot = mountAppShell();
    const passCtrl = newGameVsAI(passRoot, 'easy');
    passCtrl.isAI = false;
    passCtrl.aiPlayer = null;
    passCtrl.state = {
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
      winner: null,
      playerHands: {
        player1: [],
        player2: createInitialState().playerHands.player2,
      },
    };
    passCtrl.update();
    expect(hasValidMoves(passCtrl.state)).toBe(false);
    const passBtn = [...passRoot.querySelectorAll('button')].find((b) =>
      /pass/i.test(b.textContent ?? '')
    );
    expect(passBtn).toBeTruthy();
    destroyGame();
  });
});
