/**
 * Wave 45 TOKENMAXX — Kwatro isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { isAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — isAITurn', () => {
  it('mode/seat/over matrix', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(open, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player1', 'human-vs-human')).toBe(false);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
