/**
 * q-mp-399 / UI coverage round 29 — hex-a-gone board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched (different game: src/games/hex). Stub AI client.
 * Skip ai.ts / rules.ts product paths. Zero src edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { mountPair } from '../helpers/mount-pair';
import {
  createInitialState,
  type HexAGoneGameState,
  type MoveRecord,
  type PlacedBlock,
  type TurnSelection,
} from '../../src/games/hex-a-gone/types';
import {
  buildSelectionArea,
  renderBoard,
  renderStatus,
} from '../../src/games/hex-a-gone/board-ui';
import { commitSelection, selectBlock } from '../../src/games/hex-a-gone/rules';
import * as hexAGoneAi from '../../src/games/hex-a-gone/ai';
import { owlSystem } from '../../src/core/owl';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/hex-a-gone/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

/** Structural type touch — knip unusedTypes PlacedBlock/TurnSelection/MoveRecord. */
function assertExportedShapeContracts(state: HexAGoneGameState): void {
  const selection: TurnSelection = state.turnSelection;
  const history: MoveRecord[] = state.moveHistory;
  const placed: PlacedBlock[] = state.placedBlocks;
  expect(selection.committed).toBeTypeOf('boolean');
  expect(Array.isArray(history)).toBe(true);
  expect(Array.isArray(placed)).toBe(true);
}

function playHumanTriangleTurn(board: HTMLElement): void {
  (
    board.querySelector(
      '.hex-a-gone-block-btn[data-shape="triangle"]:not(:disabled)'
    ) as HTMLButtonElement
  ).click();
  (board.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement).click();
  const valid = board.querySelector(
    '.hex-a-gone-cell-valid'
  ) as SVGElement | null;
  expect(valid).toBeTruthy();
  valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('q-mp-399 ui-cov-r29 hex-a-gone board-ui residuals', () => {
  it('confirm scrollIntoView arm + p2 winner banner + filled-cell block color', async () => {
    const scrollSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    let state = createInitialState();
    assertExportedShapeContracts(state);
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');

    const el = document.createElement('div');
    renderBoard(
      state,
      el,
      undefined,
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('.hex-a-gone-confirm-btn')).toBeTruthy();
    await Promise.resolve();
    expect(scrollSpy).toHaveBeenCalled();

    // Filled p2 cell with matching placedBlock → BLOCK_COLORS fill attribute.
    const filled: HexAGoneGameState = {
      ...createInitialState(),
      board: createInitialState().board.map((c, i) =>
        i === 0 ? { ...c, filled: true, filledBy: 'player2', blockId: 1 } : c
      ),
      placedBlocks: [
        {
          shape: 'rhombus',
          player: 'player2',
          q: createInitialState().board[0]!.q,
          r: createInitialState().board[0]!.r,
          rotation: 0,
        },
      ],
      nextBlockId: 2,
    };
    renderBoard(filled, el);
    const poly = el.querySelector(
      `.hex-a-gone-cell-p2[data-q="${filled.board[0]!.q}"][data-r="${filled.board[0]!.r}"]`
    );
    expect(poly).toBeTruthy();
    expect(poly!.getAttribute('fill')).toBeTruthy();

    // gameOver winner chrome (class only; no copy body assert).
    const over: HexAGoneGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
    };
    const area = buildSelectionArea(over);
    expect(area.querySelector('.hex-a-gone-winner')).toBeTruthy();
    expect(area.querySelector('.game-winner-banner')).toBeTruthy();

    renderStatus(over, el, 'human-vs-human', false);
    expect(el.querySelector('.status-winner')).toBeTruthy();
    renderStatus(createInitialState(), el, 'human-vs-ai', true);
    expect(el.querySelector('.status-ai-thinking')).toBeTruthy();
  });

  it('placing-info interactive=false + empty select status chrome', () => {
    const placing: HexAGoneGameState = {
      ...createInitialState(),
      phase: 'placeBlocks',
      turnSelection: { blocks: ['triangle'], committed: true },
      selectedBlockForPlacement: 'triangle',
    };
    const aiSeat = buildSelectionArea(placing, () => undefined, undefined, {
      interactive: false,
    });
    expect(aiSeat.querySelector('.hex-a-gone-placing-info')).toBeTruthy();
    expect(aiSeat.querySelector('.placing-hint')).toBeTruthy();
    // Bank disabled under AI-seat interactive=false.
    const btns = [
      ...aiSeat.querySelectorAll('.hex-a-gone-block-btn'),
    ] as HTMLButtonElement[];
    expect(btns.every((b) => b.disabled)).toBe(true);

    const emptySelect = buildSelectionArea(createInitialState());
    expect(
      emptySelect.querySelector('.hex-a-gone-selection-status')
    ).toBeTruthy();
    expect(emptySelect.querySelector('.hex-a-gone-confirm-btn')).toBeNull();
  });
});

