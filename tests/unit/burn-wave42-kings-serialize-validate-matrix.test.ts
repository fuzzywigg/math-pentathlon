/**
 * Wave 42 leftovers B — Kings serialize validateSerializedState matrix.
 * Beyond wave35 roundtrip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  validateSerializedState,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — validateSerializedState matrix', () => {
  it('rejects null / non-object / missing version', () => {
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState(undefined)).toBe(false);
    expect(validateSerializedState('save')).toBe(false);
    expect(validateSerializedState(42)).toBe(false);
    expect(validateSerializedState({})).toBe(false);
    expect(
      validateSerializedState({
        currentPlayer: 'player1',
        turnPhase: 'moveKing',
        board: Array.from({ length: 9 }, () => Array(9).fill(null)),
      })
    ).toBe(false);
  });

  it('rejects bad currentPlayer / turnPhase', () => {
    const good = serializeGameState(createInitialGameState());
    expect(
      validateSerializedState({ ...good, currentPlayer: 'spectator' })
    ).toBe(false);
    expect(validateSerializedState({ ...good, turnPhase: 'rolling' })).toBe(
      false
    );
  });

  it('rejects wrong board dimensions / jagged rows', () => {
    const good = serializeGameState(createInitialGameState());
    expect(
      validateSerializedState({
        ...good,
        board: Array.from({ length: 8 }, () => Array(9).fill(null)),
      })
    ).toBe(false);
    const jagged = Array.from({ length: 9 }, (_, i) =>
      Array(i === 4 ? 7 : 9).fill(null)
    );
    expect(validateSerializedState({ ...good, board: jagged })).toBe(false);
  });

  it('accepts happy-path serialize of opening', () => {
    const serialized = serializeGameState(createInitialGameState());
    expect(validateSerializedState(serialized)).toBe(true);
    expect(serialized.version).toBe(1);
    expect(serialized.board).toHaveLength(9);
  });
});
