/**
 * Wave 48 — Ramrod executeAITurn passes when no valid moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn, getAIMove } from '../../src/games/ramrod/ai';

describe('Wave 48 ramrod — AI empty hand pass', () => {
  it('getAIMove null and execute flips seat when hand empty', () => {
    const s = createInitialState();
    const jammed = {
      ...s,
      playerRods: { ...s.playerRods, player1: [] as string[] },
    };
    expect(getAIMove(jammed, 'player1', 'medium')).toBeNull();
    const next = executeAITurn(jammed, 'player1', 'medium');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingRod');
  });
});
