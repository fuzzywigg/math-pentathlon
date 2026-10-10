/**
 * q-mp-322 / UI coverage round 18 — prime-gold board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. No rules.ts / ai.ts product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  createInitialState,
  findCellByValue,
  getValidPlacements,
  hasValidMoves,
  rollDice,
} from '../../src/games/prime-gold/rules';
import {
  getPlayerName,
  injectPrimeGoldStyles,
  renderBoard,
  renderDice,
  renderExpressions,
  renderMoveHistory,
  renderScores,
} from '../../src/games/prime-gold/board-ui';
import type {
  MoveRecord,
  PrimeGoldState,
} from '../../src/games/prime-gold/types';
import * as primeAi from '../../src/games/prime-gold/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['prime-gold-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  try {
    const mod = await import('../../src/games/prime-gold/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function seededPlacing(): PrimeGoldState {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  return rollDice(createInitialState());
}

function claimAllPlacements(state: PrimeGoldState): void {
  for (const p of getValidPlacements(state)) {
    const cell = findCellByValue(state, p.value);
    if (cell) {
      cell.owner = 'player2';
    }
  }
}

describe('q-mp-322 ui-cov-r18 prime-gold board-ui residuals', () => {
  it('owner+prime class, allowInput lock, Enter activate, scores + inject', () => {
    const state = seededPlacing();
    expect(state.phase).toBe('placing');
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);

    // Mark a prime cell owned so owner + prime class arms both fire.
    for (const [, cell] of state.cells) {
      if (cell.isPrime) {
        cell.owner = 'player1';
        break;
      }
    }

    const onCell = vi.fn();
    const locked = renderBoard(state, onCell, { allowInput: false });
    expect(locked.querySelector('.pg-cell.valid')).toBeNull();
    expect(locked.querySelector('.pg-cell.player1.prime')).toBeTruthy();
    expect(locked.querySelector('.pg-legend')).toBeTruthy();

    const open = renderBoard(state, onCell, { allowInput: true });
    const valid = open.querySelector('.pg-cell.valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onCell).toHaveBeenCalled();
    expect(onCell.mock.calls[0]?.[0]).toEqual(expect.any(Number));
    expect(typeof onCell.mock.calls[0]?.[1]).toBe('string');

    injectPrimeGoldStyles();
    injectPrimeGoldStyles();
    expect(document.getElementById('prime-gold-styles')).toBeTruthy();
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(renderScores(state).classList.contains('pg-scores')).toBe(true);
  });

  it('dice/expressions arms + history sparse-hole continue', () => {
    const rolling = createInitialState();
    const onRoll = vi.fn();
    const dicePending = renderDice(rolling, onRoll);
    expect(dicePending.querySelectorAll('.pg-die')).toHaveLength(3);
    expect(dicePending.querySelector('.pg-roll-btn')).toBeTruthy();
    (dicePending.querySelector('.pg-roll-btn') as HTMLButtonElement).click();
    expect(onRoll).toHaveBeenCalledTimes(1);

    const placing = seededPlacing();
    const diceFaces = renderDice(placing, onRoll, { allowInput: true });
    expect(diceFaces.querySelector('.pg-roll-btn')).toBeNull();
    expect(
      [...diceFaces.querySelectorAll('.pg-die')].every(
        (d) => (d.textContent ?? '').length > 0 && d.textContent !== '?'
      )
    ).toBe(true);

    const onSelect = vi.fn();
    const exprs = renderExpressions(placing, onSelect);
    const item = exprs.querySelector('.pg-expr-item') as HTMLElement | null;
    expect(item).toBeTruthy();
    expect(item!.getAttribute('role')).toBe('button');
    item!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onSelect).toHaveBeenCalled();

    const thinking = renderExpressions(placing, onSelect, {
      allowInput: false,
    });
    expect(thinking.querySelector('.pg-computer-thinking')).toBeTruthy();
    expect(thinking.querySelector('.pg-expr-item')).toBeNull();

    claimAllPlacements(placing);
    const noMoves = renderExpressions(placing, onSelect);
    expect(noMoves.querySelector('.pg-expr-item')).toBeNull();
    expect(hasValidMoves(placing)).toBe(false);

    // Sparse history hole → undefined continue arm (walk still finishes).
    const move: MoveRecord = {
      player: 'player1',
      dice: { die1: 1, die2: 2, die3: 3 },
      expression: '1+2',
      result: 3,
      row: 0,
      col: 0,
    };
    const history = [move] as MoveRecord[];
    history.length = 3;
    history[2] = {
      player: 'player2',
      dice: { die1: 2, die2: 3, die3: 4 },
      expression: '2+3',
      result: 5,
      row: 1,
      col: 1,
    };
    const histEl = renderMoveHistory({
      ...createInitialState(),
      moveHistory: history,
    });
    expect(histEl.querySelectorAll('.pg-move-item').length).toBe(2);
    expect(histEl.querySelector('.pg-move-item.player1')).toBeTruthy();
    expect(histEl.querySelector('.pg-move-item.player2')).toBeTruthy();
  });
});

describe('q-mp-322 ui-cov-r18 prime-gold controller residuals', () => {
  it('human roll→place→pass; winner + tie banners; getGameState', async () => {
    const { initGame, destroyGame, getGameState } =
      await import('../../src/games/prime-gold/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, false);
    expect(root.querySelector('.pg-game-area')).toBeTruthy();
    expect(root.querySelector('.pg-board')).toBeTruthy();
    expect(getGameState()?.phase).toBe('rolling');
    expect(root.querySelector('.pg-roll-btn')).toBeTruthy();

    vi.spyOn(Math, 'random').mockReturnValue(0);
    (root.querySelector('.pg-roll-btn') as HTMLButtonElement).click();
    expect(ctrl.state.phase).toBe('placing');
    expect(ctrl.state.diceRoll).toBeTruthy();
    expect(root.querySelector('.pg-expressions')).toBeTruthy();
    expect(root.querySelector('.pg-cell.valid')).toBeTruthy();

    const valid = root.querySelector('.pg-cell.valid') as HTMLElement;
    valid.click();
    expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    expect(root.querySelector('.pg-move-history')).toBeTruthy();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('rolling');

    // Force placing with zero valids → Pass Turn control.
    const emptyPlace = seededPlacing();
    claimAllPlacements(emptyPlace);
    ctrl.state = {
      ...emptyPlace,
      currentPlayer: 'player1',
      moveHistory: ctrl.state.moveHistory,
    };
    ctrl.update();
    expect(hasValidMoves(ctrl.state)).toBe(false);
    const passBtn = root.querySelector(
      '.pg-btn.pg-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();

    // Winner banner + status seat class.
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      primeVeins: { player1: 4, player2: 1 },
    };
    ctrl.update();
    expect(root.querySelector('.pg-winner-banner')).toBeTruthy();
    expect(root.querySelector('.pg-status.player1')).toBeTruthy();
    expect(root.querySelector('.pg-btn')).toBeNull();

    // Tie arm (winner null + gameOver).
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
      primeVeins: { player1: 2, player2: 2 },
    };
    ctrl.update();
    expect(root.querySelector('.pg-winner-banner')).toBeTruthy();
    expect(root.querySelector('.pg-status')).toBeTruthy();

    destroyGame();
    expect(getGameState()).toBeNull();
  });

  it('vsAI: null placement pass + stubbed place; mid-timer gameOver; no-container tutorial', async () => {
    const {
      initGame,
      destroyGame,
      startTutorial,
      isTutorialActive,
      getGameState,
    } = await import('../../src/games/prime-gold/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');

    // Computer seat: input locked while AI pending.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    expect(root.querySelector('.pg-roll-btn')).toBeNull();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(root.querySelector('.pg-cell.valid')).toBeNull();

    // Stub AI null on placing → pass arm inside makeAIMove.
    vi.spyOn(primeAi, 'getAIPlacement').mockReturnValue(null);
    const placingEmpty = seededPlacing();
    claimAllPlacements(placingEmpty);
    ctrl.state = {
      ...placingEmpty,
      currentPlayer: 'player2',
    };
    ctrl.update();
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();

    // Stubbed place path (structure only — no move-quality asserts).
    const placing = seededPlacing();
    const pick = getValidPlacements(placing)[0]!;
    vi.mocked(primeAi.getAIPlacement).mockReturnValue({
      value: pick.value,
      expression: pick.expr,
    });
    ctrl.state = {
      ...placing,
      currentPlayer: 'player2',
    };
    ctrl.update();
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    expect(ctrl.state.moveHistory.at(-1)?.player).toBe('player2');
    expect(root.querySelector('.pg-move-history')).toBeTruthy();

    // Schedule AI then flip to gameOver before timer → early return in makeAIMove.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
    };
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.phase).toBe('gameOver');
    expect(getGameState()?.phase).toBe('gameOver');

    // startTutorial with no activeContainer (after destroy).
    destroyGame();
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    // Remount + newGame difficulty toggle; syncOpponentChrome without #app is no-op.
    document.getElementById('app')?.remove();
    const bare = mountRoot();
    const again = initGame(bare, false);
    again.newGame(true, 'hard');
    expect(again.isAI).toBe(true);
    expect(again.aiDifficulty).toBe('hard');
    expect(again.aiPlayer).toBe('player2');
    destroyGame();
  });

  it('computer-turn roll/place/pass guards no-op on stale listeners', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/prime-gold/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'medium');

    // Paint human rolling chrome, then flip seat before click.
    ctrl.state = createInitialState();
    ctrl.update();
    const rollBtn = root.querySelector('.pg-roll-btn') as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const diceBefore = ctrl.state.diceRoll;
    rollBtn.click();
    expect(ctrl.state.diceRoll).toBe(diceBefore);
    expect(ctrl.state.phase).toBe('rolling');

    // Paint placing chrome with valids, then flip seat before cell/expr click.
    const placing = seededPlacing();
    ctrl.state = { ...placing, currentPlayer: 'player1' };
    ctrl.update();
    const valid = root.querySelector('.pg-cell.valid') as HTMLElement | null;
    const expr = root.querySelector('.pg-expr-item') as HTMLElement | null;
    expect(valid).toBeTruthy();
    expect(expr).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const historyBefore = ctrl.state.moveHistory.length;
    valid!.click();
    expr!.click();
    expect(ctrl.state.moveHistory.length).toBe(historyBefore);
    expect(ctrl.state.phase).toBe('placing');

    // Pass button guard: paint pass chrome, then flip seat before click.
    const emptyPlace = seededPlacing();
    claimAllPlacements(emptyPlace);
    ctrl.state = { ...emptyPlace, currentPlayer: 'player1' };
    ctrl.update();
    const passBtn = root.querySelector(
      '.pg-btn.pg-btn-secondary'
    ) as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const seatBefore = ctrl.state.currentPlayer;
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe(seatBefore);
    expect(ctrl.state.phase).toBe('placing');

    // handlePass phase guard: paint pass, flip to rolling before click.
    ctrl.state = { ...emptyPlace, currentPlayer: 'player1' };
    ctrl.update();
    const passAgain = root.querySelector(
      '.pg-btn.pg-btn-secondary'
    ) as HTMLButtonElement;
    ctrl.state = { ...ctrl.state, phase: 'rolling', diceRoll: null };
    passAgain.click();
    expect(ctrl.state.phase).toBe('rolling');

    // Stale controller after destroy: scheduled AI must not mutate.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.update();
    destroyGame();
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();
  });

  it('expression place path + placing status; human vsAI newGame defaults', async () => {
    const {
      initGame,
      destroyGame,
      newGameVsHuman,
      newGameVsAI,
      isUsingBoard3d,
      whenBoard3dReady,
    } = await import('../../src/games/prime-gold/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, false, 'easy');
    expect(isUsingBoard3d()).toBe(false);
    await expect(whenBoard3dReady()).resolves.toBeUndefined();

    vi.spyOn(Math, 'random').mockReturnValue(0);
    ctrl.state = rollDice(ctrl.state);
    ctrl.update();
    expect(ctrl.state.phase).toBe('placing');
    expect(root.querySelector('.pg-status.player1')).toBeTruthy();
    expect(root.querySelector('.pg-expressions')).toBeTruthy();

    const expr = root.querySelector('.pg-expr-item') as HTMLElement;
    expect(expr).toBeTruthy();
    const chipsBefore = ctrl.state.playerChips.player1;
    expr.click();
    expect(ctrl.state.playerChips.player1).toBe(chipsBefore - 1);
    expect(ctrl.state.moveHistory.length).toBe(1);

    // Public helpers remount with defaults.
    destroyGame();
    const human = newGameVsHuman(root);
    expect(human.isAI).toBe(false);
    expect(human.aiPlayer).toBeNull();
    const ai = newGameVsAI(root);
    expect(ai.isAI).toBe(true);
    expect(ai.aiDifficulty).toBe('medium');
    destroyGame();
  });

  it('makeAIMove seat-flip mid-timer no-ops; tutorial completed remounts', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/prime-gold/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');

    // Schedule computer think, then flip seat without re-render so the
    // pending timer hits !isComputerTurnPending and returns.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player1' };
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player1');

    // Tutorial completed path remounts vs-human (no copy asserts).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.pg-game-area')).toBeTruthy();
    expect(root.querySelector('.pg-board')).toBeTruthy();

    destroyGame();
  });
});
