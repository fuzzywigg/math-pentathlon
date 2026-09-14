/**
 * Wave 43 TOKENMAXX — Contig × Star Track opening handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { createInitialState as starInit } from '../../src/games/star-track/types';

describe('Wave 43 handshake — contig × star openings', () => {
  it('rolling/drawChains openings share null winners', () => {
    const c = contigInit();
    const s = starInit();
    expect(c.phase).toBe('rolling');
    expect(s.phase).toBe('drawChains');
    expect(c.winner).toBeNull();
    expect(s.winner).toBeNull();
    expect(c.cells.size).toBe(60);
    expect(s.chainBucket.length).toBe(24);
  });
});
