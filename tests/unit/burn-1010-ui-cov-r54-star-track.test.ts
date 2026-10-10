/**
 * q-mp-567 / UI coverage round 54 — star-track board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / call counts.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice or timing asserts. Stub AI / 3D loaders only.
 * Hex Hard 450ms untouched. Zero src product edits.
 *
 * Live tip post977 residual arms (remeasured; no dedicated *ui-cov*star-track*
 * basename before this PR — stars-bars ui-cov must not be counted):
 * board-ui onPreviewChain handlers (L271–281), gameOver banner (L295–301),
 * renderStatus winner matrix (L409–419); controller syncOpponentChrome miss
 * (L21–22), setAIDifficulty / resetGame, human/AI owl onGameEnd, 3D update
 * path + destroy-with-live-board3d, isUsingBoard3d / whenBoard3dReady.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  TRACK_LENGTH,
  type StarTrackGameState,
} from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import {
  fillChainArea,
  renderBoard,
  renderStatus,
} from '../../src/games/star-track/board-ui';
import * as starTrackAi from '../../src/games/star-track/ai';
import * as starTrackRules from '../../src/games/star-track/rules';
import * as featureFlags from '../../src/core/feature-flags';
import * as starTrackLoader from '../../src/games/star-track/board-3d-loader';
import { owlSystem } from '../../src/core/owl';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/star-track/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function gameOverState(winner: 'player1' | 'player2'): StarTrackGameState {
  return {
    ...createInitialState(),
    phase: 'gameOver',
    winner,
    player1Position: winner === 'player1' ? TRACK_LENGTH : 4,
    player2Position: winner === 'player2' ? TRACK_LENGTH : 3,
    drawnChains: null,
  };
}

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  app.appendChild(board);
  app.appendChild(status);
  return { board, status };
}

describe('q-mp-567 ui-cov-r54 star-track board-ui residuals', () => {
  it('fillChainArea gameOver mounts winner banner for both seats', () => {
    const host = document.createElement('div');
    fillChainArea(host, gameOverState('player1'));
    expect(host.querySelector('.star-track-winner')).toBeTruthy();
    expect(host.querySelector('.game-winner-banner')).toBeTruthy();
    expect(host.querySelector('.star-track-draw-btn')).toBeNull();

    fillChainArea(host, gameOverState('player2'));
    expect(host.querySelector('.star-track-winner')).toBeTruthy();
    expect(host.querySelector('.game-winner-banner')).toBeTruthy();
  });

  it('selectChain preview pointer/focus arms call onPreviewChain', () => {
    const host = document.createElement('div');
    const previewed: Array<0 | 1 | null> = [];
    const drawn = drawChains(createInitialState());
    expect(drawn.phase).toBe('selectChain');
    expect(drawn.drawnChains).toBeTruthy();

    fillChainArea(
      host,
      drawn,
      undefined,
      () => undefined,
      (index) => {
        previewed.push(index);
      },
      { allowInput: true }
    );

    const btn = host.querySelector(
      '.star-track-chain-btn[data-chain-index="0"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);

    btn.dispatchEvent(new Event('pointerenter'));
    btn.dispatchEvent(new Event('focus'));
    btn.dispatchEvent(new Event('pointerleave'));
    btn.dispatchEvent(new Event('blur'));

    expect(previewed).toEqual([0, 0, null, null]);
  });

  it('selectChain allowInput false disables chain buttons (structure only)', () => {
    const host = document.createElement('div');
    const drawn = drawChains(createInitialState());
    fillChainArea(host, drawn, undefined, () => undefined, undefined, {
      allowInput: false,
    });
    const buttons = host.querySelectorAll(
      '.star-track-chain-btn'
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(2);
    expect(buttons[0]!.disabled).toBe(true);
    expect(buttons[1]!.disabled).toBe(true);
    expect(host.querySelector('.star-track-choices')).toBeTruthy();
    expect(host.querySelector('.star-track-choice-label')).toBeTruthy();
  });

  it('renderStatus winner matrix stamps status-winner without copy pins', () => {
    const el = document.createElement('div');

    renderStatus(gameOverState('player1'), el, 'human-vs-human');
    expect(el.querySelector('.status-winner')).toBeTruthy();
    expect(el.querySelector('.star-track-progress')).toBeTruthy();

    renderStatus(gameOverState('player2'), el, 'human-vs-human');
    expect(el.querySelector('.status-winner')).toBeTruthy();

    renderStatus(gameOverState('player1'), el, 'human-vs-ai');
    expect(el.querySelector('.status-winner')).toBeTruthy();
    expect(el.querySelector('.progress-p1')).toBeTruthy();
    expect(el.querySelector('.progress-p2')).toBeTruthy();

    renderStatus(gameOverState('player2'), el, 'human-vs-ai');
    expect(el.querySelector('.status-winner')).toBeTruthy();
  });

  it('renderBoard gameOver + AI-thinking status keep structural chrome', () => {
    const board = document.createElement('div');
    renderBoard(gameOverState('player1'), board);
    expect(board.querySelector('.star-track-wrapper')).toBeTruthy();
    expect(board.querySelector('.star-track-winner')).toBeTruthy();
    expect(board.querySelector('.star-track-piece-p1')).toBeTruthy();

    const status = document.createElement('div');
    const playing = createInitialState();
    renderStatus(playing, status, 'human-vs-ai', true);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(status.querySelector('.status-winner')).toBeNull();
  });
});

describe('q-mp-567 ui-cov-r54 star-track controller residuals', () => {
  it('syncOpponentChrome no-ops without #app; setAIDifficulty + resetGame both modes', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      setAIDifficulty,
      resetGame,
      getGameState,
      destroyGame,
    } = await import('../../src/games/star-track/game-controller');

    // Bare mounts (no #app) exercise syncOpponentChrome early return.
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    expect(getGameState().phase).toBe('drawChains');
    expect(document.getElementById('app')).toBeNull();

    setAIDifficulty('hard');
    newGameVsAI('easy');
    expect(getGameState().phase).toBe('drawChains');
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();

    resetGame();
    expect(getGameState().phase).toBe('drawChains');
    expect(status.querySelector('.star-track-status')).toBeTruthy();

    newGameVsHuman();
    resetGame();
    expect(getGameState().phase).toBe('drawChains');
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();

    destroyGame();
  });

  it('destroy clears mounts; isUsingBoard3d false; whenBoard3dReady resolves', async () => {
    const {
      initGame,
      destroyGame,
      isUsingBoard3d,
      whenBoard3dReady,
      getGameState,
    } = await import('../../src/games/star-track/game-controller');

    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    const { board, status } = mountPair();
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(getGameState().phase).toBe('drawChains');

    destroyGame();
    expect(isUsingBoard3d()).toBe(false);
    await expect(whenBoard3dReady()).resolves.toBeUndefined();
    // Post-destroy paint path: no board container → render board arm skips.
    expect(board.querySelector('.star-track-wrapper')).toBeTruthy();
  });

  it('tutorial completed remounts; exit skips remount; draw click rings tutorial', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      getGameState,
      destroyGame,
    } = await import('../../src/games/star-track/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();

    // step-changed soft-miss (neither completed nor exited).
    const beforeIdx = tutorialManager.getCurrentStepIndex();
    expect(tutorialManager.getTotalSteps()).toBeGreaterThan(1);
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStepIndex()).toBe(beforeIdx + 1);

    // Human draw while tutorial active → handleAction + refreshHighlight arms.
    (board.querySelector('.star-track-draw-btn') as HTMLButtonElement).click();
    expect(getGameState().phase).toBe('selectChain');
    expect(board.querySelector('.star-track-choices')).toBeTruthy();

    const phaseBeforeExit = getGameState().phase;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(getGameState().phase).toBe(phaseBeforeExit);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getGameState().phase).toBe('drawChains');
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();
    expect(status.querySelector('.star-track-status')).toBeTruthy();

    destroyGame();
  });

  it('human win notifies owl once; AI-thinking draw click no-ops', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    vi.spyOn(starTrackAi, 'getAIChainChoice').mockReturnValue({
      chainIndex: 0,
    });

    const {
      initGame,
      newGameVsAI,
      getGameState,
      destroyGame,
    } = await import('../../src/games/star-track/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    // Force a human win on the first select (characterization of owl end arm).
    vi.spyOn(starTrackRules, 'selectChain').mockImplementationOnce((state) => ({
      ...state,
      phase: 'gameOver',
      winner: 'player1',
      player1Position: TRACK_LENGTH,
      drawnChains: null,
      selectedChain: state.drawnChains?.[0] ?? null,
      currentPlayer: 'player1',
    }));

    (board.querySelector('.star-track-draw-btn') as HTMLButtonElement).click();
    expect(getGameState().phase).toBe('selectChain');
    (
      board.querySelector(
        '.star-track-chain-btn[data-chain-index="0"]'
      ) as HTMLButtonElement
    ).click();

    expect(getGameState().phase).toBe('gameOver');
    expect(getGameState().winner).toBe('player1');
    expect(owlEnd).toHaveBeenCalledTimes(1);
    expect(owlEnd.mock.calls[0]?.[0]).toBe('star-track');
    expect(board.querySelector('.star-track-winner')).toBeTruthy();
    expect(status.querySelector('.status-winner')).toBeTruthy();

    destroyGame();
    owlEnd.mockClear();
    vi.mocked(starTrackRules.selectChain).mockRestore();

    // Fresh VsAI: after P1 move, AI thinking → draw CTA disabled / click no-op.
    initGame(board, status);
    newGameVsAI('easy');
    (board.querySelector('.star-track-draw-btn') as HTMLButtonElement).click();
    (
      board.querySelector(
        '.star-track-chain-btn[data-chain-index="0"]'
      ) as HTMLButtonElement
    ).click();
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    const drawDuringAi = board.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement | null;
    expect(drawDuringAi).toBeTruthy();
    expect(drawDuringAi!.disabled).toBe(true);
    const phaseDuringAi = getGameState().phase;
    drawDuringAi!.click();
    expect(getGameState().phase).toBe(phaseDuringAi);

    await vi.advanceTimersByTimeAsync(600);
    await vi.advanceTimersByTimeAsync(600);
    expect(getGameState().currentPlayer).toBe('player1');
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();

    destroyGame();
  });

  it('AI win notifies owl; 3d live update + destroy unmounts board3d', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const update = vi.fn();
    const unmount = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockResolvedValue({
      createStarTrackBoard3D: async (
        _host: HTMLElement,
        _onFallback: () => void
      ) => ({ update, unmount }),
    } as never);

    // Fixed stubs only — no move-choice / scoring asserts.
    vi.spyOn(starTrackAi, 'getAIChainChoice').mockReturnValue({
      chainIndex: 0,
    });
    vi.spyOn(starTrackRules, 'selectChain').mockImplementation(
      (state, index) => {
        if (state.currentPlayer === 'player2') {
          return {
            ...state,
            phase: 'gameOver',
            winner: 'player2',
            player2Position: TRACK_LENGTH,
            drawnChains: null,
            selectedChain: state.drawnChains?.[index] ?? null,
            currentPlayer: 'player2',
          };
        }
        return {
          ...state,
          phase: 'drawChains',
          currentPlayer: 'player2',
          player1Position: Math.min(
            state.player1Position + (state.drawnChains?.[index]?.length ?? 1),
            TRACK_LENGTH - 1
          ),
          drawnChains: null,
          selectedChain: state.drawnChains?.[index] ?? null,
          moveHistory: state.moveHistory,
        };
      }
    );

    const {
      initGame,
      newGameVsAI,
      whenBoard3dReady,
      isUsingBoard3d,
      getGameState,
      destroyGame,
    } = await import('../../src/games/star-track/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();

    newGameVsAI('easy');
    expect(update).toHaveBeenCalled();

    // Human draw/select via 3D callbacks passed to update.
    const lastUpdate = update.mock.calls.at(-1);
    const opts = lastUpdate?.[1] as
      | { onDrawChains?: () => void; onSelectChain?: (i: 0 | 1) => void }
      | undefined;
    expect(opts?.onDrawChains).toBeTypeOf('function');
    opts!.onDrawChains!();
    expect(getGameState().phase).toBe('selectChain');
    const afterDraw = update.mock.calls.at(-1)?.[1] as {
      onSelectChain?: (i: 0 | 1) => void;
    };
    afterDraw.onSelectChain?.(0);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(600);
    await vi.advanceTimersByTimeAsync(600);
    expect(getGameState().phase).toBe('gameOver');
    expect(getGameState().winner).toBe('player2');
    expect(owlEnd).toHaveBeenCalled();
    expect(owlEnd.mock.calls.some((c) => c[0] === 'star-track')).toBe(true);
    expect(status.querySelector('.status-winner')).toBeTruthy();

    destroyGame();
    expect(unmount).toHaveBeenCalled();
    expect(isUsingBoard3d()).toBe(false);
  });

  it('3d-captured handlers hit draw/select guard arms + tutorial select', async () => {
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockResolvedValue({
      createStarTrackBoard3D: async () => ({ update, unmount: vi.fn() }),
    } as never);
    vi.spyOn(starTrackAi, 'getAIChainChoice').mockReturnValue({
      chainIndex: 0,
    });

    const {
      initGame,
      newGameVsAI,
      startTutorial,
      whenBoard3dReady,
      getGameState,
      destroyGame,
    } = await import('../../src/games/star-track/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    await whenBoard3dReady();
    newGameVsAI('easy');

    type ChainOpts = {
      onDrawChains?: () => void;
      onSelectChain?: (i: 0 | 1) => void;
    };
    const optsAt = (i = -1): ChainOpts =>
      (update.mock.calls.at(i)?.[1] ?? {}) as ChainOpts;

    const draw = optsAt().onDrawChains;
    expect(draw).toBeTypeOf('function');

    // Wrong-phase draw guard (still human, already selecting).
    draw!();
    expect(getGameState().phase).toBe('selectChain');
    const phaseAfterDraw = getGameState().phase;
    draw!();
    expect(getGameState().phase).toBe(phaseAfterDraw);

    // Wrong-phase select captured from drawChains paint is undefined; re-read.
    const select = optsAt().onSelectChain;
    expect(select).toBeTypeOf('function');
    // Call select after forcing phase back via newGame, then wrong-phase select.
    // First: valid select → AI thinking → canHumanInteract false on captured draw/select.
    select!(0);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    const phaseAi = getGameState().phase;
    draw!();
    select!(0);
    expect(getGameState().phase).toBe(phaseAi);
    expect(getGameState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(600);
    await vi.advanceTimersByTimeAsync(600);
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().phase).toBe('drawChains');
    // Wrong-phase select while drawing (L192).
    const phaseDraw = getGameState().phase;
    select!(0);
    expect(getGameState().phase).toBe(phaseDraw);

    // Tutorial select-chain handleAction arm via 3D callbacks (structure only).
    destroyGame();
    update.mockClear();
    initGame(board, status);
    await whenBoard3dReady();
    startTutorial();
    expect(tutorialManager.getIsActive()).toBe(true);
    const tutDraw = optsAt().onDrawChains;
    expect(tutDraw).toBeTypeOf('function');
    tutDraw!();
    expect(getGameState().phase).toBe('selectChain');
    const tutSelect = optsAt().onSelectChain;
    expect(tutSelect).toBeTypeOf('function');
    tutSelect!(0);
    expect(['drawChains', 'gameOver']).toContain(getGameState().phase);

    destroyGame();
  });

  it('3d mid-load destroy + create throw stay on 2d; fallback restores SVG', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);

    let resolveMod:
      | ((mod: {
          createStarTrackBoard3D: (
            host: HTMLElement,
            onFallback: () => void
          ) => Promise<{ update: ReturnType<typeof vi.fn>; unmount: ReturnType<typeof vi.fn> }>;
        }) => void)
      | null = null;
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMod = resolve;
        })
    );

    const {
      initGame,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
      newGameVsHuman,
    } = await import('../../src/games/star-track/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    const pending = whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    // Loading: board3dEnabled && !board3d → skip 2D paint.
    expect(board.querySelector('.star-track-board')).toBeNull();
    destroyGame();
    resolveMod?.({
      createStarTrackBoard3D: async () => ({
        update: vi.fn(),
        unmount: vi.fn(),
      }),
    });
    await pending;
    expect(isUsingBoard3d()).toBe(false);

    // Create throw → catch disables 3d.
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockResolvedValue({
      createStarTrackBoard3D: async () => {
        throw new Error('WebGLRenderer failed');
      },
    } as never);
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    newGameVsHuman();
    expect(board.querySelector('.star-track-board')).toBeTruthy();
    destroyGame();

    // Live 3D then fallback callback → SVG re-render.
    const unmount = vi.fn();
    let fallback: (() => void) | undefined;
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockResolvedValue({
      createStarTrackBoard3D: async (
        _host: HTMLElement,
        onFallback: () => void
      ) => {
        fallback = onFallback;
        return { update: vi.fn(), unmount };
      },
    } as never);
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    fallback?.();
    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.star-track-board')).toBeTruthy();
    expect(status.querySelector('.star-track-status')).toBeTruthy();
    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });
});
