/**
 * Overnight TOKENMAXX — Calla getPhaseMessage animating leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Overnight calla — phase messages', () => {
  it('animating / select / win / tie', () => {
    const s = createInitialState();
    expect(getPhaseMessage(s)).toMatch(/Blue.*Select/i);
    expect(
      getPhaseMessage({ ...s, phase: 'animating' })
    ).toMatch(/distributing/i);
    expect(
      getPhaseMessage({ ...s, phase: 'gameOver', winner: 'player2' })
    ).toBe('Red wins!');
    expect(
      getPhaseMessage({ ...s, phase: 'gameOver', winner: 'tie' })
    ).toMatch(/tie/i);
  });
});
