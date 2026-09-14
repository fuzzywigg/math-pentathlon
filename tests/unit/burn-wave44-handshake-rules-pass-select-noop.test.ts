/**
 * Wave 44 — Contig pass × Star select noop handshake leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { passTurn as passContig } from '../../src/games/contig-60/rules';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 44 handshake — Contig pass × Star select noop', () => {
  it('opening states reject pass/select', () => {
    const c = createContig();
    const s = createStar();
    expect(passContig(c)).toBe(c);
    expect(selectChain(s, 1)).toBe(s);
  });
});
