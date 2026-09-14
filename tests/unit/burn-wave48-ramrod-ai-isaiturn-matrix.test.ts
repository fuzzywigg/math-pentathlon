/**
 * Wave 48 — Ramrod isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { isAITurn } from '../../src/games/ramrod/ai';

describe('Wave 48 ramrod — isAITurn', () => {
  it('gates hvh / null / gameOver / seat', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')).toBe(false);
  });
});
