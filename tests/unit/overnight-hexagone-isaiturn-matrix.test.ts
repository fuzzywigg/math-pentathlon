/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone isAITurn leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Overnight hex-a-gone — isAITurn', () => {
  it('matrix human/ai/null/gameOver', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver', winner: 'player2' }, 'player1', 'human-vs-ai')).toBe(false);
  });
});
