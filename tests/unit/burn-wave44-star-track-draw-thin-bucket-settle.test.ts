/**
 * Wave 44 — Star Track thin-bucket settle leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — thin bucket settle', () => {
  it('bucket size <2 ends with position winner or draw', () => {
    const base = createInitialState();
    const draw = drawChains({
      ...base,
      chainBucket: [base.chainBucket[0]],
      player1Position: 5,
      player2Position: 3,
    });
    expect(draw.phase).toBe('gameOver');
    expect(draw.winner).toBe('player1');
    const tied = drawChains({
      ...base,
      chainBucket: [],
      player1Position: 4,
      player2Position: 4,
    });
    expect(tied.phase).toBe('gameOver');
    expect(tied.winner).toBeNull();
  });
});
