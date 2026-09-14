/**
 * Wave 43 — Sum Dominoes passTurn phase gate leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 43 sum-dominoes — pass phase gate', () => {
  it('identity on rolling/placing/gameOver', () => {
    const base = createInitialState();
    expect(passTurn(base)).toBe(base);
    const placing = { ...base, phase: 'placing' as const, currentDice: [1, 2] as [number, number] };
    expect(passTurn(placing)).toBe(placing);
    const over = { ...base, phase: 'gameOver' as const };
    expect(passTurn(over)).toBe(over);
  });
});
