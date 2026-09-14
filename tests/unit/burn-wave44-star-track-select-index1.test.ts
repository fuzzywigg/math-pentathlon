/**
 * Wave 44 — Star Track selectChain index 1 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, ChainLink } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — select index 1', () => {
  it('uses second chain and recycles first', () => {
    const c0: ChainLink = { id: 10, length: 2 };
    const c1: ChainLink = { id: 11, length: 5 };
    const next = selectChain(
      {
        ...createInitialState(),
        phase: 'selectChain',
        drawnChains: [c0, c1],
        chainBucket: [],
      },
      1
    );
    expect(next.player1Position).toBe(5);
    expect(next.chainBucket.map((c) => c.id)).toContain(10);
  });
});
