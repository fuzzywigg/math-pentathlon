/**
 * Wave 59 Contig/SD residual — Sum hasPlayableMove empty hand. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { hasPlayableMove } from '../../src/games/sum-dominoes/ai';

describe('Wave 59 sum — hasPlayable empty', () => {
  it('returns false for empty hand', () => {
    const state = {
      ...createInitialState(),
      hands: { player1: [], player2: [] },
    };
    expect(hasPlayableMove(state, 'player1', 7)).toBe(false);
  });
});
