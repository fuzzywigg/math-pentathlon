import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import {
  handleCellClick,
  renderStatus,
  renderMoveHistory,
  renderBoard,
} from '../../src/games/kings-quadraphages/board-ui';
import {
  isDrawCondition,
  getOpponent,
} from '../../src/games/kings-quadraphages/rules';
import {
  Board,
  BOARD_SIZE,
  createInitialGameState as createRulesBoardState,
} from '../../src/games/kings-quadraphages/board';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Kings & Quadraphages — handleCellClick', () => {
  it('selects then deselects the current king', () => {
    const state = createInitialGameState();
    const select = handleCellClick(1, 5, state);
    expect(select.state.selectedKingPosition).toEqual({ row: 1, col: 5 });
    expect(select.isInvalidClick).toBe(false);

    const deselect = handleCellClick(1, 5, select.state);
    expect(deselect.state.selectedKingPosition).toBeNull();
    expect(deselect.isInvalidClick).toBe(false);
  });

  it('marks invalid destination when king is selected', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    const result = handleCellClick(5, 5, state);
    expect(result.state).toBe(state);
    expect(result.isInvalidClick).toBe(true);
  });

  it('moves king to a valid adjacent square', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    const result = handleCellClick(2, 5, state);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state.turnPhase).toBe('placeQuadraphage');
  });

  it('rejects occupied cells during placeQuadraphage', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    expect(state.turnPhase).toBe('placeQuadraphage');

    // Opponent king cell is occupied
    const occupied = handleCellClick(9, 5, state);
    expect(occupied.isInvalidClick).toBe(true);
    expect(occupied.state).toBe(state);
  });

  it('ignores clicks after game over', () => {
    const state = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const result = handleCellClick(1, 5, state);
    expect(result.state).toBe(state);
    expect(result.isInvalidClick).toBe(false);
  });
});

describe('Kings & Quadraphages — status / history UI', () => {
  it('renderStatus and renderMoveHistory mount', () => {
    const state = createInitialGameState();
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(status);
    document.body.appendChild(history);
    renderStatus(state, status);
    renderMoveHistory(state, history);
    expect(status.textContent?.length).toBeGreaterThan(0);
    expect(
      history.querySelector('.move-history-list, .move-history-empty')
    ).toBeTruthy();
  });

  it('renderBoard paints initial kings', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialGameState(), container);
    expect(container.querySelectorAll('.cell').length).toBe(81);
    expect(
      container.querySelector('.cell[data-row="1"][data-col="5"]')
    ).toBeTruthy();
  });
});

describe('Kings & Quadraphages — rules leftovers', () => {
  it('getOpponent flips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('isDrawCondition false on a normal opening board', () => {
    expect(isDrawCondition(createRulesBoardState())).toBe(false);
  });

  it('isDrawCondition true when both kings are trapped', () => {
    const board: Board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
    board[0][0] = { type: 'king', owner: 'player1' };
    board[0][1] = { type: 'quadraphage', owner: 'player2' };
    board[1][0] = { type: 'quadraphage', owner: 'player2' };
    board[1][1] = { type: 'quadraphage', owner: 'player2' };
    board[8][8] = { type: 'king', owner: 'player2' };
    board[8][7] = { type: 'quadraphage', owner: 'player1' };
    board[7][8] = { type: 'quadraphage', owner: 'player1' };
    board[7][7] = { type: 'quadraphage', owner: 'player1' };

    expect(isDrawCondition({ board, player1Supply: 0, player2Supply: 0 })).toBe(
      true
    );
  });
});
