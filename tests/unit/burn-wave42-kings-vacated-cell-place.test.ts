/**
 * Wave 42 — Kings vacated cell after moveKing is valid placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidPlacement,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';
import { isValidQuadraphagePlacement } from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 kings — vacated cell place', () => {
  it('after moveKing, origin cell is empty and placeable (1-based)', () => {
    let state = createInitialGameState();
    const origin = getKingPosition(state, 'player1')!;
    expect(origin).toEqual({ row: 1, col: 5 });
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(state.board[0][4]).toBeNull(); // vacated 0-based
    expect(isValidPlacement(state, origin)).toBe(true);
    // rules engine uses 0-based
    expect(isValidQuadraphagePlacement(state, { row: 0, col: 4 })).toBe(true);
  });

  it('placing on vacated cell decrements supply and flips seat', () => {
    let state = createInitialGameState();
    const origin = { row: 1, col: 5 };
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    const next = placeQuadraphage(state, origin);
    expect(next).not.toBe(state);
    expect(next.board[0][4]?.type).toBe('quadraphage');
    expect(next.board[0][4]?.owner).toBe('player1');
    expect(next.player1Supply).toBe(29);
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnPhase).toBe('moveKing');
  });

  it('new king cell is not a valid placement', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(isValidPlacement(state, { row: 2, col: 5 })).toBe(false);
    expect(placeQuadraphage(state, { row: 2, col: 5 })).toBe(state);
  });

  it('player2 vacated cell after their move is placeable', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    const p2Origin = getKingPosition(state, 'player2')!;
    expect(p2Origin).toEqual({ row: 9, col: 5 });
    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 5 });
    expect(isValidPlacement(state, p2Origin)).toBe(true);
  });
});
