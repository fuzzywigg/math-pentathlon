/**
 * q-mp-296 / UI coverage round 17 — stars-bars board-ui + controller residuals.
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
  getPlayerName,
  injectStarsStyles,
  renderBoard,
  renderMoveHistory,
  renderPlayerHand,
  renderScores,
} from '../../src/games/stars-bars/board-ui';
import type {
  AttributeCard,
  BoardCell,
  MoveRecord,
  StarsState,
} from '../../src/games/stars-bars/types';
import { CONFIG } from '../../src/games/stars-bars/types';
import * as starsAi from '../../src/games/stars-bars/ai';

installDomHooks({
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
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

describe('q-mp-296 ui-cov-r17 stars-bars board-ui residuals', () => {
  it('shape SVG arms + star/owner/last-move + allowInput lock + preview title', () => {
    const shapes: AttributeCard['shape'][] = [
      'circle',
      'square',
      'rectangle',
      'triangle',
      'hexagon',
    ];
    const cells = denseEmptyBoard();
    shapes.forEach((shape, i) => {
      const row = 0;
      const col = i;
      cells[row]![col] = {
        row,
        col,
        card: card({
          id: `shape-${shape}`,
          shape,
          size: i % 2 === 0 ? 'large' : 'small',
          thickness: i % 2 === 0 ? 'thick' : 'thin',
          color: (['red', 'blue', 'yellow'] as const)[i % 3]!,
        }),
        owner: i % 2 === 0 ? 'player1' : 'player2',
        isStar: col === 0 || col === 4,
      };
    });
    // Unknown shape hits switch default arm (structural SVG still mounts).
    cells[1]![0] = {
      row: 1,
      col: 0,
      card: {
        ...card({ id: 'fallback', shape: 'circle' }),
        shape: 'octagon' as AttributeCard['shape'],
      },
      owner: 'player1',
      isStar: false,
    };

    const base = createInitialState();
    const selected = card({ id: 'preview', shape: 'circle', color: 'red' });
    const placing: StarsState = {
      ...base,
      cells,
      selectedCard: selected,
      phase: 'placingCard',
      lastMove: { row: 0, col: 0 },
      playerHands: {
        player1: [selected, ...base.playerHands.player1.slice(0, 3)],
        player2: base.playerHands.player2,
      },
    };

    const onCell = vi.fn();
    const locked = renderBoard(placing, onCell, { allowInput: false });
    expect(locked.querySelector('.stars-cell.valid')).toBeNull();
    expect(locked.querySelectorAll('svg').length).toBeGreaterThanOrEqual(6);
    expect(locked.querySelector('.stars-cell.star.player1')).toBeTruthy();
    expect(locked.querySelector('.stars-cell.last-move')).toBeTruthy();

    const open = renderBoard(placing, onCell, { allowInput: true });
    const valid = open.querySelector('.stars-cell.valid') as HTMLElement | null;
    expect(valid).toBeTruthy();
    expect(valid!.title.length).toBeGreaterThan(0);
    valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onCell).toHaveBeenCalled();
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onCell.mock.calls.length).toBeGreaterThanOrEqual(2);

    injectStarsStyles();
    injectStarsStyles();
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(renderScores(placing).classList.contains('stars-scores')).toBe(true);
  });

  it('hand disabled/selected arms + Enter activate; history hole + sparse board continues', () => {
    const base = createInitialState();
    const handCard = base.playerHands.player1[0]!;
    const selectedState: StarsState = {
      ...base,
      selectedCard: handCard,
      phase: 'placingCard',
    };

    const onCard = vi.fn();
    const active = renderPlayerHand(selectedState, 'player1', onCard);
    expect(active.querySelector('.stars-card.selected')).toBeTruthy();
    const selectable = active.querySelector(
      '.stars-card:not(.disabled)'
    ) as HTMLElement;
    selectable.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onCard).toHaveBeenCalledWith(handCard.id);

    const opponent = renderPlayerHand(selectedState, 'player2', onCard, {
      allowInput: true,
    });
    expect(opponent.querySelectorAll('.stars-card.disabled').length).toBe(
      selectedState.playerHands.player2.length
    );

    const locked = renderPlayerHand(selectedState, 'player1', onCard, {
      allowInput: false,
    });
    expect(locked.querySelector('.stars-card:not(.disabled)')).toBeNull();

    const over = renderPlayerHand(
      { ...selectedState, phase: 'gameOver' },
      'player1',
      onCard
    );
    expect(over.querySelector('.stars-card:not(.disabled)')).toBeNull();

    // Sparse history hole → undefined continue arm (uncapped loop still walks length).
    const move: MoveRecord = {
      player: 'player1',
      card: handCard,
      row: 0,
      col: 0,
      score: 2,
      breakdown: '',
    };
    const history = [move] as MoveRecord[];
    history.length = 3;
    history[2] = {
      player: 'player2',
      card: card({ id: 'h2', shape: 'triangle' }),
      row: 1,
      col: 1,
      score: 1,
      breakdown: '',
    };
    const histEl = renderMoveHistory({ ...base, moveHistory: history });
    expect(histEl.querySelectorAll('.stars-move-item').length).toBe(2);

    // Sparse board: missing row + missing cell continue arms (no throw).
    const sparseCells = denseEmptyBoard();
    delete (sparseCells[0] as BoardCell[])[2];
    sparseCells[3] = undefined as unknown as BoardCell[];
    const sparseState: StarsState = {
      ...base,
      cells: sparseCells,
      phase: 'selectingCard',
      selectedCard: null,
    };
    expect(() => renderBoard(sparseState, () => undefined)).not.toThrow();
    expect(
      renderBoard(sparseState, () => undefined).querySelectorAll('.stars-cell')
        .length
    ).toBeLessThan(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
  });

  it('preview score on star doubles via adjacency title', () => {
    const base = createInitialState();
    const cells = denseEmptyBoard();
    cells[2]![1] = {
      row: 2,
      col: 1,
      card: card({
        id: 'nbr',
        shape: 'square',
        color: 'yellow',
        size: 'large',
      }),
      owner: 'player2',
      isStar: false,
    };
    const selected = card({
      id: 'on-star',
      shape: 'circle',
      color: 'red',
      thickness: 'thick',
    });
    const placing: StarsState = {
      ...base,
      cells,
      selectedCard: selected,
      phase: 'placingCard',
      playerHands: {
        player1: [selected],
        player2: [],
      },
    };
    const el = renderBoard(placing, () => undefined);
    const starValid = el.querySelector(
      '.stars-cell.star.valid[data-row="2"][data-col="2"]'
    ) as HTMLElement | null;
    expect(starValid).toBeTruthy();
    // Structural: title encodes a positive preview (star ×2 path).
    expect(starValid!.title).toMatch(/\+\d+/);
  });
});

describe('q-mp-296 ui-cov-r17 stars-bars controller residuals', () => {
  it('human card→place, clear, pass (empty hand), winner banner', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, false);
    expect(root.querySelector('.stars-game-area')).toBeTruthy();
    expect(root.querySelector('.stars-board')).toBeTruthy();

    const p1Cards = selectableHandCards(root);
    expect(p1Cards.length).toBeGreaterThan(0);
    p1Cards[0]!.click();
    expect(ctrl.state.phase).toBe('placingCard');
    expect(ctrl.state.selectedCard).toBeTruthy();
    expect(root.querySelector('.stars-card.selected')).toBeTruthy();
    expect(root.querySelector('.stars-cell.valid')).toBeTruthy();

    const clearBtn = [...root.querySelectorAll('button')].find((b) =>
      /clear/i.test(b.textContent ?? '')
    ) as HTMLButtonElement | undefined;
    expect(clearBtn).toBeTruthy();
    clearBtn!.click();
    expect(ctrl.state.selectedCard).toBeNull();
    expect(ctrl.state.phase).toBe('selectingCard');

    const again = selectableHandCards(root);
    again[0]!.click();
    const validCell = root.querySelector(
      '.stars-cell.valid'
    ) as HTMLElement | null;
    expect(validCell).toBeTruthy();
    validCell!.click();
    expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    expect(root.querySelector('.stars-move-history')).toBeTruthy();
    expect(ctrl.state.currentPlayer).toBe('player2');

    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
      playerHands: {
        ...ctrl.state.playerHands,
        player1: [],
      },
      winner: null,
    };
    ctrl.update();
    expect(hasValidMoves(ctrl.state)).toBe(false);
    const passBtn = [...root.querySelectorAll('button')].find((b) =>
      /pass/i.test(b.textContent ?? '')
    ) as HTMLButtonElement | undefined;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe('player2');

    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      playerScores: { player1: CONFIG.TARGET_SCORE, player2: 4 },
    };
    ctrl.update();
    expect(root.querySelector('.stars-winner-banner')).toBeTruthy();
    expect(root.querySelector('.stars-status.player1')).toBeTruthy();

    destroyGame();
  });

  it('vsAI: null move pass + stubbed place; mid-timer gameOver; no-container tutorial', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/stars-bars/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');

    // Computer seat: input locked (no .valid highlights) while AI pending.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingCard',
    };
    ctrl.update();
    expect(root.querySelector('.stars-cell.valid')).toBeNull();
    expect(selectableHandCards(root).length).toBe(0);

    // Stub AI null → pass arm inside makeAIMove.
    vi.spyOn(starsAi, 'getAIMove').mockReturnValue(null);
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingCard',
      playerHands: {
        player1: createInitialState().playerHands.player1,
        player2: [],
      },
    };
    ctrl.update();
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.currentPlayer).toBe('player1');

    // Stubbed place path (structure only — no move-quality asserts).
    const deal = createInitialState();
    const aiCard = deal.playerHands.player2[0]!;
    vi.mocked(starsAi.getAIMove).mockReturnValue({
      cardId: aiCard.id,
      row: 0,
      col: 0,
    });
    ctrl.state = {
      ...deal,
      currentPlayer: 'player2',
      phase: 'selectingCard',
    };
    ctrl.update();
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    expect(root.querySelector('.stars-cell.last-move')).toBeTruthy();

    // Schedule AI then flip to gameOver before timer → early return in makeAIMove.
    vi.mocked(starsAi.getAIMove).mockReturnValue({
      cardId: aiCard.id,
      row: 1,
      col: 1,
    });
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingCard',
    };
    ctrl.update();
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
    };
    await vi.advanceTimersByTimeAsync(900);
    expect(ctrl.state.phase).toBe('gameOver');

    // startTutorial with no activeContainer (after destroy).
    destroyGame();
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    // Remount + newGame toggles chrome; syncOpponentChrome without #app is no-op.
    document.getElementById('app')?.remove();
    const bare = mountRoot();
    const again = initGame(bare, false);
    again.newGame(true, 'hard');
    expect(again.isAI).toBe(true);
    expect(again.aiDifficulty).toBe('hard');
    destroyGame();
  });

  it('computer-turn clear/pass/card/cell click guards no-op on stale listeners', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/stars-bars/game-controller');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'medium');

    const deal = createInitialState();
    ctrl.state = {
      ...deal,
      selectedCard: deal.playerHands.player1[0]!,
      phase: 'placingCard',
      currentPlayer: 'player1',
    };
    ctrl.update();
    const clearBtn = [...root.querySelectorAll('button')].find((b) =>
      /clear/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    const validCell = root.querySelector(
      '.stars-cell.valid'
    ) as HTMLElement | null;
    expect(validCell).toBeTruthy();

    // Flip to computer seat without re-render so listeners still fire,
    // then isComputerTurnPending short-circuits clear / cell handlers.
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
    };
    const selectedBefore = ctrl.state.selectedCard?.id;
    const historyBefore = ctrl.state.moveHistory.length;
    clearBtn.click();
    validCell!.click();
    expect(ctrl.state.selectedCard?.id).toBe(selectedBefore);
    expect(ctrl.state.moveHistory.length).toBe(historyBefore);

    // Card click guard: paint selectable hand, then flip seat before click.
    const fresh = createInitialState();
    ctrl.state = {
      ...fresh,
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
    };
    ctrl.update();
    const cardEl = selectableHandCards(root)[0]!;
    expect(cardEl).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    cardEl.click();
    expect(ctrl.state.selectedCard).toBeNull();
    expect(ctrl.state.phase).toBe('selectingCard');

    // Pass button guard: paint pass chrome, then flip seat before click.
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'selectingCard',
      playerHands: {
        player1: [],
        player2: createInitialState().playerHands.player2,
      },
      selectedCard: null,
      winner: null,
    };
    ctrl.update();
    const passBtn = [...root.querySelectorAll('button')].find((b) =>
      /pass/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    const seatBefore = ctrl.state.currentPlayer;
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe(seatBefore);

    destroyGame();
  });
});
