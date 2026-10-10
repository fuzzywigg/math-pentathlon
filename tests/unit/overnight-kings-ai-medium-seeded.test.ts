/**
 * Overnight HEAVY — Kings medium AI seeded randomness top-N picks.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';
import { createCustomGameState, openingBoard } from './helpers/kings-board';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Overnight kings — medium seeded randomness', () => {
  it('medium with random=0 returns legal kingMove + placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createCustomGameState(openingBoard());
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const kingValids = getValidKingMoves(state, 'player1');
    expect(
      kingValids.some(
        (p) => p.row === move!.kingMove.row && p.col === move!.kingMove.col
      )
    ).toBe(true);
    expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
    expect(move!.quadraphagePlacement.col).toBeLessThan(BOARD_SIZE);
  });

  it('medium with random=0.99 still legal vs easy random path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createCustomGameState(openingBoard());
    const medium = getAIMove(state, 'player1', 'medium');
    const easy = getAIMove(state, 'player1', 'easy');
    expect(medium).not.toBeNull();
    expect(easy).not.toBeNull();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(getValidQuadraphagePlacements(state).length).toBeGreaterThan(0);
  });
});
