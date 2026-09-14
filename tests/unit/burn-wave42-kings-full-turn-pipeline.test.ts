/**
 * Wave 42 — Kings full turn select→move→place→opponent turn.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  getKingPosition,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — full turn pipeline', () => {
  it('select → move → place lands on player2 moveKing', () => {
    let state = createInitialGameState();
    expect(state.turnPhase).toBe('moveKing');
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual({ row: 1, col: 5 });
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(state.selectedKingPosition).toBeNull();
    expect(getKingPosition(state, 'player1')).toEqual({ row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    expect(state.turnPhase).toBe('moveKing');
    expect(state.winner).toBeNull();
  });

  it('player2 can then select and move', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 4, col: 4 });
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual({ row: 9, col: 5 });
    state = moveKing(state, { row: 8, col: 5 });
    expect(getKingPosition(state, 'player2')).toEqual({ row: 8, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
  });

  it('phase messages track through the pipeline', () => {
    let state = createInitialGameState();
    expect(getCurrentPhaseMessage(state)).toContain('Player 1');
    state = selectKing(state);
    expect(getCurrentPhaseMessage(state)).toContain('green');
    state = moveKing(state, { row: 1, col: 4 });
    expect(getCurrentPhaseMessage(state)).toContain('Place a Quadraphage');
  });
});
