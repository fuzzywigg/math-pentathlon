/**
 * Wave 42 leftovers B — Kings serialize JSON parse errors + version gate.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  gameStateFromJSON,
  gameStateToJSON,
  serializeGameState,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — JSON parse / version gate', () => {
  it('gameStateFromJSON throws on malformed JSON', () => {
    expect(() => gameStateFromJSON('{not-json')).toThrow();
  });

  it('gameStateToJSON pretty-prints and roundtrips supplies', () => {
    const json = gameStateToJSON(createInitialGameState());
    expect(json.includes('\n')).toBe(true);
    const restored = gameStateFromJSON(json);
    expect(restored.player1Supply).toBe(30);
    expect(restored.player2Supply).toBe(30);
  });

  it('serialized version is 1', () => {
    expect(serializeGameState(createInitialGameState()).version).toBe(1);
  });
});
