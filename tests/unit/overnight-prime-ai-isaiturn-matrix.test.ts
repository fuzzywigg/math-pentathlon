/**
 * Overnight HEAVY — Prime Gold isAITurn mode/seat/phase matrix.
 * Distinct leftover vs wave42 is-turn smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn } from '../../src/games/prime-gold/ai';
import { createInitialState } from '../../src/games/prime-gold/rules';

describe('Overnight prime — isAITurn matrix', () => {
  it('false for human-vs-human, null seat, gameOver, wrong seat', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(open, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player2', 'human-vs-ai')).toBe(false);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('true when human-vs-ai and current seat matches ai', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
  });
});
