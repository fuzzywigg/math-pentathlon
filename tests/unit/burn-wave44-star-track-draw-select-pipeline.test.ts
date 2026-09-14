/**
 * Wave 44 — Star Track draw/select pipeline leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — draw/select pipeline', () => {
  it('draw offers two; select advances and recycles unused', () => {
    let s = createInitialState();
    const before = s.chainBucket.length;
    s = drawChains(s);
    expect(s.phase).toBe('selectChain');
    expect(s.drawnChains).toHaveLength(2);
    expect(s.chainBucket).toHaveLength(before - 2);
    const unused = s.drawnChains![1];
    const used = s.drawnChains![0];
    s = selectChain(s, 0);
    expect(s.phase).toBe('drawChains');
    expect(s.currentPlayer).toBe('player2');
    expect(s.player1Position).toBe(used.length);
    expect(s.chainBucket.some((c) => c.id === unused.id)).toBe(true);
    expect(s.moveHistory).toHaveLength(1);
  });

  it('wrong-phase draw is identity', () => {
    const s = createInitialState();
    expect(drawChains({ ...s, phase: 'gameOver' })).toEqual({
      ...s,
      phase: 'gameOver',
    });
  });
});
