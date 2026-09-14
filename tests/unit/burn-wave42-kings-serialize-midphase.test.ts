/**
 * Wave 42 leftovers B — Kings serialize omit metadata + selectedKing mid-phase.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  deserializeGameState,
  validateSerializedState,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — serialize mid-phase / metadata omit', () => {
  it('omits metadata key when not provided', () => {
    const data = serializeGameState(createInitialGameState());
    expect('metadata' in data).toBe(false);
    expect(validateSerializedState(data)).toBe(true);
  });

  it('roundtrips placeQuadraphage phase with selectedKingPosition', () => {
    const state = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage' as const,
      selectedKingPosition: { row: 2, col: 5 },
      player1Supply: 29,
    };
    const data = serializeGameState(state, { gameName: 'mid' });
    expect(data.metadata?.gameName).toBe('mid');
    const restored = deserializeGameState(data);
    expect(restored.turnPhase).toBe('placeQuadraphage');
    expect(restored.selectedKingPosition).toEqual({ row: 2, col: 5 });
    expect(restored.player1Supply).toBe(29);
  });

  it('gameOver winner roundtrip', () => {
    const state = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.winner).toBe('player1');
    expect(restored.turnPhase).toBe('gameOver');
  });
});
