/**
 * Wave 47 leftover after #214/#215 — six-engine openings handshake.
 * Distinct from fab/UI and pinball/remainder/kings/queens; not prime/fiar/frac/pent.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as stars } from '../../src/games/stars-bars/rules';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as track } from '../../src/games/star-track/types';
import { createInitialState as hexagone } from '../../src/games/hex-a-gone/types';
import { createInitialState as par } from '../../src/games/par-55/rules';
import { createInitialState as kwatro } from '../../src/games/kwatro-sinko/rules';

describe('Wave 47 handshake — six leftover openings', () => {
  it('stars/sum/track/hexagone/par/kwatro open sanely', () => {
    expect(stars().phase).toBe('selectingCard');
    expect(stars().playerHands.player1.length).toBeGreaterThan(0);
    expect(sum().phase).toBe('rolling');
    expect(sum().hands.player1.length).toBeGreaterThan(0);
    expect(track().phase).toBe('drawChains');
    expect(track().player1Position).toBe(0);
    expect(hexagone().phase).toBe('selectBlocks');
    expect(par().hands.player1.length).toBeGreaterThan(0);
    expect(kwatro().phase).toBe('selectingChip');
    expect(kwatro().chips.size).toBeGreaterThan(0);
  });
});
