/**
 * Wave 45 TOKENMAXX — Kings isAITurn mode/phase matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn } from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 45 kings — isAITurn matrix', () => {
  it('false for human-vs-human / null ai / gameOver', () => {
    const open = createInitialGameState();
    expect(isAITurn(open, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(open, null, 'human-vs-ai')).toBe(false);
    const over = { ...open, turnPhase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('true only when seat matches in human-vs-ai', () => {
    const open = createInitialGameState();
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(open, 'player2', 'human-vs-ai')).toBe(false);
    const p2 = { ...open, currentPlayer: 'player2' as const };
    expect(isAITurn(p2, 'player2', 'human-vs-ai')).toBe(true);
  });
});
