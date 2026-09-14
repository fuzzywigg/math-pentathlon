/**
 * Wave 42 — Kings moveKing history entries leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — moveKing history', () => {
  it('moveKing appends from/to with action moveKing', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0]).toEqual({
      player: 'player1',
      action: 'moveKing',
      from: { row: 1, col: 5 },
      to: { row: 2, col: 5 },
    });
  });

  it('illegal move leaves history empty', () => {
    const state = createInitialGameState();
    const next = moveKing(state, { row: 5, col: 5 });
    expect(next).toBe(state);
    expect(next.moveHistory).toHaveLength(0);
  });

  it('place appends second history entry without from', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 6 });
    state = placeQuadraphage(state, { row: 3, col: 3 });
    expect(state.moveHistory).toHaveLength(2);
    expect(state.moveHistory[1]).toMatchObject({
      player: 'player1',
      action: 'placeQuadraphage',
      to: { row: 3, col: 3 },
    });
    expect(state.moveHistory[1].from).toBeUndefined();
  });
});
