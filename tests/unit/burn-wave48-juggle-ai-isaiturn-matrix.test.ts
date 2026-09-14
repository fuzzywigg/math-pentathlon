/**
 * Wave 48 — Juggle isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { isAITurn } from '../../src/games/juggle/ai';

describe('Wave 48 juggle — isAITurn', () => {
  it('false for hvh / null seat / gameOver; true for matching seat', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
  });
});
