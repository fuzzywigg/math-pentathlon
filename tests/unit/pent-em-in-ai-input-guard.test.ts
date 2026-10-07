/**
 * Human piece/board input must not succeed during the computer think pause.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  getValidPlacements,
} from '../../src/games/pent-em-in/rules';
import {
  renderBoard,
  renderPieceSelector,
} from '../../src/games/pent-em-in/board-ui';

describe("Pent'Em In AI-turn input guard", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('pent-em-in-styles')?.remove();
    document.getElementById('app')?.remove();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    const { destroyGame } =
      await import('../../src/games/pent-em-in/game-controller');
    destroyGame();
    document.body.innerHTML = '';
    document.getElementById('pent-em-in-styles')?.remove();
    document.getElementById('app')?.remove();
  });

  it('renderBoard with allowInput false does not mark valid placements', () => {
    const state = selectPiece(createInitialState(), 'X');
    expect(state.phase).toBe('placePiece');
    expect(state.selectedPiece).toBe('X');

    const el = renderBoard(
      state,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
    expect(el.querySelector('.preview')).toBeNull();
  });

  it('renderPieceSelector with allowInput false disables piece options', () => {
    const state = createInitialState();
    const el = renderPieceSelector(state, () => undefined, {
      allowInput: false,
    });
    const options = el.querySelectorAll('.pent-piece-option');
    expect(options.length).toBeGreaterThan(0);
    expect(el.querySelectorAll('.pent-piece-option.disabled').length).toBe(
      options.length
    );
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
  });

  it('blocks selecting a Red piece during the 500ms AI pause', async () => {
    const { initGame, newGameVsAI, getCurrentState } =
      await import('../../src/games/pent-em-in/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    newGameVsAI('easy');

    const pos =
      getValidPlacements(selectPiece(createInitialState(), 'X'), 'X', 0, false)[0]!;
    expect(pos).toBeTruthy();

    const xOption = status.querySelector(
      '.pent-piece-option[data-piece="X"]'
    ) as HTMLElement;
    expect(xOption).toBeTruthy();
    xOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedPiece).toBe('X');
    expect(getCurrentState().phase).toBe('placePiece');

    const cell = board.querySelector(
      `[data-row="${pos.row}"][data-col="${pos.col}"]`
    ) as SVGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().moveHistory).toHaveLength(1);
    expect(status.querySelector('.pent-status')?.textContent).toMatch(
      /Computer is thinking/
    );
    expect(
      status.querySelectorAll('.pent-piece-option:not(.disabled)')
    ).toHaveLength(0);
    expect(board.querySelector('[aria-label*="valid placement"]')).toBeNull();

    const redPiece = status.querySelector('.pent-piece-option');
    redPiece?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedPiece).toBeNull();
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().moveHistory).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(500);
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(getCurrentState().moveHistory[1]?.player).toBe('player2');
  });
});
