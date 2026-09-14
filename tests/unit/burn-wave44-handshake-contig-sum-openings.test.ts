/**
 * Wave 44 — Contig × Sum Dominoes opening handshake leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 handshake — Contig × Sum openings', () => {
  it('both open rolling for player1', () => {
    const c = createContig();
    const s = createSum();
    expect(c.phase).toBe('rolling');
    expect(s.phase).toBe('rolling');
    expect(c.currentPlayer).toBe('player1');
    expect(s.currentPlayer).toBe('player1');
  });
});
