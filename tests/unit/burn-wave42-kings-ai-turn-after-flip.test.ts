/**
 * Wave 42 — Kings AI isAITurn after seat flip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isAITurn, getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — isAITurn after half-turn', () => {
  it('player2 AI becomes active after p1 completes turn', () => {
    let state = createInitialGameState();
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('getAIMove for player2 works when isAITurn true', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
    const move = getAIMove(state, 'player2', 'easy');
    expect(move).not.toBeNull();
    expect(typeof move!.kingMove.row).toBe('number');
  });

  it('placeQuadraphage mid-turn still AI seat if currentPlayer matches', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    // Still player1 place phase
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });
});
