import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  applyAIMoveSteps,
  executeAITurn,
  getAIMove,
} from '../../src/games/fab-a-diffy/ai';

describe('Burn Wave 2 — #11 Kings incremental DOM', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps cell node identity across place-quad updates', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let state = createInitialGameState();
    // Skip to placeQuadraphage after selecting and "moving" is awkward;
    // force place phase via a shallow copy for DOM stability check.
    state = {
      ...state,
      turnPhase: 'placeQuadraphage',
      selectedKingPosition: null,
    };

    renderBoard(state, container);
    const before = container.querySelector(
      '.cell[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    expect(before).toBeTruthy();

    state = placeQuadraphage(state, { row: 5, col: 5 });
    renderBoard(state, container);

    const after = container.querySelector(
      '.cell[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    expect(after).toBe(before);
    expect(after.classList.contains('cell-quad')).toBe(true);
  });

  it('preserves focused cell element across selection update', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let state = createInitialGameState();
    renderBoard(state, container, () => undefined);

    const kingCell = container.querySelector(
      '.cell[data-row="1"][data-col="5"]'
    ) as HTMLElement;
    kingCell.focus();
    expect(document.activeElement).toBe(kingCell);

    state = selectKing(state);
    renderBoard(state, container, () => undefined);

    const sameCell = container.querySelector(
      '.cell[data-row="1"][data-col="5"]'
    ) as HTMLElement;
    expect(sameCell).toBe(kingCell);
    expect(sameCell.classList.contains('cell-selected')).toBe(true);
    expect(document.activeElement).toBe(kingCell);
  });
});

describe('Burn Wave 2 — #12 Fab-a-Diffy AI step validation', () => {
  it('executeAITurn completes a valid move without stalling', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    // Fresh board always has moves for player1
    expect(move).not.toBeNull();

    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory.length).toBe(1);
  });

  it('applyAIMoveSteps passes instead of silently stalling on bad bar1', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();

    const next = applyAIMoveSteps(state, {
      bar1Id: 'missing-bar',
      bar2Id: 'also-missing',
      operation: 'add',
      answerId: 'no-answer',
    });

    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory.length).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
