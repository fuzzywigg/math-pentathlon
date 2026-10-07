/**
 * Playtest recheck follow-up: Pent'Em In place-piece dead-end UX (no rules change).
 * Orient-to-fit + legal highlights + choose-another escape mirror Juggle #415.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  cancelSelection,
  selectedPieceFitsAnywhere,
  getCurrentOrientationPlacements,
  orientSelectedPieceToFit,
  getValidPlacements,
} from '../../src/games/pent-em-in/rules';
import {
  renderBoard,
  renderPlaceControls,
} from '../../src/games/pent-em-in/board-ui';

afterEach(() => {
  document.getElementById('pent-em-in-styles')?.remove();
  document.body.innerHTML = '';
});

/** Crowded board: only a 5-wide top strip left empty. */
function crowdedBoardState() {
  const board = createInitialState().board.map((row) =>
    row.map((cell) => ({ ...cell }))
  );
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const keepOpen = r === 0 && c < 5;
      if (!keepOpen) {
        board[r][c] = {
          ...board[r][c],
          occupied: true,
          owner: 'player2',
          pieceId: 'block',
        };
      }
    }
  }
  return {
    ...createInitialState(),
    board,
    player1Pieces: {
      available: ['I5', 'L5', 'X'],
      placed: [],
    },
  };
}

describe("Pent'Em In placement soft-lock escape", () => {
  it('cancelSelection returns to piece select without changing the board', () => {
    let state = selectPiece(createInitialState(), 'L5');
    const board = state.board;
    const next = cancelSelection(state);
    expect(next.phase).toBe('selectPiece');
    expect(next.selectedPiece).toBeNull();
    expect(next.previewPosition).toBeNull();
    expect(next.board).toBe(board);
  });

  it('selectPiece orients I5 to fit a horizontal strip when vertical cannot', () => {
    let state = crowdedBoardState();
    // Force a bad orientation first, then orient helper (selectPiece also orients)
    state = {
      ...state,
      phase: 'placePiece',
      selectedPiece: 'I5',
      selectedRotation: 90,
      selectedFlipped: false,
    };
    expect(getCurrentOrientationPlacements(state).length).toBe(0);
    expect(selectedPieceFitsAnywhere(state)).toBe(true);

    const oriented = orientSelectedPieceToFit(state);
    expect(oriented.selectedRotation).toBe(0);
    expect(getCurrentOrientationPlacements(oriented).length).toBeGreaterThan(0);

    const viaSelect = selectPiece(crowdedBoardState(), 'I5');
    expect(viaSelect.phase).toBe('placePiece');
    expect(selectedPieceFitsAnywhere(viaSelect)).toBe(true);
    expect(getCurrentOrientationPlacements(viaSelect).length).toBeGreaterThan(0);
    expect(viaSelect.previewPosition).not.toBeNull();
  });

  it('renderBoard paints .pent-cell-valid on legal anchors only', () => {
    const state = selectPiece(createInitialState(), 'X');
    const legal = getValidPlacements(state, 'X', 0, false);
    expect(legal.length).toBeGreaterThan(0);

    const svg = renderBoard(
      state,
      () => undefined,
      () => undefined
    );
    const highlights = svg.querySelectorAll('.pent-cell-valid');
    expect(highlights.length).toBe(legal.length);

    const ariaValid = svg.querySelectorAll('[aria-label*="valid placement"]');
    expect(ariaValid.length).toBe(legal.length);

    const locked = renderBoard(
      state,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    expect(locked.querySelector('.pent-cell-valid')).toBeNull();
    expect(locked.querySelector('[aria-label*="valid placement"]')).toBeNull();
  });

  it('place controls expose Choose another escape and update copy when jammed', () => {
    let abandoned = false;
    const open = renderPlaceControls(
      selectPiece(createInitialState(), 'L5'),
      {
        onRotate: () => undefined,
        onFlip: () => undefined,
        onCancel: () => {
          abandoned = true;
        },
      }
    );
    const btn = open.querySelector(
      '.pent-btn-choose-other'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toMatch(/Choose another piece/);
    btn.click();
    expect(abandoned).toBe(true);
    expect(open.querySelector('.pent-place-hint')?.textContent).toMatch(
      /green cell/i
    );

    // No room for X (needs a plus footprint) on the 1×5 strip
    const jammed = {
      ...crowdedBoardState(),
      phase: 'placePiece' as const,
      selectedPiece: 'X',
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };
    expect(selectedPieceFitsAnywhere(jammed)).toBe(false);
    const stuckUi = renderPlaceControls(jammed, {
      onRotate: () => undefined,
      onFlip: () => undefined,
      onCancel: () => undefined,
    });
    expect(
      stuckUi.querySelector('.pent-btn-choose-other')?.textContent
    ).toMatch(/Can't fit/);
    expect(stuckUi.querySelector('.pent-place-hint')?.textContent).toMatch(
      /doesn't fit anywhere/i
    );
  });
});