describe('q-mp-399 ui-cov-r29 hex-a-gone controller residuals', () => {
  it('deselect / place-phase switch / stale confirm+cell guards / owl win', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { initGame, newGameVsHuman, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    // No #app → syncOpponentChrome early-return arm.
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();
    expect(getGameState().phase).toBe('selectBlocks');

    const triangle = board.querySelector(
      '.hex-a-gone-block-btn[data-shape="triangle"]'
    ) as HTMLButtonElement;
    triangle.click();
    expect(getGameState().turnSelection.blocks).toContain('triangle');
    // Toggle deselect arm.
    triangle.click();
    expect(getGameState().turnSelection.blocks).not.toContain('triangle');

    triangle.click();
    const square = board.querySelector(
      '.hex-a-gone-block-btn[data-shape="square"]'
    ) as HTMLButtonElement;
    square.click();
    expect(getGameState().turnSelection.blocks).toEqual(
      expect.arrayContaining(['triangle', 'square'])
    );

    const confirm = board.querySelector(
      '.hex-a-gone-confirm-btn'
    ) as HTMLButtonElement;
    confirm.click();
    expect(getGameState().phase).toBe('placeBlocks');

    // Stale confirm after phase left selectBlocks → handleConfirm early return.
    confirm.click();
    expect(getGameState().phase).toBe('placeBlocks');

    // Place-phase bank switch to the other selected shape.
    const placingSquare = board.querySelector(
      '.hex-a-gone-block-btn[data-shape="square"]'
    ) as HTMLButtonElement;
    placingSquare.click();
    expect(getGameState().selectedBlockForPlacement).toBe('square');

    const valid = board.querySelector(
      '.hex-a-gone-cell-valid'
    ) as SVGElement | null;
    expect(valid).toBeTruthy();

    // Stale cell click after mutating phase without re-render.
    getGameState().phase = 'selectBlocks';
    const beforeBlocks = getGameState().placedBlocks.length;
    valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().placedBlocks.length).toBe(beforeBlocks);

    // Restore place phase and finish remaining selected shapes → eventual win path
    // is covered separately; here place one cell for structure.
    getGameState().phase = 'placeBlocks';
    if (!getGameState().selectedBlockForPlacement) {
      getGameState().selectedBlockForPlacement = 'square';
    }
    // Re-render by toggling placement selection through live UI.
    (
      board.querySelector(
        '.hex-a-gone-block-btn[data-shape="square"]'
      ) as HTMLButtonElement
    )?.click();

    destroyGame();
    expect(owlEnd).not.toHaveBeenCalled();
  });

  it('stubbed AI multi-block place continue + null-placement settle + thinking chrome', async () => {
    vi.spyOn(hexAGoneAi, 'getAISelection').mockReturnValue({
      blocks: ['triangle', 'square'],
    });
    // First placement call succeeds; later calls may be null → settle path.
    let placeCalls = 0;
    vi.spyOn(hexAGoneAi, 'getAIPlacement').mockImplementation((state) => {
      placeCalls += 1;
      if (placeCalls === 1) {
        const empty = state.board.find((c) => !c.filled);
        return empty ? { q: empty.q, r: empty.r } : null;
      }
      // Second block: force null so controller takes first-valid or settle.
      return null;
    });

    const {
      initGame,
      newGameVsAI,
      getGameState,
      setAIDifficulty,
      destroyGame,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    setAIDifficulty('easy');
    newGameVsAI('easy');

    playHumanTriangleTurn(board);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    // Advance AI select + place delays (structure only — no timing pin).
    await vi.advanceTimersByTimeAsync(3000);
    expect(hexAGoneAi.getAISelection).toHaveBeenCalled();
    expect(placeCalls).toBeGreaterThanOrEqual(1);
    // Human seat returns or game ends — no soft-lock on Red.
    const after = getGameState();
    expect(
      after.currentPlayer === 'player1' || after.phase === 'gameOver'
    ).toBe(true);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();

    destroyGame();
  });

  it('null AI selection with leftover placeBlocks selection settles without soft-lock', async () => {
    vi.spyOn(hexAGoneAi, 'getAISelection').mockReturnValue(null);

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('medium');
    playHumanTriangleTurn(board);
    expect(getGameState().currentPlayer).toBe('player2');

    // Seed a leftover placeBlocks selection so settle clears it before pass.
    const live = getGameState();
    live.phase = 'placeBlocks';
    live.turnSelection = { blocks: ['triangle'], committed: true };
    live.selectedBlockForPlacement = 'triangle';

    await vi.advanceTimersByTimeAsync(1500);
    expect(hexAGoneAi.getAISelection).toHaveBeenCalled();
    const settled = getGameState();
    expect(
      settled.phase === 'gameOver' || settled.currentPlayer === 'player1'
    ).toBe(true);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
    destroyGame();
  });

  it('null AI placement on full board ends via placeBlocks boardFull settle', async () => {
    vi.spyOn(hexAGoneAi, 'getAISelection').mockReturnValue({
      blocks: ['triangle'],
    });
    vi.spyOn(hexAGoneAi, 'getAIPlacement').mockReturnValue(null);

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');
    playHumanTriangleTurn(board);

    // After select delay, AI commits into placeBlocks; fill board before place tick.
    await vi.advanceTimersByTimeAsync(800);
    expect(getGameState().phase).toBe('placeBlocks');
    for (const cell of getGameState().board) {
      cell.filled = true;
      cell.filledBy = cell.filledBy ?? 'player1';
    }
    await vi.advanceTimersByTimeAsync(1000);

    expect(getGameState().phase).toBe('gameOver');
    expect(getGameState().winner).toBeTruthy();
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
    destroyGame();
  });

  it('stale handlers no-op while AI thinking; place-phase early exit clears thinking', async () => {
    vi.spyOn(hexAGoneAi, 'getAISelection').mockReturnValue({
      blocks: ['triangle'],
    });
    vi.spyOn(hexAGoneAi, 'getAIPlacement').mockReturnValue({ q: 0, r: 0 });

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    // Capture select-phase confirm before commit (detached after confirm).
    (
      board.querySelector(
        '.hex-a-gone-block-btn[data-shape="triangle"]:not(:disabled)'
      ) as HTMLButtonElement
    ).click();
    const staleConfirm = board.querySelector(
      '.hex-a-gone-confirm-btn'
    ) as HTMLButtonElement;
    expect(staleConfirm).toBeTruthy();
    staleConfirm.click();

    const staleBank = board.querySelector(
      '.hex-a-gone-block-btn[data-shape="triangle"]'
    ) as HTMLButtonElement;
    const staleValid = board.querySelector(
      '.hex-a-gone-cell-valid'
    ) as SVGElement;
    expect(staleBank).toBeTruthy();
    expect(staleValid).toBeTruthy();

    // Place → AI seat; keep detached listeners from the human place paint.
    staleValid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    const midHistory = getGameState().moveHistory.length;
    const midPhase = getGameState().phase;
    staleBank.click();
    staleConfirm.click();
    staleValid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(midHistory);
    expect(getGameState().phase).toBe(midPhase);

    // Let AI select+commit, then corrupt phase so aiPlaceBlocks early-returns.
    await vi.advanceTimersByTimeAsync(800);
    expect(getGameState().phase).toBe('placeBlocks');
    getGameState().phase = 'selectBlocks';
    getGameState().selectedBlockForPlacement = null;
    await vi.advanceTimersByTimeAsync(1000);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();

    destroyGame();
  });

  it('resetGame keeps mode; tutorial completed + exited lifecycle', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      resetGame,
      startTutorial,
      isTutorialActive,
      getGameState,
      destroyGame,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const app = mountRoot({ id: 'app' });
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.append(board, status);

    initGame(board, status);
    newGameVsAI('easy');
    playHumanTriangleTurn(board);
    expect(getGameState().currentPlayer).toBe('player2');
    // reset while AI pending — generation bump clears soft-lock.
    resetGame();
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().phase).toBe('selectBlocks');
    expect(getGameState().moveHistory.length).toBe(0);

    newGameVsHuman();
    resetGame();
    expect(getGameState().phase).toBe('selectBlocks');

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    // completed arm restarts HvH.
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getGameState().phase).toBe('selectBlocks');

    destroyGame();
  });

  it('human win notifies owl once; post-destroy paint no-ops safely', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { initGame, newGameVsHuman, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();

    // Force a terminal place: fill all but one cell, commit triangle, place last.
    const live = getGameState();
    const cells = live.board;
    for (let i = 1; i < cells.length; i++) {
      cells[i]!.filled = true;
      cells[i]!.filledBy = 'player2';
    }
    (
      board.querySelector(
        '.hex-a-gone-block-btn[data-shape="triangle"]'
      ) as HTMLButtonElement
    ).click();
    (
      board.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement
    ).click();
    // Re-fill after confirm re-render may have replaced state — mutate live again.
    const placing = getGameState();
    for (let i = 1; i < placing.board.length; i++) {
      placing.board[i]!.filled = true;
      placing.board[i]!.filledBy = 'player2';
    }
    const last = placing.board.find((c) => !c.filled);
    expect(last).toBeTruthy();
    const cellEl = board.querySelector(
      `.hex-a-gone-cell[data-q="${last!.q}"][data-r="${last!.r}"]`
    ) as SVGElement | null;
    expect(cellEl).toBeTruthy();
    cellEl!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().winner).toBe('player1');
    expect(owlEnd).toHaveBeenCalledWith(
      'hex-a-gone',
      expect.objectContaining({ winner: 'player1' })
    );
    expect(status.querySelector('.status-winner')).toBeTruthy();

    // Second owl notify suppressed.
    owlEnd.mockClear();
    const hist = getGameState().moveHistory.length;
    cellEl!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(hist);
    expect(owlEnd).not.toHaveBeenCalled();

    const before = board.innerHTML;
    destroyGame();
    expect(board.innerHTML).toBe(before);
  });
});
