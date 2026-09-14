/**
 * Wave 43 — Juggle isAITurn mode/seat/gameOver gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { isAITurn } from '../../src/games/juggle/ai';

describe('Wave 43 juggle — isAITurn gates', () => {
  it('false for human-vs-human, null ai, wrong seat, gameOver', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(open, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
