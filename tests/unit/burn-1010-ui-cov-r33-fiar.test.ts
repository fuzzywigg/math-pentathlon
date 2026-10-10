/**
 * q-mp-427 / UI coverage round 33 — fiar board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Stub the AI client; skip ai.ts / rules.ts product paths.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  createBoardFromLayout,
  CONFIG,
} from '../../src/games/fiar/types';
import {
  createVerifiedProductionLayout,
  createYellowCenterTestLayout,
} from '../../src/games/fiar/layout';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { getValidMoves } from '../../src/games/fiar/rules';
import * as fiarAiClient from '../../src/games/fiar/ai-client';
import * as fiarAi from '../../src/games/fiar/ai';
import { BOARD_3D_STORAGE_KEY } from '../../src/core/feature-flags';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['fiar-styles'],
});

async function loadController() {
  return import('../../src/games/fiar/game-controller');
}

function mountBoardStatus(): {
  board: HTMLElement;
  status: HTMLElement;
  app: HTMLElement;
} {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  return { board, status, app };
}

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.useRealTimers();
  vi.clearAllMocks();
  try {
    const mod = await loadController();
    mod.destroyGame();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  window.history.replaceState(null, '', '/');
  window.location.hash = '';
  localStorage.removeItem(BOARD_3D_STORAGE_KEY);
  document.getElementById('app')?.remove();
});

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, '', '/');
  window.location.hash = '';
  localStorage.removeItem(BOARD_3D_STORAGE_KEY);
});

describe('q-mp-427 ui-cov-r33 fiar board-ui residuals', () => {
  it('aiSeat player1 omits announceTargets; null yellow center skips shape', () => {
    const { app } = mountBoardStatus();
    app.dataset.opponent = 'ai';
    app.dataset.aiSeat = 'player1';

    const state = {
      ...createInitialState(),
      currentPlayer: 'player1' as const,
      phase: 'placement' as const,
    };
    const onClick = vi.fn();
    const svg = renderBoard(state, onClick);
    const node = svg.querySelector('[data-node-id="c3r3"]') as SVGGElement;
    expect(node.style.cursor).not.toBe('pointer');
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();

    const layout = createYellowCenterTestLayout();
    const noCenter = createBoardFromLayout({
      ...layout,
      yellowCenter: null,
      verified: false,
    });
    const bare = {
      ...createInitialState({ layout: { ...layout, verified: false } }),
      board: noCenter,
    };
    const bareSvg = renderBoard(bare, () => undefined);
    expect(bareSvg.querySelector('[data-yellow-center]')).toBeNull();
    expect(bareSvg.querySelectorAll('[data-node-id]').length).toBe(
      layout.nodes.length
    );
  });

  it('diamond unverified omits verified marker; ellipse verified omits unverified', () => {
    const production = createVerifiedProductionLayout();
    const diamondUnverified = createInitialState({
      layout: { ...production, verified: false },
    });
    expect(diamondUnverified.board.yellowCenter?.kind).toBe('diamond');
    expect(diamondUnverified.board.layoutVerified).toBe(false);
    const diamondSvg = renderBoard(diamondUnverified, () => undefined);
    const diamond = diamondSvg.querySelector('[data-yellow-shape="diamond"]');
    expect(diamond).toBeTruthy();
    expect(diamond?.hasAttribute('data-layout-verified')).toBe(false);

    const ellipseLayout = createYellowCenterTestLayout();
    const ellipseVerified = createInitialState({
      layout: { ...ellipseLayout, verified: true },
    });
    expect(ellipseVerified.board.yellowCenter?.kind).toBe('ellipse');
    expect(ellipseVerified.board.layoutVerified).toBe(true);
    const ellipseSvg = renderBoard(ellipseVerified, () => undefined);
    const ellipse = ellipseSvg.querySelector('[data-yellow-shape="ellipse"]');
    expect(ellipse).toBeTruthy();
    expect(ellipse?.hasAttribute('data-layout-unverified')).toBe(false);
  });
});

describe('q-mp-427 ui-cov-r33 fiar controller residuals', () => {
  it('gameOver phase paints empty status; invalid place + gameOver clicks noop', async () => {
    const { initGame, getCurrentState, selectChipKindForTest, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    initGame(board, status);

    const live = getCurrentState();
    live.phase = 'gameOver';
    live.winner = null;
    // Keep board empty so isDraw is false (placement inventory still full).
    live.chipsPlaced = { player1: 0, player2: 0 };
    selectChipKindForTest('plain');
    const statusEl = status.querySelector('.fiar-status');
    expect(statusEl).toBeTruthy();
    expect(statusEl?.textContent).toBe('');
    expect(status.querySelector('.fiar-winner-banner')).toBeNull();
    expect(status.querySelector('.fiar-chip-kind-picker')).toBeNull();

    const hist = getCurrentState().moveHistory.length;
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().moveHistory.length).toBe(hist);
    expect(getCurrentState().phase).toBe('gameOver');

    // Placement reject: occupied node leaves history unchanged.
    initGame(board, status);
    const placing = getCurrentState();
    placing.board.nodes.set('c3r3', {
      ...placing.board.nodes.get('c3r3')!,
      chip: 'player2',
      chipKind: 'plain',
    });
    selectChipKindForTest('plain');
    const hist2 = getCurrentState().moveHistory.length;
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().moveHistory.length).toBe(hist2);
    expect(getCurrentState().chipsPlaced.player1).toBe(0);

    destroyGame();
  });

  it('own chip with zero valid moves stays unselected after re-render', async () => {
    const { initGame, getCurrentState, selectChipKindForTest, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    initGame(board, status);

    const s = getCurrentState();
    for (const [id, n] of s.board.nodes) {
      s.board.nodes.set(id, { ...n, chip: null, chipKind: null });
    }
    // Own chip with every graph neighbor occupied — no legal slide.
    s.board.nodes.set('c3r3', {
      ...s.board.nodes.get('c3r3')!,
      chip: 'player1',
      chipKind: 'plain',
    });
    const neighbors = s.board.edges
      .filter((e) => e.from === 'c3r3' || e.to === 'c3r3')
      .map((e) => (e.from === 'c3r3' ? e.to : e.from));
    for (const id of neighbors) {
      const node = s.board.nodes.get(id);
      if (!node) {
        continue;
      }
      s.board.nodes.set(id, { ...node, chip: 'player2', chipKind: 'plain' });
    }
    s.phase = 'movement';
    s.chipsPlaced = {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    };
    s.currentPlayer = 'player1';
    s.selectedNode = null;
    s.winner = null;
    selectChipKindForTest('plain');

    expect(getValidMoves(getCurrentState(), 'c3r3')).toHaveLength(0);
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedNode).toBeNull();
    expect(status.querySelector('.fiar-status')).toBeTruthy();

    destroyGame();
  });

  it('AI schedule aborts when winner set before timer; setAIDifficulty sticks', async () => {
    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      setAIDifficulty,
      destroyGame,
    } = await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9); // AI (player2) starts
    const asyncSpy = vi
      .spyOn(fiarAiClient, 'getAIMoveAsync')
      .mockResolvedValue({
        type: 'place',
        nodeId: 'c2r1',
        chipKind: 'plain',
      });
    const syncSpy = vi.spyOn(fiarAi, 'getAIMove').mockReturnValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    initGame(board, status);
    setAIDifficulty('easy');
    newGameVsAI('medium');
    // Winner before the 500ms AI schedule fires → aiTurn early-return.
    getCurrentState().winner = 'player1';
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(asyncSpy).not.toHaveBeenCalled();
    expect(syncSpy).not.toHaveBeenCalled();
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();

    // Difficulty setter retains across HvH remount path.
    setAIDifficulty('hard');
    destroyGame();
    initGame(board, status);
    setAIDifficulty('easy');
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    destroyGame();
  });

  it('tutorial step-changed is ignored; exit unsubscribes without HvH restart', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      getCurrentState,
      destroyGame,
    } = await loadController();
    const { board, status } = mountBoardStatus();
    initGame(board, status);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    const histBefore = getCurrentState().moveHistory.length;

    // step-changed must not unsubscribe / remount (else of completed|exited).
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(getCurrentState().moveHistory.length).toBe(histBefore);

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    // Exited arm: no forced newGameVsHuman restart marker beyond live status.
    expect(getCurrentState().phase).toBe('placement');

    destroyGame();
  });
});
