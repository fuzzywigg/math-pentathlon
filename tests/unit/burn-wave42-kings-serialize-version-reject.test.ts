/**
 * Wave 42 — Kings serialize version reject + invalid board. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  deserializeGameState,
  validateSerializedState,
  gameStateFromJSON,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — serialize version reject', () => {
  it('unsupported version throws', () => {
    const blob = serializeGameState(createInitialGameState());
    const bad = { ...blob, version: 99 };
    expect(() => deserializeGameState(bad)).toThrow(/Unsupported save version/);
  });

  it('version 0 rejects', () => {
    const blob = serializeGameState(createInitialGameState());
    expect(() => deserializeGameState({ ...blob, version: 0 })).toThrow(
      /Unsupported save version/
    );
  });

  it('invalid board dimensions throw', () => {
    const blob = serializeGameState(createInitialGameState());
    const short = { ...blob, board: blob.board.slice(0, 3) };
    expect(() => deserializeGameState(short)).toThrow(/Invalid board size/);
  });

  it('validateSerializedState false for bad version shape / null', () => {
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState({ version: '1' })).toBe(false);
    const good = serializeGameState(createInitialGameState());
    expect(validateSerializedState(good)).toBe(true);
  });

  it('roundtrip version 1 succeeds; JSON with bad version fails deserialize', () => {
    const state = createInitialGameState();
    const blob = serializeGameState(state);
    expect(blob.version).toBe(1);
    const restored = deserializeGameState(blob);
    expect(restored.currentPlayer).toBe(state.currentPlayer);
    expect(restored.player1Supply).toBe(30);
    const evil = JSON.stringify({ ...blob, version: 2 });
    expect(() => gameStateFromJSON(evil)).toThrow(/Unsupported save version/);
  });
});
