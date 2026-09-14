/**
 * Wave 42 handshake — fiar × kings opening / opponent / over gates.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fiarInit, getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { getOpponent as kingsOpp, checkWinCondition } from '../../src/games/kings-quadraphages/rules';
import { checkWinner as fiarWinner } from '../../src/games/fiar/rules';

describe('Wave 42 handshake — fiar × kings', () => {
  it('both open player1; no winner; opponent aligned', () => {
    const f = fiarInit();
    const k = kingsInit();
    expect(f.currentPlayer).toBe(k.currentPlayer);
    expect(fiarOpp('player1')).toBe(kingsOpp('player1'));
    expect(fiarWinner(f)).toBeNull();
    expect(checkWinCondition(k)).toBeNull();
  });

  it('forced gameOver states stay isolated', () => {
    const f = { ...fiarInit(), phase: 'gameOver' as const, winner: 'player2' as const };
    const k = { ...kingsInit(), turnPhase: 'gameOver' as const, winner: 'player1' as const };
    expect(f.winner).not.toBe(k.winner);
    expect(kingsInit().turnPhase).toBe('moveKing');
    expect(fiarInit().phase).toBe('placement');
  });
});
