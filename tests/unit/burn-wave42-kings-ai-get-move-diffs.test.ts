/**
 * Wave 42 — Kings AI getAIMove easy/medium/hard opening returns king+place.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 kings — getAIMove difficulties', () => {
  it('easy/medium/hard for player1 on opening return both legs', () => {
    const state = createInitialGameState();
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', diff);
      expect(move).not.toBeNull();
      expect(move!.kingMove).toBeDefined();
      expect(move!.quadraphagePlacement).toBeDefined();
      const valids = getValidKingMoves(state, 'player1');
      expect(
        valids.some(
          (m) =>
            m.row === move!.kingMove.row && m.col === move!.kingMove.col
        )
      ).toBe(true);
    }
  });

  it('player2 AI after p1 half-turn returns legal kingMove', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player2');
    const move = getAIMove(state, 'player2', 'medium');
    expect(move).not.toBeNull();
    const valids = getValidKingMoves(state, 'player2');
    expect(
      valids.some(
        (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
      )
    ).toBe(true);
  });

  it('hard placement is on-board 0-based and not a king cell', () => {
    const state = createInitialGameState();
    const move = getAIMove(state, 'player1', 'hard')!;
    expect(move.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
    expect(move.quadraphagePlacement.row).toBeLessThan(9);
    expect(move.quadraphagePlacement.col).toBeGreaterThanOrEqual(0);
    expect(move.quadraphagePlacement.col).toBeLessThan(9);
    expect(
      !(
        move.quadraphagePlacement.row === move.kingMove.row &&
        move.quadraphagePlacement.col === move.kingMove.col
      )
    ).toBe(true);
  });
});
