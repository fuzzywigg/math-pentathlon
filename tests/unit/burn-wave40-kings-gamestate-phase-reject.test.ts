/**
 * Wave 40 — Kings game-state phase reject matrix (select/move/place).
 * After #177 draw leftovers; deepen game-state identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidMove,
  isValidPlacement,
  endTurn,
  resetGame,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 40 kings game-state — phase rejects', () => {
  it('selectKing identity outside moveKing; success sets selection', () => {
    const placePhase = {
      ...createInitialGameState(),
      turnPhase: 'placeQuadraphage' as const,
    };
    expect(selectKing(placePhase)).toBe(placePhase);

    const open = createInitialGameState();
    const selected = selectKing(open);
    expect(selected.selectedKingPosition).toEqual({ row: 1, col: 5 });
  });

  it('moveKing rejects wrong phase and invalid dest', () => {
    const open = createInitialGameState();
    // Invalid: stay on own square / far jump
    expect(moveKing(open, { row: 1, col: 5 })).toBe(open);
    expect(moveKing(open, { row: 9, col: 9 })).toBe(open);

    const wrongPhase = {
      ...open,
      turnPhase: 'placeQuadraphage' as const,
    };
    expect(moveKing(wrongPhase, { row: 2, col: 5 })).toBe(wrongPhase);
  });

  it('placeQuadraphage rejects wrong phase / zero supply / occupied', () => {
    const open = createInitialGameState();
    expect(placeQuadraphage(open, { row: 2, col: 2 })).toBe(open);

    const placing = {
      ...open,
      turnPhase: 'placeQuadraphage' as const,
    };
    // Occupied by king
    expect(placeQuadraphage(placing, { row: 1, col: 5 })).toBe(placing);

    const noSupply = { ...placing, player1Supply: 0 };
    expect(placeQuadraphage(noSupply, { row: 3, col: 3 })).toBe(noSupply);
  });

  it('isValidMove/Placement false outside phase; resetGame fresh', () => {
    const open = createInitialGameState();
    expect(isValidMove(open, { row: 2, col: 5 })).toBe(true);
    expect(isValidPlacement(open, { row: 3, col: 3 })).toBe(false);
    const placing = { ...open, turnPhase: 'placeQuadraphage' as const };
    expect(isValidMove(placing, { row: 2, col: 5 })).toBe(false);
    const reset = resetGame();
    expect(reset.turnPhase).toBe('moveKing');
    expect(reset.moveHistory).toHaveLength(0);
    // endTurn without win/draw advances player
    const advanced = endTurn(placing);
    expect(advanced.currentPlayer).toBe('player2');
    expect(advanced.turnPhase).toBe('moveKing');
  });
});
