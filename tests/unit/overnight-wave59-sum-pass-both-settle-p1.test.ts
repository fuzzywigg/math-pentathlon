/**
 * Wave 59 Contig/SD residual — Sum double-pass settle fewer pips wins. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/sum-dominoes/rules';

describe('Wave 59 sum — double-pass settle', () => {
  it('second pass settles winner by fewer remaining pips', () => {
    const base = createInitialState();
    const light = {
      id: 'light',
      face1: 0,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const heavy = {
      id: 'heavy',
      face1: 6,
      face2: 6,
      owner: 'player2' as const,
      orientation: 'horizontal' as const,
    };
    const state = {
      ...base,
      phase: 'passing' as const,
      passCount: 1,
      hands: { player1: [light], player2: [heavy] },
    };
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.passCount).toBe(2);
  });
});
