/**
 * Wave 42 — Kings validateSerializedState accepts fresh serialize. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  serializeGameState,
  validateSerializedState,
  gameStateToJSON,
  gameStateFromJSON,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — validate shape', () => {
  it('opening serialize validates; corrupt board fails', () => {
    const data = serializeGameState(createInitialGameState());
    expect(validateSerializedState(data)).toBe(true);
    expect(validateSerializedState({ ...data, board: null })).toBe(false);
    const round = gameStateFromJSON(gameStateToJSON(createInitialGameState()));
    expect(round.player1Supply).toBe(30);
  });
});
