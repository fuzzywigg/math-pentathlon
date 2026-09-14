/**
 * Wave 35 — Kings serialize/JSON roundtrip mid placeQuadraphage phase.
 * Distinct from wave19 selectKing mid-move serialization.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  validateSerializedState,
  generateSaveFileName,
  getSaveInfo,
} from '../../src/games/kings-quadraphages/serialization';

describe('Wave 35 Kings — serialize place phase', () => {
  function toPlacePhase() {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    return state;
  }

  it('serialize/deserialize preserves placeQuadraphage phase and supplies', () => {
    const state = toPlacePhase();
    expect(state.turnPhase).toBe('placeQuadraphage');
    const blob = serializeGameState(state, {
      gameName: 'wave35',
      notes: 'place-phase',
    });
    expect(blob.turnPhase).toBe('placeQuadraphage');
    expect(blob.selectedKingPosition).toBeNull();
    expect(blob.player1Supply).toBe(state.player1Supply);
    expect(blob.metadata?.notes).toBe('place-phase');
    const restored = deserializeGameState(blob);
    expect(restored.turnPhase).toBe('placeQuadraphage');
    expect(restored.selectedKingPosition).toBeNull();
    expect(restored.player1Supply).toBe(state.player1Supply);
    expect(restored.currentPlayer).toBe(state.currentPlayer);
  });

  it('JSON roundtrip + validateSerializedState true for place-phase blob', () => {
    const state = toPlacePhase();
    const json = gameStateToJSON(state);
    const restored = gameStateFromJSON(json);
    expect(restored.turnPhase).toBe('placeQuadraphage');
    expect(validateSerializedState(JSON.parse(json))).toBe(true);
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState({ version: 1 })).toBe(false);
  });

  it('getSaveInfo mid-place reports non-over and current player label', () => {
    const state = toPlacePhase();
    const info = getSaveInfo(serializeGameState(state));
    expect(info.isGameOver).toBe(false);
    expect(info.winner).toBeNull();
    expect(info.currentPlayer).toMatch(/Player/);
    expect(info.turnCount).toBe(state.moveHistory.length);
  });

  it('generateSaveFileName honors custom prefix', () => {
    const name = generateSaveFileName('wave35-kings');
    expect(name.startsWith('wave35-kings-')).toBe(true);
    expect(name.endsWith('.json')).toBe(true);
  });
});
