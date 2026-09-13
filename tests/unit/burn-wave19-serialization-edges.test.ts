/**
 * Wave 19 — Kings serialization burn-series deepen (first burn-wave for save/load).
 * Distinct from wave 18 midphase/geometry and non-burn serialization.test.ts smoke.
 * Tests-only. No product inventing.
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
  selectKing,
  moveKing,
  placeQuadraphage,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';
import { isEmpty, BOARD_SIZE } from '../../src/games/kings-quadraphages/board';

describe('Wave 19 serialization — mid-turn selectedKing roundtrip', () => {
  it('preserves selectedKingPosition after selectKing before move', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    expect(state.selectedKingPosition).not.toBeNull();

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.selectedKingPosition).toEqual(state.selectedKingPosition);
    expect(restored.turnPhase).toBe('moveKing');
    expect(restored.currentPlayer).toBe('player1');
  });

  it('JSON roundtrip keeps selectedKing and board kings', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    const restored = gameStateFromJSON(gameStateToJSON(state));
    expect(restored.selectedKingPosition).toEqual(state.selectedKingPosition);
    expect(getKingPosition(restored, 'player1')).toEqual(
      getKingPosition(state, 'player1')
    );
    expect(getKingPosition(restored, 'player2')).toEqual(
      getKingPosition(state, 'player2')
    );
  });
});

describe('Wave 19 serialization — supply / occupancy after full turn', () => {
  it('supply decrements and quad occupancy survive serialize', () => {
    let state = createInitialGameState();
    expect(state.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);

    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 5 });

    expect(state.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(state.currentPlayer).toBe('player2');

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(restored.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(restored.currentPlayer).toBe('player2');
    expect(restored.moveHistory).toHaveLength(state.moveHistory.length);

    // Quad at (3,5) → 0-based [2][4]
    expect(restored.board[2][4]).toEqual({
      type: 'quadraphage',
      owner: 'player1',
    });
    expect(isEmpty(restored.board, { row: 2, col: 4 })).toBe(false);
    expect(isEmpty(restored.board, { row: 0, col: 0 })).toBe(true);
  });

  it('full board cell identity matches after two half-turns', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 5 });
    // P2 turn
    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 5 });
    state = placeQuadraphage(state, { row: 7, col: 5 });

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.board).toHaveLength(BOARD_SIZE);
    for (let r = 0; r < BOARD_SIZE; r++) {
      expect(restored.board[r]).toHaveLength(BOARD_SIZE);
      for (let c = 0; c < BOARD_SIZE; c++) {
        expect(restored.board[r][c]).toEqual(state.board[r][c]);
      }
    }
    expect(restored.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(restored.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(restored.currentPlayer).toBe('player1');
  });
});

describe('Wave 19 serialization — getSaveInfo / validate / filename edges', () => {
  it('getSaveInfo reports gameOver + winner + metadata after forced over', () => {
    const opening = createInitialGameState();
    const over = {
      ...opening,
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'moveKing' as const,
          from: { row: 1, col: 5 },
          to: { row: 2, col: 5 },
        },
      ],
    };
    const serialized = serializeGameState(over, {
      gameName: 'Wave19',
      player1Name: 'A',
      player2Name: 'B',
    });
    const info = getSaveInfo(serialized);
    expect(info.isGameOver).toBe(true);
    expect(info.winner).toBe('player2');
    expect(info.turnCount).toBe(1);
    expect(info.currentPlayer).toBe('Player 1');
    expect(info.metadata?.gameName).toBe('Wave19');
    expect(info.metadata?.player2Name).toBe('B');
  });

  it('validateSerializedState rejects sparse junk shapes', () => {
    expect(validateSerializedState(undefined)).toBe(false);
    expect(validateSerializedState([])).toBe(false);
    expect(validateSerializedState({ version: 1 })).toBe(false);

    const good = serializeGameState(createInitialGameState());
    expect(validateSerializedState(good)).toBe(true);

    const badPhase = { ...good, turnPhase: 'rolling' };
    expect(validateSerializedState(badPhase)).toBe(false);

    const badPlayer = { ...good, currentPlayer: 'spectator' };
    expect(validateSerializedState(badPlayer)).toBe(false);

    const shortBoard = {
      ...good,
      board: Array.from({ length: 8 }, () => Array(9).fill(null)),
    };
    expect(validateSerializedState(shortBoard)).toBe(false);

    const jagged = {
      ...good,
      board: Array.from({ length: 9 }, (_, i) =>
        Array(i === 4 ? 8 : 9).fill(null)
      ),
    };
    expect(validateSerializedState(jagged)).toBe(false);
  });

  it('generateSaveFileName accepts empty and custom prefixes', () => {
    expect(generateSaveFileName('')).toMatch(
      /^-\d{4}-\d{2}-\d{2}-\d{4}\.json$/
    );
    expect(generateSaveFileName('wave19')).toMatch(
      /^wave19-\d{4}-\d{2}-\d{2}-\d{4}\.json$/
    );
  });

  it('metadata survives JSON string path', () => {
    const state = createInitialGameState();
    const json = gameStateToJSON(state, { notes: 'persist-me' });
    const parsed = JSON.parse(json);
    expect(parsed.metadata.notes).toBe('persist-me');
    expect(validateSerializedState(parsed)).toBe(true);
    const restored = gameStateFromJSON(json);
    expect(restored.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
  });
});
