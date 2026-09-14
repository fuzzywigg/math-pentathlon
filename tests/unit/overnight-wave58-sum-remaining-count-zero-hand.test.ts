/**
 * Wave 58 Contig/SD residual — Sum getRemainingCount empty hand. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — remaining count empty', () => {
  it('returns 0 for emptied seat hand', () => {
    const base = createInitialState();
    const state = {
      ...base,
      hands: { ...base.hands, player2: [] },
    };
    expect(getRemainingCount(state, 'player2')).toBe(0);
    expect(getRemainingCount(state, 'player1')).toBe(base.hands.player1.length);
  });
});
