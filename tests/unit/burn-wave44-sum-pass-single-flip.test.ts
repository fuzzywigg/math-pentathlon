/**
 * Wave 44 — Sum Dominoes single pass seat flip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — pass single flip', () => {
  it('first pass flips seat without settle', () => {
    const s = {
      ...createInitialState(),
      phase: 'passing' as const,
      passCount: 0,
      currentPlayer: 'player1' as const,
    };
    const next = passTurn(s);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.passCount).toBe(1);
    expect(next.winner).toBeNull();
  });
});
