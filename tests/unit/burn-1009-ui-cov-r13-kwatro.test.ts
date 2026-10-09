/**
 * q-mp-250 / UI coverage round 13 — kwatro-sinko board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Orthogonal to #745 mutation-ui6-kwatro-board-ui (separate file; no shared edits).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  getValidMoves,
  moveChip,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';
import {
  renderBoard,
  renderMoveHistory,
} from '../../src/games/kwatro-sinko/board-ui';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';
import * as featureFlags from '../../src/core/feature-flags';
import * as kwatroLoader from '../../src/games/kwatro-sinko/board-3d-loader';

installDomHooks({
  fakeTimers: true,
  styleIds: ['kwa-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/kwatro-sinko/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function placeChip(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);
  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);
  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }
  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (node) nodes.set(nodeId, { ...node, chip: updated });
  return { ...state, nodes, chips };
}

/** Blue: 6 + 2 − 3 = 5 along row 2; all Blue chips off numbered rows */
function forgeFiveWinSetup(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // 6
  state = placeChip(state, 'p2-1', 'n2-1'); // 3
  state = placeChip(state, 'p1-1', 'n1-2'); // 2 → n2-2
  state = placeChip(state, 'p1-0', 'n1-0');
  state = placeChip(state, 'p1-2', 'n1-1');
  state = placeChip(state, 'p1-4', 'n1-3');
  return state;
}

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

describe('q-mp-250 ui-cov-r13 kwatro board-ui residuals', () => {
  it('Enter activates selectable chip and valid empty destination', () => {
    const onChip = vi.fn();
    const onNode = vi.fn();
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const el = renderBoard(base, onNode, onChip);
    const chipHost = el.querySelector(`[data-node-id="${chip.position}"]`);
    expect(chipHost?.getAttribute('role')).toBe('gridcell');
    chipHost!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onChip).toHaveBeenCalledWith(chip.id);

    const selected = {
      ...base,
      selectedChip: chip.id,
      phase: 'selectingDest' as const,
    };
    const destId = getValidMoves(selected, chip.id).find(
      (id) => !selected.nodes.get(id)?.chip
    )!;
    const el2 = renderBoard(selected, onNode, onChip);
    const destHost = el2.querySelector(`[data-node-id="${destId}"]`);
    expect(destHost?.querySelector('.kwa-valid-node')).toBeTruthy();
    // Valid fill is on the circle; activate key is bound on the group.
    destHost!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onNode).toHaveBeenCalledWith(destId);
  });

  it('selectable chip click stopPropagation fires onChipClick', () => {
    const onChip = vi.fn();
    const onNode = vi.fn();
    const state = createInitialState();
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const el = renderBoard(state, onNode, onChip);
    const chipHost = el.querySelector(`[data-node-id="${chip.position}"]`);
    // Click the chip fill circle (nested group listener with stopPropagation).
    const chipFill = [...(chipHost?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('stroke') === '#333'
    );
    expect(chipFill).toBeTruthy();
    chipFill!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChip).toHaveBeenCalledWith(chip.id);
    expect(onNode).not.toHaveBeenCalled();
  });

  it('winningAlignment paints gold node fill; history list caps at 6 li', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()][0]!;
    const winNodes = ['n2-0', 'n2-1', 'n2-2'];
    const state: KwaState = {
      ...base,
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: {
        nodes: winNodes,
        chips: [chip],
        expression: '6 + 2 - 3 = 5',
        result: 5,
      },
      moveHistory: Array.from({ length: 8 }, (_, i) => ({
        player: (i % 2 === 0 ? 'player1' : 'player2') as const,
        chip,
        fromNode: 'n0-0',
        toNode: 'n1-0',
        alignment: null,
        moveNumber: i + 1,
      })),
    };
    const el = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const gold = el.querySelector(`[data-node-id="${winNodes[0]}"] circle`);
    expect(gold?.getAttribute('fill')).toBe('#ffd700');
    expect(gold?.getAttribute('stroke')).toBe('#ff9800');

    const hist = renderMoveHistory(state);
    expect(hist.classList.contains('kwa-history')).toBe(true);
    expect(hist.querySelectorAll('li.kwa-history-move')).toHaveLength(6);
  });
});

