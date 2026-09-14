/**
 * Wave 42 leftovers B — Kings deserialize throws + JSON roundtrip edges.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  type SerializedGameState,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — deserialize throws / JSON', () => {
  it('throws on unsupported version', () => {
    const data = serializeGameState(createInitialGameState());
    expect(() =>
      deserializeGameState({ ...data, version: 99 })
    ).toThrow(/Unsupported save version/);
  });

  it('throws on invalid board size', () => {
    const data = serializeGameState(createInitialGameState());
    const bad: SerializedGameState = {
      ...data,
      board: Array.from({ length: 5 }, () => Array(9).fill(null)),
    };
    expect(() => deserializeGameState(bad)).toThrow(/Invalid board size/);
  });

  it('roundtrips opening via JSON with metadata', () => {
    const state = createInitialGameState();
    const json = gameStateToJSON(state, {
      gameName: 'practice',
      player1Name: 'Ada',
    });
    const restored = gameStateFromJSON(json);
    expect(restored.currentPlayer).toBe(state.currentPlayer);
    expect(restored.turnPhase).toBe('moveKing');
    expect(restored.player1Supply).toBe(30);
    expect(restored.board[0][4]?.type).toBe('king');
    expect(restored.board[8][4]?.owner).toBe('player2');
  });

  it('deserialize restores moveHistory entries by value', () => {
    const state = createInitialGameState();
    const withHistory = {
      ...state,
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'moveKing' as const,
          from: { row: 1, col: 5 },
          to: { row: 2, col: 5 },
        },
      ],
    };
    const data = serializeGameState(withHistory);
    const restored = deserializeGameState(data);
    expect(restored.moveHistory).toHaveLength(1);
    expect(restored.moveHistory[0].to).toEqual({ row: 2, col: 5 });
    expect(restored.moveHistory[0].action).toBe('moveKing');
    // serialize clones entries; deserialize reuses the serialized array reference
    expect(data.moveHistory[0]).not.toBe(withHistory.moveHistory[0]);
  });
});
