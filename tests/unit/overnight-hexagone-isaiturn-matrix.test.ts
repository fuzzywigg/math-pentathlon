/**
 * Overnight TOKENMAXX — Hex-a-Gone isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Overnight hexagone — isAITurn matrix', () => {
  it('mode/seat/gameOver gates', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver' }, 'player1', 'human-vs-ai')).toBe(false);
  });
});
