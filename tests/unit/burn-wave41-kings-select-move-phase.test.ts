/**
 * Wave 41 — Kings selectKing / moveKing / isValidMove phase gate leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  isValidMove,
  getKingPosition,
  getCurrentPhaseMessage,
  resetGame,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 41 kings — select/move phase gates', () => {
  it('selectKing only in moveKing; placeQuadraphage phase is identity', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual(
      getKingPosition(state, 'player1')
    );
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(selectKing(state)).toBe(state);
  });

  it('moveKing illegal dest / wrong phase identity', () => {
    const open = createInitialGameState();
    expect(moveKing(open, { row: 5, col: 5 })).toBe(open); // too far
    let state = selectKing(open);
    state = moveKing(state, { row: 2, col: 5 });
    expect(moveKing(state, { row: 3, col: 5 })).toBe(state); // wrong phase
  });

  it('isValidMove respects phase and distance', () => {
    const state = createInitialGameState();
    expect(isValidMove(state, { row: 2, col: 5 })).toBe(true);
    expect(isValidMove(state, { row: 5, col: 5 })).toBe(false);
    const placing = {
      ...state,
      turnPhase: 'placeQuadraphage' as const,
    };
    expect(isValidMove(placing, { row: 2, col: 5 })).toBe(false);
  });

  it('phase messages + resetGame identity of opening', () => {
    const open = createInitialGameState();
    expect(getCurrentPhaseMessage(open)).toContain('Click your King');
    const selected = selectKing(open);
    expect(getCurrentPhaseMessage(selected)).toContain('green');
    const over = {
      ...open,
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getCurrentPhaseMessage(over)).toContain('Player 2 wins');
    expect(resetGame().currentPlayer).toBe('player1');
    expect(resetGame().player1Supply).toBe(30);
  });
});
