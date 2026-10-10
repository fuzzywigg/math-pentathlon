/**
 * q-mp-368 / UI coverage round 22 — fab-a-diffy board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 * Do not touch cancelFabAiRequests (owned by q-mp-253).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  calculateResult,
  createInitialState,
  findMatchingAnswers,
  selectBar1,
  selectBar2,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';
import {
  injectFabStyles,
  renderAnswerBoard,
  renderFractionBarPool,
  renderMoveHistory,
  renderOperationSelector,
  renderScores,
} from '../../src/games/fab-a-diffy/board-ui';
import type {
  FabADiffyState,
  FabMove,
} from '../../src/games/fab-a-diffy/types';
import type { AIMove } from '../../src/games/fab-a-diffy/ai';
import * as fabAiClient from '../../src/games/fab-a-diffy/ai-client';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['fab-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  try {
    const mod = await import('../../src/games/fab-a-diffy/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  fabAiClient.disposeFabAiWorker();
});

function findClaimable(state: FabADiffyState): {
  b1: string;
  b2: string;
  op: 'add' | 'subtract' | 'multiply' | 'divide';
  ans: string;
} | null {
  const unused = [...state.fractionBars.values()].filter((b) => !b.used);
  for (let i = 0; i < unused.length; i++) {
    for (let j = 0; j < unused.length; j++) {
      if (i === j) {
        continue;
      }
      for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
        const result = calculateResult(
          unused[i]!.fraction,
          unused[j]!.fraction,
          op
        );
        if (!result || result.numerator < 0) {
          continue;
        }
        const matches = findMatchingAnswers(state, result);
        if (matches.length) {
          return {
            b1: unused[i]!.id,
            b2: unused[j]!.id,
            op,
            ans: matches[0]!,
          };
        }
      }
    }
  }
  return null;
}

function withZeroDenomBar2(): FabADiffyState {
  const base = createInitialState();
  const ids = [...base.fractionBars.keys()];
  const b1 = ids[0]!;
  const b2 = ids[1]!;
  const bars = new Map(base.fractionBars);
  bars.set(b2, {
    ...bars.get(b2)!,
    fraction: { numerator: 0, denominator: 4 },
  });
  let state: FabADiffyState = { ...base, fractionBars: bars };
  state = selectBar2(selectBar1(state, b1), b2);
  return selectOperation(state, 'divide');
}

describe('q-mp-368 ui-cov-r22 fab-a-diffy board-ui residuals', () => {
  it('allowInput:false suppresses bar/op/answer interactivity chrome', () => {
    const found = findClaimable(createInitialState());
    expect(found).not.toBeNull();
    let state = selectBar2(
      selectBar1(createInitialState(), found!.b1),
      found!.b2
    );
    state = selectOperation(state, found!.op);

    const bars = renderFractionBarPool(state, vi.fn(), { allowInput: false });
    expect(bars.querySelector('.fab-bar-selected')).toBeNull();
    expect(
      bars.querySelector('.fab-bar-wrapper:not(.fab-bar-disabled)')
    ).toBeNull();

    const ops = renderOperationSelector(state, vi.fn(), { allowInput: false });
    expect(ops.querySelector('.fab-op-selected')).toBeNull();
    expect(ops.querySelector('.fab-op-valid')).toBeNull();
    const opBtns = [
      ...ops.querySelectorAll('.fab-op-btn'),
    ] as HTMLButtonElement[];
    expect(opBtns.length).toBe(4);
    expect(opBtns.every((b) => b.disabled)).toBe(true);

    const answers = renderAnswerBoard(state, vi.fn(), { allowInput: false });
    expect(answers.querySelector('.fab-answer-matchable')).toBeNull();
  });

  it('history skips moves with missing bar/answer ids; null-result answer arm', () => {
    const base = createInitialState();
    const orphan: FabMove = {
      player: 'player1',
      bar1Id: 'missing-bar-1',
      bar2Id: 'missing-bar-2',
      operation: 'add',
      resultId: 'missing-answer',
      moveNumber: 1,
    };
    const hist = renderMoveHistory({ ...base, moveHistory: [orphan] });
    expect(hist.classList.contains('fab-history')).toBe(true);
    expect(hist.querySelector('.fab-history-list')).toBeTruthy();
    expect(hist.querySelector('.fab-history-move')).toBeNull();

    // selectedOperation + ÷0 → calculateResult null → matchable set stays empty.
    const divZero = withZeroDenomBar2();
    const answers = renderAnswerBoard(divZero, vi.fn());
    expect(answers.querySelector('.fab-answer-matchable')).toBeNull();
    expect(answers.querySelector('.fab-answer-grid')).toBeTruthy();
  });

  it('bar pool defensive continue when denom group Map.get misses', () => {
    const state = createInitialState();
    const origGet = Map.prototype.get;
    let skipKeys = 0;
    vi.spyOn(Map.prototype, 'get').mockImplementation(function (
      this: Map<unknown, unknown>,
      key: unknown
    ) {
      // barsByDenom is keyed by denominator (number) with FractionBar[] values.
      if (typeof key === 'number' && this.size > 0) {
        const sample = this.values().next().value;
        if (
          Array.isArray(sample) &&
          sample[0] &&
          typeof sample[0] === 'object' &&
          'fraction' in (sample[0] as object)
        ) {
          skipKeys += 1;
          // Skip the first denom only so later groups still render.
          if (skipKeys === 1) {
            return undefined;
          }
        }
      }
      return origGet.call(this, key);
    });

    const el = renderFractionBarPool(state, vi.fn());
    expect(skipKeys).toBeGreaterThanOrEqual(1);
    expect(el.querySelector('.fab-bar-grid')).toBeTruthy();
    // At least one denom group still rendered (only first get was skipped).
    expect(el.querySelectorAll('.fab-bar-group').length).toBeGreaterThan(0);
  });

  it('injectFabStyles idempotent + scores/history mount classes', () => {
    injectFabStyles();
    injectFabStyles();
    expect(document.querySelectorAll('#fab-styles')).toHaveLength(1);

    const state = createInitialState();
    const scores = renderScores({ ...state, currentPlayer: 'player2' });
    expect(scores.querySelector('.fab-score-p2')).toBeTruthy();
    expect(scores.classList.contains('fab-scores')).toBe(true);
  });
});

describe('q-mp-368 ui-cov-r22 fab-a-diffy controller residuals', () => {
  it('post-destroy paint drop + startTutorial without mount + tutorial exit', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/fab-a-diffy/game-controller');

    // No active container → startTutorial early return.
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    // Bare root (no #app) → syncOpponentChrome early return arm.
    const root = mountRoot();
    const ctrl = initGame(root, false);
    expect(root.querySelector('.fab-game-area')).toBeTruthy();

    destroyGame();
    expect(root.childNodes.length).toBe(0);
    expect(() => {
      ctrl.update();
    }).not.toThrow();
    expect(root.querySelector('.fab-game-area')).toBeNull();

    // Remount + tutorial exit unsubscribe arm (not complete).
    const shell = mountAppShell();
    initGame(shell, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('answer wrong-phase guard + confirmingMove scrollIntoView + newGame diff', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/fab-a-diffy/game-controller');

    const root = mountAppShell();
    const ctrl = newGameVsHuman(root);
    const found = findClaimable(ctrl.state);
    expect(found).not.toBeNull();

    // Forge matchable chrome while phase is still selectingBar1 → early return.
    ctrl.state = {
      ...selectOperation(
        selectBar2(selectBar1(ctrl.state, found!.b1), found!.b2),
        found!.op
      ),
      phase: 'selectingBar1',
    };
    ctrl.update();
    const matchable = root.querySelector(
      `.fab-answer-matchable[data-answer-id="${found!.ans}"]`
    ) as HTMLElement | null;
    expect(matchable).toBeTruthy();
    const phaseBefore = ctrl.state.phase;
    const histBefore = ctrl.state.moveHistory.length;
    matchable!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe(phaseBefore);
    expect(ctrl.state.moveHistory.length).toBe(histBefore);

    // confirmingMove → requestAnimationFrame scrollIntoView (structure only).
    // jsdom omits scrollIntoView — define then wrap so the controller arm runs.
    const scrollSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollSpy,
    });
    // Recompute claimable on a fresh state (createInitialState shuffles ids).
    const confirmOpen = createInitialState();
    const confirmClaim = findClaimable(confirmOpen);
    expect(confirmClaim).not.toBeNull();
    ctrl.state = selectOperation(
      selectBar2(selectBar1(confirmOpen, confirmClaim!.b1), confirmClaim!.b2),
      confirmClaim!.op
    );
    expect(ctrl.state.phase).toBe('confirmingMove');
    ctrl.update();
    expect(root.querySelector('.fab-answer-matchable')).toBeTruthy();
    // Vitest fake timers schedule rAF as a timer tick.
    await vi.advanceTimersByTimeAsync(16);
    await vi.runOnlyPendingTimersAsync();
    expect(scrollSpy).toHaveBeenCalled();
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');

    // newGame(vsAI) without difficulty keeps prior aiDifficulty (|| arm).
    ctrl.aiDifficulty = 'hard';
    ctrl.newGame(true);
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiDifficulty).toBe('hard');
    ctrl.newGame(false, 'easy');
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiDifficulty).toBe('easy');

    destroyGame();
  });

  it('stubbed AI null/reject/stale arms + non-null apply (structure only)', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/fab-a-diffy/game-controller');

    const root = mountAppShell();
    const ctrl = newGameVsAI(root, 'easy');

    // Arm scheduleAI, then flip winner before the think-delay fires → line 330.
    vi.spyOn(fabAiClient, 'getAIMoveAsync').mockResolvedValue(null);
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      winner: null,
      phase: 'selectingBar1',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    ctrl.state = { ...ctrl.state, winner: 'player1', phase: 'gameOver' };
    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    expect(fabAiClient.getAIMoveAsync).not.toHaveBeenCalled();
    expect(ctrl.state.winner).toBe('player1');

    // Arm scheduleAI, then clear aiPlayer before fire → !aiPlayer early return.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      winner: null,
      phase: 'selectingBar1',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    ctrl.aiPlayer = null;
    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    expect(fabAiClient.getAIMoveAsync).not.toHaveBeenCalled();

    ctrl.aiPlayer = 'player2';
    let resolvePending: ((v: AIMove | null) => void) | null = null;
    vi.mocked(fabAiClient.getAIMoveAsync).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePending = resolve;
        })
    );
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(fabAiClient.getAIMoveAsync).toHaveBeenCalled();

    // Stale state reference while in-flight → early return (no pass/apply).
    const seatBefore = ctrl.state.currentPlayer;
    ctrl.state = { ...ctrl.state };
    resolvePending!(null);
    await Promise.resolve();
    await Promise.resolve();
    expect(ctrl.state.currentPlayer).toBe(seatBefore);

    // Reject path → catch → passTurn soft path (structure only).
    vi.mocked(fabAiClient.getAIMoveAsync).mockRejectedValue(
      new Error('worker-down')
    );
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    await Promise.resolve();
    expect(ctrl.state.currentPlayer).toBe('player1');

    // Generation bump mid-flight → ignore resolved move.
    resolvePending = null;
    vi.mocked(fabAiClient.getAIMoveAsync).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePending = resolve;
        })
    );
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
    };
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    const histBeforeGen = ctrl.state.moveHistory.length;
    ctrl.newGame(true, 'easy');
    const found = findClaimable(createInitialState());
    expect(found).not.toBeNull();
    resolvePending!({
      bar1Id: found!.b1,
      bar2Id: found!.b2,
      operation: found!.op,
      answerId: found!.ans,
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(ctrl.state.moveHistory.length).toBe(histBeforeGen);
    expect(ctrl.state.currentPlayer).toBe('player1');

    // Stubbed non-null AI move → applyAIMoveSteps arm (structure only).
    const open = createInitialState();
    const claim = findClaimable(open);
    expect(claim).not.toBeNull();
    vi.mocked(fabAiClient.getAIMoveAsync).mockResolvedValue({
      bar1Id: claim!.b1,
      bar2Id: claim!.b2,
      operation: claim!.op,
      answerId: claim!.ans,
    });
    ctrl.state = { ...open, currentPlayer: 'player2' };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    await Promise.resolve();
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(ctrl.state.moveHistory[0]?.player).toBe('player2');

    // selectingBar2 handleBarClick arm (phase field only — no copy assert).
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = createInitialState();
    ctrl.update();
    const openIds = [...ctrl.state.fractionBars.keys()];
    (
      root.querySelector(`[data-bar-id="${openIds[0]}"]`) as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingBar2');
    (
      root.querySelector(`[data-bar-id="${openIds[1]}"]`) as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingOperation');

    destroyGame();
  });
});
