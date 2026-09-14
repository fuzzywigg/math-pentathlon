/**
 * Overnight TOKENMAXX — Stars isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { isAITurn } from '../../src/games/stars-bars/ai';

describe('Overnight stars — isAITurn matrix', () => {
  it('mode/seat/gameOver gates', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...s, currentPlayer: 'player2' }, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn({ ...s, phase: 'gameOver' }, 'player1', 'human-vs-ai')).toBe(false);
  });
});
