/**
 * Wave 42 — Kings serialization roundtrip + validate + save info. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  validateSerializedState,
  generateSaveFileName,
  getSaveInfo,
} from '../../src/games/kings-quadraphages/serialization';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — serialize roundtrip', () => {
  it('serialize/deserialize preserves mid-game board', () => {
    let s = createInitialGameState();
    s = moveKing(s, { row: 2, col: 5 });
    s = placeQuadraphage(s, { row: 5, col: 5 });
    const data = serializeGameState(s);
    expect(validateSerializedState(data)).toBe(true);
    const back = deserializeGameState(data);
    expect(back.currentPlayer).toBe(s.currentPlayer);
    expect(back.player1Supply).toBe(29);
    expect(back.board[4][4]?.type).toBe('quadraphage');
    expect(back.moveHistory.length).toBe(s.moveHistory.length);
  });

  it('JSON roundtrip and save helpers', () => {
    const s = createInitialGameState();
    const json = gameStateToJSON(s);
    const back = gameStateFromJSON(json);
    expect(back.turnPhase).toBe('moveKing');
    expect(generateSaveFileName()).toMatch(/^kings-quadraphages/);
    const info = getSaveInfo(serializeGameState(s));
    expect(info.turnCount).toBe(0);
    expect(info.currentPlayer).toBe('Player 1');
    expect(info.isGameOver).toBe(false);
  });

  it('validate rejects garbage', () => {
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState({})).toBe(false);
    expect(validateSerializedState({ board: [] })).toBe(false);
  });
});
