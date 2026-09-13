/**
 * Wave 17 companion — Kings serialization seat/board-size edges.
 * Distinct from serialization.test.ts smoke and from waves 15–16 AI/rules-phase.
 * Tests-only; no product inventing.
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
} from '../../src/games/kings-quadraphages/game-state';
import { getOpponent } from '../../src/games/kings-quadraphages/rules';

describe('Wave 17 serialization-edges — seat flip preserved in round-trip', () => {
  it('after a full turn, currentPlayer is opponent of opener', () => {
    let state = createInitialGameState();
    const opener = state.currentPlayer;
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 5 });

    expect(state.currentPlayer).toBe(getOpponent(opener));

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.currentPlayer).toBe(getOpponent(opener));
    expect(restored.player1Supply).toBe(state.player1Supply);
    expect(restored.player2Supply).toBe(state.player2Supply);
    expect(restored.board).toHaveLength(9);
    expect(restored.board.every((row) => row.length === 9)).toBe(true);
  });

  it('JSON round-trip preserves winner null and both seat supplies', () => {
    const state = createInitialGameState();
    const restored = gameStateFromJSON(gameStateToJSON(state));
    expect(restored.winner).toBeNull();
    expect(restored.player1Supply).toBe(state.player1Supply);
    expect(restored.player2Supply).toBe(state.player2Supply);
    expect(restored.currentPlayer).toBe('player1');
  });
});

describe('Wave 17 serialization-edges — validate / deserialize rejects', () => {
  it('validate rejects wrong-size board rows and missing board', () => {
    const good = serializeGameState(createInitialGameState());
    expect(validateSerializedState(good)).toBe(true);

    expect(
      validateSerializedState({
        ...good,
        board: Array.from({ length: 8 }, () => Array(9).fill(null)),
      })
    ).toBe(false);

    expect(
      validateSerializedState({
        ...good,
        board: Array.from({ length: 9 }, () => Array(8).fill(null)),
      })
    ).toBe(false);

    const { board: _b, ...noBoard } = good;
    expect(validateSerializedState(noBoard)).toBe(false);
  });

  it('validate accepts both seats as currentPlayer; rejects empty string', () => {
    const base = serializeGameState(createInitialGameState());
    expect(validateSerializedState({ ...base, currentPlayer: 'player2' })).toBe(
      true
    );
    expect(validateSerializedState({ ...base, currentPlayer: '' })).toBe(false);
  });

  it('deserialize throws on unsupported version and wrong board size', () => {
    const base = serializeGameState(createInitialGameState());
    expect(() =>
      deserializeGameState({ ...base, version: 999 })
    ).toThrow(/Unsupported save version/);
    expect(() =>
      deserializeGameState({
        ...base,
        board: Array.from({ length: 3 }, () => Array(3).fill(null)),
      })
    ).toThrow(/Invalid board size/);
  });

  it('gameStateFromJSON throws on malformed JSON', () => {
    expect(() => gameStateFromJSON('{not-json')).toThrow();
  });
});

describe('Wave 17 serialization-edges — getSaveInfo seat labels', () => {
  it('labels player1 / player2 and game-over from turnPhase', () => {
    const open = serializeGameState(createInitialGameState());
    const infoOpen = getSaveInfo(open);
    expect(infoOpen.currentPlayer).toBe('Player 1');
    expect(infoOpen.isGameOver).toBe(false);
    expect(infoOpen.winner).toBeNull();
    expect(infoOpen.turnCount).toBe(0);

    const p2 = getSaveInfo({ ...open, currentPlayer: 'player2' });
    expect(p2.currentPlayer).toBe('Player 2');

    const over = getSaveInfo({
      ...open,
      turnPhase: 'gameOver',
      winner: 'player2',
      moveHistory: open.moveHistory,
    });
    expect(over.isGameOver).toBe(true);
    expect(over.winner).toBe('player2');
  });

  it('generateSaveFileName honors custom prefix', () => {
    const name = generateSaveFileName('wave17-kings');
    expect(name).toMatch(/^wave17-kings-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
  });
});
