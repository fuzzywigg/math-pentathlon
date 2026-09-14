/**
 * Wave 42 — Kings placeQuadraphage success flips player + decrements supply.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — place success flip + supply', () => {
  it('player1 place decrements to 29 and flips to player2', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 4, col: 4 });
    expect(getSupply(state, 'player1')).toBe(29);
    expect(getSupply(state, 'player2')).toBe(30);
    expect(state.currentPlayer).toBe('player2');
    expect(state.turnPhase).toBe('moveKing');
  });

  it('board cell receives player1 quadraphage', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 6 });
    state = placeQuadraphage(state, { row: 3, col: 3 });
    expect(state.board[2][2]).toEqual({
      type: 'quadraphage',
      owner: 'player1',
    });
  });

  it('player2 full half-turn then place decrements p2 supply', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 5 });
    state = placeQuadraphage(state, { row: 6, col: 6 });
    expect(getSupply(state, 'player2')).toBe(29);
    expect(getSupply(state, 'player1')).toBe(29);
    expect(state.currentPlayer).toBe('player1');
  });
});
