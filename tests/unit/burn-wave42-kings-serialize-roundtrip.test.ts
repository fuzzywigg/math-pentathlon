/**
 * Wave 42 — Kings serialization roundtrip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  validateSerializedState,
} from '../../src/games/kings-quadraphages/serialization';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — serialization roundtrip', () => {
  it('serialize/deserialize preserves opening kings + supplies', () => {
    const state = createInitialGameState();
    const blob = serializeGameState(state);
    const restored = deserializeGameState(blob);
    expect(restored.player1Supply).toBe(30);
    expect(restored.player2Supply).toBe(30);
    expect(restored.board[0][4]).toEqual({ type: 'king', owner: 'player1' });
    expect(restored.board[8][4]).toEqual({ type: 'king', owner: 'player2' });
    expect(restored.currentPlayer).toBe('player1');
  });

  it('JSON roundtrip after a full turn', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 4, col: 4 });
    const json = gameStateToJSON(state, { notes: 'wave42' });
    const restored = gameStateFromJSON(json);
    expect(restored.currentPlayer).toBe('player2');
    expect(restored.player1Supply).toBe(29);
    expect(restored.moveHistory).toHaveLength(2);
    expect(restored.board[3][3]?.type).toBe('quadraphage');
  });

  it('validateSerializedState accepts serialize output; rejects junk', () => {
    const blob = serializeGameState(createInitialGameState());
    expect(validateSerializedState(blob)).toBe(true);
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState({ version: 1 })).toBe(false);
  });
});
