/**
 * Wave 42 — Kings getCurrentPhaseMessage matrix + selectKing wrong phase. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — phase messages', () => {
  it('message matrix across phases', () => {
    let s = createInitialGameState();
    expect(getCurrentPhaseMessage(s)).toContain('Player 1');
    s = selectKing(s);
    expect(getCurrentPhaseMessage(s)).toMatch(/green/);
    s = moveKing(s, { row: 2, col: 4 });
    expect(getCurrentPhaseMessage(s)).toMatch(/Quadraphage/);
    const over = {
      ...s,
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getCurrentPhaseMessage(over)).toMatch(/Player 2 wins/);
  });

  it('selectKing noop outside moveKing; player2 select after flip', () => {
    const placing = moveKing(createInitialGameState(), { row: 2, col: 5 });
    expect(selectKing(placing)).toBe(placing);
    const p2 = {
      ...createInitialGameState(),
      currentPlayer: 'player2' as const,
    };
    const sel = selectKing(p2);
    expect(sel.selectedKingPosition).toEqual({ row: 9, col: 5 });
  });
});
