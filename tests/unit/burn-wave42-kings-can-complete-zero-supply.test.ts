/**
 * Wave 42 — Kings canCompleteTurn false at zero supply. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canCompleteTurn,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — canComplete zero supply', () => {
  it('opening player1 can complete with supply 30', () => {
    const state = createInitialGameState();
    expect(state.player1Supply).toBe(30);
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(canCompleteTurn(state, 'player1')).toBe(true);
  });

  it('player1 supply 0 → canCompleteTurn false despite movable king', () => {
    const state = { ...createInitialGameState(), player1Supply: 0 };
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(canCompleteTurn(state, 'player1')).toBe(false);
  });

  it('player2 supply 0 → canCompleteTurn false for player2 only', () => {
    const state = {
      ...createInitialGameState(),
      player2Supply: 0,
      currentPlayer: 'player2' as const,
    };
    expect(canCompleteTurn(state, 'player2')).toBe(false);
    expect(canCompleteTurn(state, 'player1')).toBe(true);
  });

  it('negative supply treated as incomplete', () => {
    const state = { ...createInitialGameState(), player1Supply: -1 };
    expect(canCompleteTurn(state, 'player1')).toBe(false);
  });
});