describe('q-mp-250 ui-cov-r13 kwatro controller residuals', () => {
  it('chip click → dest click advances phase/history; clear then remount move', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsHuman(root);

    const chip = [...ctrl.state.chips.values()].find(
      (c) => c.owner === 'player1'
    )!;
    const clickChipAt = (nodeId: string | null) => {
      const host = root.querySelector(`[data-node-id="${nodeId}"]`);
      const fill = [...(host?.querySelectorAll('circle') ?? [])].find(
        (c) => c.getAttribute('stroke') === '#333'
      );
      fill?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    clickChipAt(chip.position);
    expect(ctrl.state.selectedChip).toBe(chip.id);
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-status.player1')).toBeTruthy();
    expect(root.querySelector('.kwa-controls .kwa-btn-secondary')).toBeTruthy();

    // 2D chrome clears via control (chip re-click is unbound while selectingDest).
    (
      root.querySelector(
        '.kwa-controls .kwa-btn-secondary'
      ) as HTMLButtonElement
    ).click();
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');

    // Select again and move to a valid empty node.
    clickChipAt(chip.position);
    const destId = getValidMoves(ctrl.state, chip.id).find(
      (id) => !ctrl.state.nodes.get(id)?.chip
    )!;
    root
      .querySelector(`[data-node-id="${destId}"]`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(root.querySelector('.kwa-history')).toBeTruthy();
    expect(root.querySelector('.kwa-status.player2')).toBeTruthy();

    destroyGame();
  });

  it('clear + pass control clicks mutate phase/player; newGame resets', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsHuman(root);

    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    expect(ctrl.state.phase).toBe('selectingDest');
    (
      root.querySelector(
        '.kwa-controls .kwa-btn-secondary'
      ) as HTMLButtonElement
    ).click();
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');

    ctrl.state = blockOwnerMoves(ctrl.state, 'player1');
    ctrl.update();
    const passBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.selectedChip).toBeNull();

    ctrl.newGame(true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(ctrl.state.phase).toBe('selectingChip');
    expect(ctrl.state.moveHistory).toHaveLength(0);

    destroyGame();
  });

  it('winner + winningAlignment chrome; selectingDest status arm', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsHuman(root);

    const won = moveChip(selectChip(forgeFiveWinSetup(), 'p1-1'), 'n2-2');
    expect(won.phase).toBe('gameOver');
    expect(won.winningAlignment).toBeTruthy();
    ctrl.state = won;
    ctrl.update();
    expect(root.querySelector('.kwa-winner-banner')).toBeTruthy();
    expect(root.querySelector('.kwa-winning-expr')).toBeTruthy();
    expect(root.querySelector('.kwa-status')).toBeTruthy();
    // No controls while gameOver.
    expect(root.querySelector('.kwa-controls')).toBeNull();

    ctrl.state = selectChip(createInitialState(), 'p1-0');
    ctrl.update();
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-status.player1')).toBeTruthy();
    expect(root.querySelectorAll('.kwa-valid-node').length).toBeGreaterThan(0);

    destroyGame();
  });

  it('vsAI: computer-turn guard swallows human clicks; AI pass when blocked', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsAI(root, 'easy');

    // Human opens → AI seat; chrome must not expose selectable chips.
    let state = selectChip(ctrl.state, 'p1-0');
    const dest = getValidMoves(state, 'p1-0')[0]!;
    state = moveChip(state, dest);
    ctrl.state = state;
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(root.querySelectorAll('.kwa-selectable-chip')).toHaveLength(0);

    const redHome = root.querySelector('[data-node-id="n4-0"]');
    redHome?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Block AI seat completely so makeAIMove takes the pass arm (no choice assert).
    ctrl.state = blockOwnerMoves(ctrl.state, 'player2');
    // Re-schedule AI after state forge (update while AI to move).
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('selectingChip');

    destroyGame();
  });

  it('3D path: winner/expr chrome + update callbacks + clear control', async () => {
    const unmount = vi.fn();
    let capturedNode: ((id: string) => void) | undefined;
    let capturedChip: ((id: string) => void) | undefined;
    const update = vi.fn(
      (
        _state: KwaState,
        onNode?: (id: string) => void,
        onChip?: (id: string) => void
      ) => {
        capturedNode = onNode;
        capturedChip = onChip;
      }
    );
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockResolvedValue({
      createKwatroSinkoBoard3D: async () => ({ update, unmount }),
    } as never);

    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    const ctrl = initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(root.querySelector('.kwa-board-3d-slot')).toBeTruthy();

    // selectingDest status arm on 3D chrome (no SVG valid nodes).
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    expect(ctrl.state.phase).toBe('selectingDest');
    expect(root.querySelector('.kwa-status.player1')).toBeTruthy();
    expect(root.querySelector('.kwa-controls .kwa-btn-secondary')).toBeTruthy();
    expect(typeof capturedChip).toBe('function');
    expect(typeof capturedNode).toBe('function');

    // 3D chip callback: re-select same id while selectingDest deselects.
    const chipId = ctrl.state.selectedChip!;
    capturedChip?.(chipId);
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');

    capturedChip?.(chipId);
    expect(ctrl.state.selectedChip).toBe(chipId);
    const destId = getValidMoves(ctrl.state, chipId).find(
      (id) => !ctrl.state.nodes.get(id)?.chip
    )!;
    capturedNode?.(destId);
    expect(ctrl.state.moveHistory.length).toBe(1);

    // Node callback on occupied own chip during selectingChip → chip-select arm.
    ctrl.state = createInitialState();
    ctrl.update();
    const homeChip = [...ctrl.state.chips.values()].find(
      (c) => c.owner === 'player1'
    )!;
    capturedNode?.(homeChip.position!);
    expect(ctrl.state.selectedChip).toBe(homeChip.id);

    // Winner + expression on 3D path (banner without emoji arm).
    const won = moveChip(selectChip(forgeFiveWinSetup(), 'p1-1'), 'n2-2');
    ctrl.state = won;
    ctrl.update();
    expect(root.querySelector('.kwa-winner-banner')).toBeTruthy();
    expect(root.querySelector('.kwa-winning-expr')).toBeTruthy();

    // Pass control on 3D when stuck.
    ctrl.state = blockOwnerMoves(
      { ...createInitialState(), currentPlayer: 'player1' },
      'player1'
    );
    ctrl.update();
    const passBtn = root.querySelector(
      '.kwa-controls .kwa-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Computer-turn pending: 3D handlers omitted (undefined) while AI seat thinks.
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingChip',
    };
    ctrl.update();
    expect(capturedNode).toBeUndefined();
    expect(capturedChip).toBeUndefined();
    expect(root.querySelector('.kwa-controls')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });

  it('3D mount race discard + startTutorial completed remount / no-container', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    let resolveCreate!: (v: unknown) => void;
    const createGate = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    let createEntered!: () => void;
    const createStarted = new Promise<void>((resolve) => {
      createEntered = resolve;
    });
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockResolvedValue({
      createKwatroSinkoBoard3D: async () => {
        createEntered();
        await createGate;
        return { update, unmount };
      },
    } as never);

    const {
      initGame,
      destroyGame,
      whenBoard3dReady,
      startTutorial,
      isTutorialActive,
      isUsingBoard3d,
    } = await import('../../src/games/kwatro-sinko/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    // No active container — startTutorial early-return.
    destroyGame();
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    const root = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    initGame(root, false);
    const ready = whenBoard3dReady();
    // Wait until create is in-flight, then destroy → race discard unmounts.
    await createStarted;
    destroyGame();
    resolveCreate(undefined);
    await ready;
    expect(isUsingBoard3d()).toBe(false);
    expect(unmount).toHaveBeenCalled();

    // Fresh HvH + tutorial complete remounts.
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.kwa-game-area, .kwa-board')).toBeTruthy();
    destroyGame();
  });

  it('makeAIMove no-ops on gameOver; stacked AI timer guard', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsAI(root, 'easy');

    // Schedule AI, then forge gameOver before the timer fires (hits makeAIMove guard).
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingChip',
    };
    ctrl.update();
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
    };
    const before = ctrl.state.moveHistory.length;
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.moveHistory.length).toBe(before);
    expect(ctrl.state.phase).toBe('gameOver');

    // Human move schedules AI; a second update while AI pending must not stack.
    ctrl.state = createInitialState();
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    let state = selectChip(ctrl.state, 'p1-0');
    state = moveChip(state, getValidMoves(state, 'p1-0')[0]!);
    ctrl.state = state;
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');
    ctrl.update(); // must hit aiTimer !== null early-return
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    const afterOne = ctrl.state.moveHistory.length;
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.moveHistory.length).toBe(afterOne);

    destroyGame();
  });
});
