/**
 * Wave 35 — Kings & Quadraphages canCompleteTurn supply-0 + OOB placement.
 * Distinct from wave18 trap-board constructions.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  moveKing,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import {
  canCompleteTurn,
  isValidQuadraphagePlacement,
  getValidKingMoves,
  getValidQuadraphagePlacements,
  checkWinCondition,
  isDrawCondition,
  getOpponent,
} from '../../src/games/kings-quadraphages/rules';

describe('Wave 35 Kings — canComplete / supply', () => {
  it('opening canCompleteTurn true; getOpponent flips', () => {
    const state = createInitialGameState();
    expect(canCompleteTurn(state, 'player1')).toBe(true);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('canCompleteTurn false when supply is 0 even if king movable', () => {
    const state = {
      ...createInitialGameState(),
      player1Supply: 0,
    };
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(canCompleteTurn(state, 'player1')).toBe(false);
  });

  it('isValidQuadraphagePlacement false for OOB and occupied king cell (0-based)', () => {
    const state = createInitialGameState();
    expect(isValidQuadraphagePlacement(state, { row: -1, col: 0 })).toBe(false);
    expect(isValidQuadraphagePlacement(state, { row: 0, col: 4 })).toBe(false); // P1 king
    expect(isValidQuadraphagePlacement(state, { row: 4, col: 4 })).toBe(true);
  });

  it('opening checkWin/isDraw null/false; placements nonempty', () => {
    const state = createInitialGameState();
    expect(checkWinCondition(state)).toBeNull();
    expect(isDrawCondition(state)).toBe(false);
    expect(getValidQuadraphagePlacements(state).length).toBeGreaterThan(0);
  });

  it('selectKing + moveKing (1-based dest) advances to placeQuadraphage', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(state.selectedKingPosition).toBeNull();
  });
});
