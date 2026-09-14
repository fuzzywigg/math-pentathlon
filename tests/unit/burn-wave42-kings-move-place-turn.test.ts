/**
 * Wave 42 — Kings game-state moveKing → placeQuadraphage → endTurn. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidMove,
  isValidPlacement,
  getKingPosition,
  getCurrentPhaseMessage,
  resetGame,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — move/place turn cycle', () => {
  it('select → move → place completes and flips seat', () => {
    let s = createInitialGameState();
    expect(getCurrentPhaseMessage(s)).toMatch(/Click your King/);
    s = selectKing(s);
    expect(s.selectedKingPosition).toEqual({ row: 1, col: 5 });
    expect(getCurrentPhaseMessage(s)).toMatch(/green square/);
    expect(isValidMove(s, { row: 2, col: 5 })).toBe(true);
    s = moveKing(s, { row: 2, col: 5 });
    expect(s.turnPhase).toBe('placeQuadraphage');
    expect(getKingPosition(s, 'player1')).toEqual({ row: 2, col: 5 });
    expect(isValidPlacement(s, { row: 5, col: 5 })).toBe(true);
    s = placeQuadraphage(s, { row: 5, col: 5 });
    expect(s.currentPlayer).toBe('player2');
    expect(s.turnPhase).toBe('moveKing');
    expect(s.player1Supply).toBe(29);
    expect(s.board[4][4]?.type).toBe('quadraphage');
  });

  it('illegal move/place and wrong-phase identities', () => {
    const open = createInitialGameState();
    const moved = moveKing(open, { row: 2, col: 5 });
    expect(moved).not.toBe(open);
    expect(placeQuadraphage(open, { row: 3, col: 3 })).toBe(open); // wrong phase
    expect(isValidMove(open, { row: 9, col: 9 })).toBe(false);
    expect(isValidPlacement({ ...moved, turnPhase: 'moveKing' }, { row: 3, col: 3 })).toBe(false);
    expect(moveKing(moved, { row: 3, col: 5 })).toBe(moved); // already placing phase
  });

  it('resetGame restores opening; OOB king move identity', () => {
    let s = moveKing(createInitialGameState(), { row: 2, col: 5 });
    s = placeQuadraphage(s, { row: 4, col: 4 });
    const r = resetGame();
    expect(r.player1Supply).toBe(30);
    expect(r.moveHistory).toHaveLength(0);
    const open = createInitialGameState();
    expect(moveKing(open, { row: 0, col: 5 })).toBe(open);
  });
});
