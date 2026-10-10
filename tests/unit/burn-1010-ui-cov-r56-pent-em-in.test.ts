/**
 * q-mp-583 / UI coverage round 56 — pent-em-in board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / chrome only.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice or timing asserts. No placement / legal-move asserts.
 * Use rules.ts / AI only for state setup; stub the AI. Hex Hard 450ms untouched.
 * Zero src product edits. Remeasured on cursor/mp-tip-post1012 after tip #1012.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { mountPair } from '../helpers/mount-pair';
import {
  createInitialState,
  type PentEmInState,
} from '../../src/games/pent-em-in/types';
import {
  placePiece,
  selectPiece,
  setPreviewPosition,
} from '../../src/games/pent-em-in/rules';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';
import * as pentAi from '../../src/games/pent-em-in/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as pentLoader from '../../src/games/pent-em-in/board-3d-loader';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['pent-em-in-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/pent-em-in/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function placePhaseState(
  shapeId: string,
  extras: Partial<PentEmInState> = {}
): PentEmInState {
  return {
    ...createInitialState(),
    phase: 'placePiece',
    selectedPiece: shapeId,
    selectedRotation: 0,
    selectedFlipped: false,
    previewPosition: null,
    winner: null,
    ...extras,
  };
}

describe('q-mp-583 ui-cov-r56 pent-em-in board-ui residuals', () => {
  it('OOB preview cells continue; invalid preview fill chrome (structure only)', () => {
    // I5 at far corner → some cells clip OOB (continue arm) + invalid fill.
    let state = selectPiece(createInitialState(), 'I5');
    state = setPreviewPosition(state, { row: 9, col: 9 });
    const svg = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    expect(svg.classList.contains('pent-board')).toBe(true);
    const preview = svg.querySelector('.preview');
    expect(preview).toBeTruthy();
    const rects = svg.querySelectorAll('.preview rect');
    // I5 has 5 cells; at least one clips OOB → fewer than 5 painted rects.
    expect(rects.length).toBeGreaterThan(0);
    expect(rects.length).toBeLessThan(5);
    // Invalid placement chrome (fill attribute only — not aria/copy pins).
    expect([...rects].every((r) => r.getAttribute('fill') === '#ff5252')).toBe(
      true
    );
  });

  it('valid in-bounds preview keeps player-seat fill chrome', () => {
    let state = selectPiece(createInitialState(), 'I5');
    state = setPreviewPosition(state, { row: 0, col: 0 });
    const svg = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const rects = svg.querySelectorAll('.preview rect');
    expect(rects.length).toBe(5);
    expect([...rects].every((r) => r.getAttribute('fill') !== '#ff5252')).toBe(
      true
    );
  });
});

describe('q-mp-583 ui-cov-r56 pent-em-in controller residuals', () => {
  it('selectPiece cell-click + null-selected place guard keep phase chrome', async () => {
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();

    // Opening selectPiece — cell click early-returns (no selectedPiece place).
    expect(getCurrentState().phase).toBe('selectPiece');
    expect(status.querySelector('.pent-piece-selector')).toBeTruthy();
    const openCell = board.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as SVGElement;
    expect(openCell).toBeTruthy();
    openCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().phase).toBe('selectPiece');
    expect(getCurrentState().selectedPiece).toBeNull();
    expect(getCurrentState().placedPieces).toHaveLength(0);

    // Injected placePiece with selectedPiece cleared → same guard arm.
    __setStateForTests({
      ...placePhaseState('X'),
      selectedPiece: null,
    });
    const placeCell = board.querySelector(
      '[data-row="2"][data-col="2"]'
    ) as SVGElement;
    placeCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().phase).toBe('placePiece');
    expect(getCurrentState().selectedPiece).toBeNull();
    expect(getCurrentState().placedPieces).toHaveLength(0);

    destroyGame();
  });

  it('gameOver without winner skips banner; keeps status host empty of place chrome', async () => {
    const { initGame, newGameVsHuman, __setStateForTests, destroyGame } =
      await import('../../src/games/pent-em-in/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();

    __setStateForTests({
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
    });
    expect(status.querySelector('.pent-winner-banner')).toBeNull();
    expect(status.querySelector('.pent-controls')).toBeNull();
    expect(status.querySelector('.pent-piece-selector')).toBeNull();
    // Status node may exist without place/select chrome.
    expect(board.querySelector('.pent-board')).toBeTruthy();

    destroyGame();
  });

  it('non-placing click under placePiece keeps selection chrome (no place assert)', async () => {
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();

    // rules.ts setup only: occupy center, then re-enter place chrome for F.
    let setup = selectPiece(createInitialState(), 'X');
    setup = placePiece(setup, 'X', { row: 4, col: 4 }, 0, false);
    const placedCount = setup.placedPieces.length;
    __setStateForTests({
      ...setup,
      currentPlayer: 'player1',
      phase: 'placePiece',
      selectedPiece: 'F',
      selectedRotation: 0,
      selectedFlipped: false,
      previewPosition: null,
      winner: null,
    });
    expect(status.querySelector('.pent-controls')).toBeTruthy();
    expect(status.querySelector('.pent-btn-cancel')).toBeTruthy();

    const occupiedCell = board.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as SVGElement;
    occupiedCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // State fields / chrome only — no legality / scoring asserts.
    expect(getCurrentState().phase).toBe('placePiece');
    expect(getCurrentState().selectedPiece).toBe('F');
    expect(getCurrentState().placedPieces).toHaveLength(placedCount);
    expect(status.querySelector('.pent-controls')).toBeTruthy();

    destroyGame();
  });

  it('stubbed AI consult after human place + clear timer (structure only)', async () => {
    const moveSpy = vi.spyOn(pentAi, 'getAIMove').mockReturnValue(null);
    const {
      initGame,
      newGameVsAI,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    initGame(board, status);
    newGameVsAI('easy');
    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));

    // Opening board: try a few anchors until seat flips (setup only).
    const anchors = [
      [4, 4],
      [5, 5],
      [3, 3],
      [2, 2],
      [6, 6],
    ] as const;
    for (const [row, col] of anchors) {
      if (getCurrentState().currentPlayer === 'player2') break;
      if (getCurrentState().phase !== 'placePiece') {
        __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
      }
      const cell = board.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      ) as SVGElement | null;
      cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(status.querySelector('.pent-status')).toBeTruthy();
    moveSpy.mockClear();
    await vi.advanceTimersByTimeAsync(600);
    expect(moveSpy).toHaveBeenCalled();
    expect(board.querySelector('.pent-board')).toBeTruthy();

    destroyGame();
  });

  it('board3d create throw stays on SVG; tutorial exit skips remount', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(pentLoader, 'loadPentEmInBoard3DModule').mockResolvedValue({
      createPentEmInBoard3D: async () => {
        throw new Error('webgl unavailable');
      },
    } as never);

    const {
      initGame,
      newGameVsHuman,
      whenBoard3dReady,
      isUsingBoard3d,
      startTutorial,
      isTutorialActive,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.pent-board')).toBeTruthy();
    newGameVsHuman();
    expect(board.querySelector('.pent-board')).toBeTruthy();

    // Tutorial exited arm (not completed) — unsubscribe without remount path.
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    const phaseDuring = getCurrentState().phase;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(getCurrentState().phase).toBe(phaseDuring);
    expect(board.querySelector('.pent-board')).toBeTruthy();

    destroyGame();
  });
});
