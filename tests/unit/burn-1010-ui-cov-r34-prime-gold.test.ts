/**
 * q-mp-419 / UI coverage round 34 — prime-gold board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. No rules.ts / ai.ts product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  createInitialState,
  getValidPlacements,
  rollDice,
} from '../../src/games/prime-gold/rules';
import {
  injectPrimeGoldStyles,
  renderBoard,
  renderDice,
  renderExpressions,
  renderMoveHistory,
  renderScores,
} from '../../src/games/prime-gold/board-ui';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import * as featureFlags from '../../src/core/feature-flags';
import * as primeGoldLoader from '../../src/games/prime-gold/board-3d-loader';
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

function fakeBoard3dModule(handlers?: {
  onCreate?: (host: HTMLElement) => void;
  updateImpl?: (
    state: PrimeGoldState,
    onPlace?: (value: number, expr: string) => void
  ) => void;
}) {
  const unmount = vi.fn();
  const update = vi.fn(
    (
      state: PrimeGoldState,
      onPlace?: (value: number, expr: string) => void
    ) => {
      handlers?.updateImpl?.(state, onPlace);
    }
  );
  let createPlace: ((value: number, expr: string) => void) | undefined;
  const createPrimeGoldBoard3D = vi.fn(
    async (
      host: HTMLElement,
      onPlace?: (value: number, expr: string) => void
    ) => {
      createPlace = onPlace;
      handlers?.onCreate?.(host);
      const canvas = document.createElement('canvas');
      canvas.setAttribute('data-mp3d', 'prime-gold');
      host.appendChild(canvas);
      return { update, unmount, canvas };
    }
  );
  return {
    createPrimeGoldBoard3D,
    update,
    unmount,
    getCreatePlace: () => createPlace,
  };
}

describe('q-mp-419 ui-cov-r34 prime-gold board-ui residuals', () => {
  it('sparse cell hole + Space activate + prime expr + empty history', () => {
    const state = seededPlacing();
    // Punch a hole so renderBoard's `if (cell)` false arm paints an empty slot.
    state.cells.delete('0,0');
    expect(state.cells.get('0,0')).toBeUndefined();

    const onCell = vi.fn();
    const board = renderBoard(state, onCell, { allowInput: true });
    const hole = board.querySelector(
      '.pg-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement | null;
    expect(hole).toBeTruthy();
    expect(hole!.dataset.value).toBeUndefined();
    expect(hole!.classList.contains('valid')).toBe(false);

    const valid = board.querySelector('.pg-cell.valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onCell).toHaveBeenCalled();
    expect(onCell.mock.calls[0]?.[0]).toEqual(expect.any(Number));

    // Click path on a valid cell (not only keyboard).
    onCell.mockClear();
    valid!.click();
    expect(onCell).toHaveBeenCalledTimes(1);

    // Prime expression chrome (class only — no copy body asserts).
    const onSelect = vi.fn();
    const exprs = renderExpressions(state, onSelect, { allowInput: true });
    const primeItem = exprs.querySelector('.pg-expr-item.prime');
    // Seeded roll may or may not yield a prime result; structure still paints.
    expect(exprs.querySelectorAll('.pg-expr-item').length).toBeGreaterThan(0);
    if (primeItem) {
      expect(primeItem.getAttribute('role')).toBe('button');
    }

    // Rolling + allowInput false → no roll button.
    const diceLocked = renderDice(createInitialState(), () => undefined, {
      allowInput: false,
    });
    expect(diceLocked.querySelector('.pg-roll-btn')).toBeNull();
    expect(diceLocked.querySelectorAll('.pg-die')).toHaveLength(3);

    // Empty history still mounts the shell.
    const hist = renderMoveHistory(createInitialState());
    expect(hist.classList.contains('pg-move-history')).toBe(true);
    expect(hist.querySelectorAll('.pg-move-item')).toHaveLength(0);

    injectPrimeGoldStyles();
    expect(document.getElementById('prime-gold-styles')).toBeTruthy();
    expect(renderScores(state).querySelectorAll('.pg-score')).toHaveLength(2);
  });
});

describe('q-mp-419 ui-cov-r34 prime-gold controller residuals', () => {
  it('3D mount + rolling/placing update arms + placement callback', async () => {
    const fake = fakeBoard3dModule();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
    } as never);

    const {
      initGame,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
      getGameState,
    } = await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(root.querySelector('.pg-board-host')).toBeTruthy();
    expect(root.querySelector('.pg-board')).toBeNull();
    expect(fake.update).toHaveBeenCalled();

    // Rolling phase → board3d.update with undefined placement handler.
    fake.update.mockClear();
    ctrl.state = createInitialState();
    ctrl.update();
    expect(fake.update).toHaveBeenCalled();
    const rollingArgs = fake.update.mock.calls.at(-1);
    expect(rollingArgs?.[1]).toBeUndefined();

    // Placing phase → placement handler wired; invoke it (structure only).
    vi.spyOn(Math, 'random').mockReturnValue(0);
    ctrl.state = rollDice(createInitialState());
    expect(ctrl.state.phase).toBe('placing');
    fake.update.mockClear();
    ctrl.update();
    const placingArgs = fake.update.mock.calls.at(-1);
    expect(placingArgs?.[1]).toEqual(expect.any(Function));
    const pick = getValidPlacements(ctrl.state)[0]!;
    const chipsBefore = ctrl.state.playerChips.player1;
    (placingArgs?.[1] as (v: number, e: string) => void)(pick.value, pick.expr);
    expect(ctrl.state.playerChips.player1).toBe(chipsBefore - 1);
    expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    expect(getGameState()?.moveHistory.length).toBeGreaterThan(0);

    // Host persists across chrome rebuilds (detach + re-append).
    const hostBefore = root.querySelector('.pg-board-host');
    expect(hostBefore).toBeTruthy();
    ctrl.update();
    expect(root.querySelector('.pg-board-host')).toBe(hostBefore);

    // createPrimeGoldBoard3D mount-time place callback (activeController arm).
    const createPlace = fake.getCreatePlace();
    expect(createPlace).toEqual(expect.any(Function));
    vi.spyOn(Math, 'random').mockReturnValue(0);
    ctrl.state = rollDice(createInitialState());
    const mountPick = getValidPlacements(ctrl.state)[0]!;
    const histBefore = ctrl.state.moveHistory.length;
    createPlace!(mountPick.value, mountPick.expr);
    expect(ctrl.state.moveHistory.length).toBe(histBefore + 1);

    destroyGame();
    expect(fake.unmount).toHaveBeenCalled();
    expect(isUsingBoard3d()).toBe(false);

    // Post-destroy create-place callback no-ops (activeController null arm).
    expect(() => createPlace!(mountPick.value, mountPick.expr)).not.toThrow();
  });

  it('3D context-lost fallback + loader reject + mid-load abort', async () => {
    let hostEl: HTMLElement | null = null;
    const fake = fakeBoard3dModule({
      onCreate: (host) => {
        hostEl = host;
      },
    });
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
    } as never);

    const {
      initGame,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
      getGameState,
    } = await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(hostEl).toBeTruthy();

    // Mutate state, then context-lost → 2D chrome with state preserved.
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      playerChips: { ...ctrl.state.playerChips, player1: 17 },
    };
    ctrl.update();
    fake.unmount();
    hostEl!.dispatchEvent(new CustomEvent('mp3d-context-lost'));
    expect(isUsingBoard3d()).toBe(false);
    expect(root.querySelector('.pg-board')).toBeTruthy();
    expect(getGameState()?.playerChips.player1).toBe(17);
    expect(getGameState()?.phase).toBe('placing');

    destroyGame();

    // Loader reject → stay on 2D.
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );
    const again = initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(root.querySelector('.pg-board')).toBeTruthy();
    expect(again.state.phase).toBe('rolling');
    destroyGame();

    // Mid-load abort: destroy while loader pending → ensureBoard3d early-outs.
    let resolveLoad!: (v: never) => void;
    const pending = new Promise((r) => {
      resolveLoad = r as (v: never) => void;
    });
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockReturnValue(
      pending as never
    );
    initGame(root, false);
    destroyGame();
    resolveLoad({
      createPrimeGoldBoard3D: async () => ({
        update: vi.fn(),
        unmount: vi.fn(),
      }),
    } as never);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
  });

  it('DEV test hook setState + stale AI timer after destroy', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const { initGame, destroyGame, getGameState } =
      await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');

    type Hook = {
      getState: () => PrimeGoldState;
      setState: (state: PrimeGoldState) => void;
    };
    const hook = (window as Window & { __mpPrimeGoldTest?: Hook })
      .__mpPrimeGoldTest;
    expect(hook).toBeTruthy();
    expect(hook!.getState().phase).toBe('rolling');

    const placing = seededPlacing();
    hook!.setState({ ...placing, currentPlayer: 'player1' });
    expect(getGameState()?.phase).toBe('placing');
    expect(root.querySelector('.pg-expressions')).toBeTruthy();

    // Capture the pending AI callback, destroy (clears timer), then invoke
    // the stale callback so makeAIMove hits activeController !== controller.
    const timeouts: Array<() => void> = [];
    const realSetTimeout = globalThis.setTimeout;
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((
      fn: TimerHandler,
      _ms?: number
    ) => {
      if (typeof fn === 'function') {
        timeouts.push(fn as () => void);
      }
      return 0 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout);

    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    expect(timeouts.length).toBeGreaterThan(0);
    const stale = timeouts.at(-1)!;

    destroyGame();
    expect(
      (window as Window & { __mpPrimeGoldTest?: unknown }).__mpPrimeGoldTest
    ).toBeUndefined();
    expect(getGameState()).toBeNull();

    // Stale timer body must not throw / mutate a destroyed controller.
    expect(() => stale()).not.toThrow();
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();

    vi.mocked(globalThis.setTimeout).mockImplementation(
      realSetTimeout as typeof setTimeout
    );
  });

  it('tutorial exited remount skip + newGame difficulty retain + AI null seat', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(primeAi, 'getAIPlacement').mockReturnValue(null);

    const {
      initGame,
      destroyGame,
      startTutorial,
      isTutorialActive,
      newGameVsAI,
    } = await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, true, 'hard');
    expect(ctrl.aiDifficulty).toBe('hard');

    // newGame without difficulty arg retains prior difficulty.
    ctrl.newGame(true);
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(ctrl.aiPlayer).toBe('player2');

    // Tutorial exited path (not completed) — no remount-to-human side effect
    // beyond unsubscribe; structure only.
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.pg-game-area')).toBeTruthy();

    // AI placing with stubbed null placement → pass arm (structure only).
    const ai = newGameVsAI(root, 'easy');
    const empty = seededPlacing();
    for (const [, cell] of empty.cells) {
      cell.owner = 'player1';
    }
    ai.state = { ...empty, currentPlayer: 'player2', phase: 'placing' };
    ai.update();
    await vi.advanceTimersByTimeAsync(900);
    expect(ai.state.currentPlayer).toBe('player1');
    expect(ai.state.phase).toBe('rolling');
    expect(ai.state.diceRoll).toBeNull();

    // Bare root (no #app) syncOpponentChrome no-op still paints.
    destroyGame();
    document.getElementById('app')?.remove();
    const bare = mountRoot();
    const again = initGame(bare, false);
    again.newGame(false);
    expect(again.isAI).toBe(false);
    expect(bare.querySelector('.pg-game-area')).toBeTruthy();
    destroyGame();
  });

  it('makeAIMove !aiPlayer early return after seat cleared mid-timer', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const { initGame, destroyGame } =
      await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, true, 'medium');

    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();

    // Clear AI seat without destroy so the pending timer still fires but
    // isComputerTurnPending / !aiPlayer guards return.
    ctrl.aiPlayer = null;
    ctrl.isAI = false;
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.diceRoll).toBeNull();

    destroyGame();
  });
});
