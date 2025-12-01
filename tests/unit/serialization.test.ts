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
import { createInitialGameState, moveKing, selectKing, placeQuadraphage } from '../../src/games/kings-quadraphages/game-state';

describe('Serialization', () => {
  describe('serializeGameState / deserializeGameState', () => {
    it('serializes and deserializes initial game state', () => {
      const original = createInitialGameState();
      const serialized = serializeGameState(original);
      const restored = deserializeGameState(serialized);

      expect(restored.currentPlayer).toBe(original.currentPlayer);
      expect(restored.turnPhase).toBe(original.turnPhase);
      expect(restored.player1Supply).toBe(original.player1Supply);
      expect(restored.player2Supply).toBe(original.player2Supply);
      expect(restored.winner).toBe(original.winner);
      expect(restored.moveHistory).toEqual(original.moveHistory);
    });

    it('serializes and deserializes game state with moves', () => {
      let state = createInitialGameState();
      state = selectKing(state);
      state = moveKing(state, { row: 2, col: 5 }); // Move king down
      state = placeQuadraphage(state, { row: 3, col: 5 }); // Place quadraphage

      const serialized = serializeGameState(state);
      const restored = deserializeGameState(serialized);

      expect(restored.currentPlayer).toBe(state.currentPlayer);
      expect(restored.turnPhase).toBe(state.turnPhase);
      expect(restored.moveHistory.length).toBe(state.moveHistory.length);
      expect(restored.player1Supply).toBe(state.player1Supply);
    });

    it('preserves board state correctly', () => {
      let state = createInitialGameState();
      state = selectKing(state);
      state = moveKing(state, { row: 2, col: 5 });
      state = placeQuadraphage(state, { row: 3, col: 5 });

      const serialized = serializeGameState(state);
      const restored = deserializeGameState(serialized);

      // Check that kings are in correct positions
      expect(restored.board[1][4]).toEqual({ type: 'king', owner: 'player1' }); // P1 King at (2,5) -> [1][4]
      expect(restored.board[8][4]).toEqual({ type: 'king', owner: 'player2' }); // P2 King at (9,5) -> [8][4]

      // Check quadraphage
      expect(restored.board[2][4]).toEqual({ type: 'quadraphage', owner: 'player1' }); // Quad at (3,5) -> [2][4]
    });

    it('includes metadata when provided', () => {
      const state = createInitialGameState();
      const metadata = {
        gameName: 'Test Game',
        player1Name: 'Alice',
        player2Name: 'Bob',
        notes: 'A test game',
      };

      const serialized = serializeGameState(state, metadata);

      expect(serialized.metadata).toEqual(metadata);
    });

    it('includes savedAt timestamp', () => {
      const state = createInitialGameState();
      const before = new Date().toISOString();
      const serialized = serializeGameState(state);
      const after = new Date().toISOString();

      expect(serialized.savedAt).toBeDefined();
      expect(serialized.savedAt >= before).toBe(true);
      expect(serialized.savedAt <= after).toBe(true);
    });
  });

  describe('gameStateToJSON / gameStateFromJSON', () => {
    it('converts to and from JSON string', () => {
      const original = createInitialGameState();
      const json = gameStateToJSON(original);
      const restored = gameStateFromJSON(json);

      expect(restored.currentPlayer).toBe(original.currentPlayer);
      expect(restored.turnPhase).toBe(original.turnPhase);
    });

    it('produces valid JSON', () => {
      const state = createInitialGameState();
      const json = gameStateToJSON(state);

      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('produces formatted JSON', () => {
      const state = createInitialGameState();
      const json = gameStateToJSON(state);

      // Should contain newlines (formatted)
      expect(json).toContain('\n');
    });
  });

  describe('validateSerializedState', () => {
    it('returns true for valid serialized state', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state);

      expect(validateSerializedState(serialized)).toBe(true);
    });

    it('returns false for null', () => {
      expect(validateSerializedState(null)).toBe(false);
    });

    it('returns false for non-object', () => {
      expect(validateSerializedState('string')).toBe(false);
      expect(validateSerializedState(123)).toBe(false);
    });

    it('returns false for missing version', () => {
      const invalid = { board: [], currentPlayer: 'player1' };
      expect(validateSerializedState(invalid)).toBe(false);
    });

    it('returns false for invalid currentPlayer', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state) as Record<string, unknown>;
      serialized.currentPlayer = 'player3';
      expect(validateSerializedState(serialized)).toBe(false);
    });

    it('returns false for invalid turnPhase', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state) as Record<string, unknown>;
      serialized.turnPhase = 'invalid';
      expect(validateSerializedState(serialized)).toBe(false);
    });

    it('returns false for invalid board size', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state) as Record<string, unknown>;
      serialized.board = [[null]]; // Wrong size
      expect(validateSerializedState(serialized)).toBe(false);
    });
  });

  describe('generateSaveFileName', () => {
    it('generates filename with default prefix', () => {
      const filename = generateSaveFileName();
      expect(filename).toMatch(/^kings-quadraphages-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
    });

    it('generates filename with custom prefix', () => {
      const filename = generateSaveFileName('my-game');
      expect(filename).toMatch(/^my-game-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
    });
  });

  describe('getSaveInfo', () => {
    it('returns save info for initial game', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state);
      const info = getSaveInfo(serialized);

      expect(info.turnCount).toBe(0);
      expect(info.currentPlayer).toBe('Player 1');
      expect(info.isGameOver).toBe(false);
      expect(info.winner).toBeNull();
    });

    it('returns correct turn count after moves', () => {
      let state = createInitialGameState();
      state = selectKing(state);
      state = moveKing(state, { row: 2, col: 5 });
      state = placeQuadraphage(state, { row: 3, col: 5 });

      const serialized = serializeGameState(state);
      const info = getSaveInfo(serialized);

      expect(info.turnCount).toBe(2); // King move + Quadraphage placement
    });

    it('returns savedAt as Date object', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state);
      const info = getSaveInfo(serialized);

      expect(info.savedAt).toBeInstanceOf(Date);
    });
  });

  describe('error handling', () => {
    it('throws on version mismatch', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state);
      serialized.version = 999;

      expect(() => deserializeGameState(serialized)).toThrow(/Unsupported save version/);
    });

    it('throws on invalid JSON in gameStateFromJSON', () => {
      expect(() => gameStateFromJSON('not valid json')).toThrow();
    });

    it('throws on invalid board dimensions', () => {
      const state = createInitialGameState();
      const serialized = serializeGameState(state);
      serialized.board = [[null, null]]; // Wrong dimensions

      expect(() => deserializeGameState(serialized)).toThrow(/Invalid board size/);
    });
  });
});
