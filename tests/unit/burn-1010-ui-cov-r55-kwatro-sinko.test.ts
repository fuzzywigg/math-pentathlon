/**
 * q-mp-582 / UI coverage round 55 — kwatro-sinko board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / call counts.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice or timing asserts. Stub AI / 3D loaders only.
 * Hex Hard 450ms untouched. Zero src product edits.
 *
 * Live tip post1012 residual arms (remeasured; dedicated *ui-cov*kwatro*
 * basenames exist from r7/r13/r15 — this round closes controller soft-miss
 * guards left after those suites):
 * mount-time 3D create callbacks; computer-turn clear/pass click guards (2D+3D);
 * handleChip/Node computer-turn soft-miss; makeAIMove stale-controller /
 * wrong-seat soft-miss (AI stubbed); newGame HvH + difficulty-keep;
 * whenBoard3dReady post-destroy; winner-without-alignment 3D chrome;
 * tutorial exited arm.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';
import {
  renderBoard,
  renderChipInfo,
} from '../../src/games/kwatro-sinko/board-ui';
import type { KwaState } from '../../src/games/kwatro-sinko/types';
import * as kwatroAi from '../../src/games/kwatro-sinko/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as kwatroLoader from '../../src/games/kwatro-sinko/board-3d-loader';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['kwa-styles'],
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/kwatro-sinko/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function blockOwnerMoves(
  state: KwaState,
  owner: 'player1' | 'player2'
): KwaState {
  const nodes = new Map(state.nodes);
  for (const chip of state.chips.values()) {
    if (chip.owner === owner && chip.position) {
      const node = nodes.get(chip.position);
      if (node) nodes.set(chip.position, { ...node, connections: [] });
    }
  }
  return { ...state, nodes };
}

function mountAppRoot(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const root = mountRoot();
  app.appendChild(root);
  return root;
}

describe('q-mp-582 ui-cov-r55 kwatro board-ui residuals', () => {
  it('allowInput false keeps grid chrome without selectable/valid classes', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const selected: KwaState = {
      ...base,
      selectedChip: chip.id,
      phase: 'selectingDest',
    };
    const el = renderBoard(
      selected,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    expect(el.classList.contains('kwa-board')).toBe(true);
    expect(el.querySelector('.kwa-svg')).toBeTruthy();
    expect(el.querySelectorAll('.kwa-selectable-chip')).toHaveLength(0);
    expect(el.querySelectorAll('.kwa-valid-node')).toHaveLength(0);
    expect(el.querySelectorAll('[data-node-id]').length).toBeGreaterThan(0);
  });

  it('renderChipInfo mounts both seat info hosts (structure only)', () => {
    const info = renderChipInfo(createInitialState());
    expect(info.classList.contains('kwa-chip-info')).toBe(true);
    expect(info.querySelector('.kwa-player-info.player1')).toBeTruthy();
    expect(info.querySelector('.kwa-player-info.player2')).toBeTruthy();
    expect(info.querySelectorAll('.label').length).toBe(2);
  });
});

describe('q-mp-582 ui-cov-r55 kwatro controller residuals', () => {
  it('newGame HvH + difficulty-keep; whenBoard3dReady resolves post-destroy', async () => {
    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountAppRoot();
    const ctrl = initGame(root, true, 'hard');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(ctrl.isAI).toBe(true);

    // Keep prior difficulty when diff omitted; flip to HvH (aiPlayer null arm).
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(ctrl.state.phase).toBe('selectingChip');
    expect(root.querySelector('.kwa-game-area')).toBeTruthy();
    expect(root.querySelector('.kwa-board')).toBeTruthy();

    // HvH update still paints selectingDest status chrome.
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-status.player1')).toBeTruthy();
    expect(root.querySelector('.kwa-controls .kwa-btn-secondary')).toBeTruthy();

    // gameOver without winner: status else-if chain soft-miss (no selectingDest).
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
    };
    ctrl.update();
    expect(root.querySelector('.kwa-status')).toBeTruthy();
    expect(root.querySelector('.kwa-winner-banner')).toBeNull();

    destroyGame();
    expect(isUsingBoard3d()).toBe(false);
    await expect(whenBoard3dReady()).resolves.toBeUndefined();
  });

  it('2D clear/pass click guards no-op while computer turn pending', async () => {
    vi.spyOn(kwatroAi, 'getAIMove').mockReturnValue(null);

    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountAppRoot();
    const ctrl = newGameVsHuman(root);

    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    const clearBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    // Flip to AI seat without repaint so the clear control stays mounted.
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const selectedBefore = ctrl.state.selectedChip;
    const phaseBefore = ctrl.state.phase;
    clearBtn.click();
    expect(ctrl.state.selectedChip).toBe(selectedBefore);
    expect(ctrl.state.phase).toBe(phaseBefore);

    // Repaint as human with no moves → Pass control; then pending-AI click no-op.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = blockOwnerMoves(
      { ...createInitialState(), currentPlayer: 'player1' },
      'player1'
    );
    ctrl.update();
    const passBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const playerBefore = ctrl.state.currentPlayer;
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe(playerBefore);

    destroyGame();
  });

  it('3D mount callbacks hit chip/node computer-turn soft-miss; clear/pass arms', async () => {
    vi.spyOn(kwatroAi, 'getAIMove').mockReturnValue(null);

    let mountNode: ((id: string) => void) | undefined;
    let mountChip: ((id: string) => void) | undefined;
    const update = vi.fn();
    const unmount = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockResolvedValue({
      createKwatroSinkoBoard3D: async (
        _host: HTMLElement,
        onNode: (id: string) => void,
        onChip: (id: string) => void
      ) => {
        mountNode = onNode;
        mountChip = onChip;
        return { update, unmount };
      },
    } as never);

    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountAppRoot();
    const ctrl = initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(typeof mountNode).toBe('function');
    expect(typeof mountChip).toBe('function');

    // Human select via mount-time chip callback (covers create arrow bodies).
    const chip = [...ctrl.state.chips.values()].find(
      (c) => c.owner === 'player1'
    )!;
    mountChip?.(chip.id);
    expect(ctrl.state.selectedChip).toBe(chip.id);
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-controls .kwa-btn-secondary')).toBeTruthy();

    // 3D clear success path (human).
    (
      root.querySelector(
        '.kwa-controls .kwa-btn-secondary'
      ) as HTMLButtonElement
    ).click();
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');

    // Re-select, then computer-pending clear guard (no repaint).
    mountChip?.(chip.id);
    const clearBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement;
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const selectedBefore = ctrl.state.selectedChip;
    clearBtn.click();
    expect(ctrl.state.selectedChip).toBe(selectedBefore);

    // Mount callbacks while computer turn pending → soft-miss returns.
    const phaseAi = ctrl.state.phase;
    mountChip?.(chip.id);
    mountNode?.(chip.position!);
    expect(ctrl.state.selectedChip).toBe(selectedBefore);
    expect(ctrl.state.phase).toBe(phaseAi);
    expect(ctrl.state.currentPlayer).toBe('player2');

    // 3D pass control success then computer-pending pass guard.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = blockOwnerMoves(
      { ...createInitialState(), currentPlayer: 'player1' },
      'player1'
    );
    ctrl.update();
    const passBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe('player2');

    ctrl.state = blockOwnerMoves(
      { ...createInitialState(), currentPlayer: 'player1' },
      'player1'
    );
    ctrl.update();
    const passBtn2 = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement;
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const seatBefore = ctrl.state.currentPlayer;
    passBtn2.click();
    expect(ctrl.state.currentPlayer).toBe(seatBefore);

    // Winner without winningAlignment on 3D chrome (expr host absent).
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: null,
    };
    ctrl.update();
    expect(root.querySelector('.kwa-winner-banner')).toBeTruthy();
    expect(root.querySelector('.kwa-winning-expr')).toBeNull();
    expect(root.querySelector('.kwa-status')).toBeTruthy();

    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });

  it('makeAIMove soft-miss: wrong seat + stale controller (AI stubbed)', async () => {
    const getAIMove = vi.spyOn(kwatroAi, 'getAIMove').mockReturnValue(null);

    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountAppRoot();
    const ctrl = newGameVsAI(root, 'easy');

    // Schedule AI, then flip seat before timer — wrong-seat soft-miss.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingChip',
    };
    ctrl.update();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player1' };
    getAIMove.mockClear();
    await vi.advanceTimersByTimeAsync(800);
    expect(getAIMove).not.toHaveBeenCalled();
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('selectingChip');

    // Stale controller: swallow clearTimeout so destroy leaves the timer armed.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingChip',
    };
    ctrl.update();
    getAIMove.mockClear();
    const clearSpy = vi
      .spyOn(globalThis, 'clearTimeout')
      .mockImplementation(() => undefined);
    destroyGame();
    clearSpy.mockRestore();
    await vi.advanceTimersByTimeAsync(800);
    expect(getAIMove).not.toHaveBeenCalled();
  });

  it('tutorial exited arm unsubscribes without remount; context-lost w/o activeController', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockResolvedValue({
      createKwatroSinkoBoard3D: async () => ({ update, unmount }),
    } as never);

    const {
      initGame,
      startTutorial,
      isTutorialActive,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
    } = await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountAppRoot();
    // 2D tutorial exit (exited ≠ completed — no remount arm).
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    // step-changed soft-miss (neither completed nor exited).
    if (tutorialManager.getTotalSteps() > 1) {
      tutorialManager.nextStep();
      expect(isTutorialActive()).toBe(true);
    }
    const childCount = root.childElementCount;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(root.childElementCount).toBe(childCount);
    destroyGame();

    // 3D context-lost after activeController cleared (listener retained).
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    const host = root.querySelector('.kwa-board-3d-slot') as HTMLElement;
    expect(host).toBeTruthy();
    const removeSpy = vi
      .spyOn(host, 'removeEventListener')
      .mockImplementation(() => undefined);
    destroyGame();
    removeSpy.mockRestore();
    host.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    // Soft-miss path: no throw; board3d already torn down.
    expect(isUsingBoard3d()).toBe(false);
  });
});
