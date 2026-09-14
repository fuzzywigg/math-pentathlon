/**
 * Wave 45 — Handshake Contig place-gate + Star draw-gate
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { placeChip } from '../../src/games/contig-60/rules';
import { drawChains } from '../../src/games/star-track/rules';

describe('Wave 45 handshake — Contig place / Star draw gates', () => {
  it('opening states no-op place and succeed draw independently', () => {
    const contig = createContig();
    expect(placeChip(contig, 1, '1+0')).toBe(contig);
    const star = drawChains(createStar());
    expect(star.phase).toBe('selectChain');
    expect(star.drawnChains).not.toBeNull();
  });
});
