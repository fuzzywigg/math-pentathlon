/**
 * Wave 44 — Contig × Star Track opening handshake leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createStar } from '../../src/games/star-track/types';

describe('Wave 44 handshake — Contig × Star openings', () => {
  it('distinct opening phases; zero scores/positions', () => {
    const c = createContig();
    const s = createStar();
    expect(c.phase).toBe('rolling');
    expect(s.phase).toBe('drawChains');
    expect(c.scores.player1 + c.scores.player2).toBe(0);
    expect(s.player1Position + s.player2Position).toBe(0);
  });
});
