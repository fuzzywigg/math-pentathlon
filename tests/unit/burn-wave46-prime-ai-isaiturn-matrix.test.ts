/**
 * Wave 46 — Prime Gold isAITurn matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { isAITurn } from '../../src/games/prime-gold/ai';

describe('Wave 46 prime — isAITurn', () => {
  it('true only human-vs-ai matching seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
  });
});
