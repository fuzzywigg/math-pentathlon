/**
 * #376 — Kings & Quadraphages ends (tie) when chips run out instead of soft-locking.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  endTurn,
  getCurrentPhaseMessage,
  isValidPlacement,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  checkWinCondition,
  isDrawCondition,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  handleCellClick,
  renderBoard,
  renderStatus,
} from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function trap(state: GameState, victim: 'player1' | 'player2'): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  const king = findKingPosition(board, victim)!;
  for (const dr of [-1, 0, 1]) {
    for (const dc of [-1, 0, 1]) {
      if (dr === 0 && dc === 0) continue;
      const r = king.row + dr;
      const c = king.col + dc;
      if (r < 0 || r > 8 || c < 0 || c > 8) continue;
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board };
}

describe('Kings & Quadraphages — supply exhaustion (#376)', () => {
  it('isDrawCondition when both supplies are empty and kings can still move', () => {
    const state = {
      ...createInitialGameState(),
      player1Supply: 0,
      player2Supply: 0,
    };
    expect(checkWinCondition(state)).toBeNull();
    expect(isDrawCondition(state)).toBe(true);
  });

  it('placing the last chip when the opponent has none ends in a tie', () => {
    let state = {
      ...createInitialGameState(),
      player1Supply: 1,
      player2Supply: 0,
    };
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.player1Supply).toBe(0);
    expect(state.player2Supply).toBe(0);
    expect(state.turnPhase).toBe('gameOver');
    expect(state.winner).toBeNull();
    expect(getCurrentPhaseMessage(state)).toBe("It's a tie!");
  });

  it('endTurn after a placement that leaves the next player with 0 chips is a tie', () => {
    const state = {
      ...createInitialGameState(),
      player1Supply: 0,
      player2Supply: 0,
      currentPlayer: 'player2' as const,
    };
    const ended = endTurn(state);
    expect(ended.turnPhase).toBe('gameOver');
    expect(ended.winner).toBeNull();
  });

  it('moving a king with empty supply settles instead of locking on Place a Quadraphage', () => {
    const state = {
      ...createInitialGameState(),
      player1Supply: 0,
      player2Supply: 0,
    };
    const moved = moveKing(state, { row: 2, col: 5 });
    expect(moved.turnPhase).toBe('gameOver');
    expect(moved.winner).toBeNull();
    expect(getCurrentPhaseMessage(moved)).not.toMatch(/Place a Quadraphage/);
  });

  it('a trapped king still wins even when supplies are empty', () => {
    const trapped = trap(
      {
        ...createInitialGameState(),
        player1Supply: 0,
        player2Supply: 0,
      },
      'player2'
    );
    expect(checkWinCondition(trapped)).toBe('player1');
    const ended = endTurn(trapped);
    expect(ended.turnPhase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
    expect(getCurrentPhaseMessage(ended)).toBe('Blue wins!');
  });

  it('handleCellClick in place phase with 0 supply ends the game (no freeze)', () => {
    const stuck: GameState = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage',
      player1Supply: 0,
      player2Supply: 0,
    };
    const result = handleCellClick(5, 5, stuck);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state.turnPhase).toBe('gameOver');
    expect(result.state.winner).toBeNull();
  });

  it('does not mark empty cells as valid placements when supply is 0', () => {
    const stuck: GameState = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage',
      player1Supply: 0,
      player2Supply: 0,
    };
    expect(isValidPlacement(stuck, { row: 5, col: 5 })).toBe(false);

    const el = document.createElement('div');
    renderBoard(stuck, el);
    expect(el.querySelectorAll('.cell-valid-placement').length).toBe(0);
  });

  it('renderStatus shows a blue vs red tie, not a false winner', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(
      {
        ...createInitialGameState(),
        turnPhase: 'gameOver',
        winner: null,
        player1Supply: 0,
        player2Supply: 0,
      },
      el,
      'human-vs-human'
    );
    const winnerText = el.querySelector('.status-winner')?.textContent ?? '';
    expect(winnerText).toMatch(/It's a tie!/);
    expect(winnerText).toContain('🔵');
    expect(winnerText).toContain('🔴');
    expect(winnerText).not.toMatch(/wins!/i);
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "It's a tie!"
    );
  });
});
