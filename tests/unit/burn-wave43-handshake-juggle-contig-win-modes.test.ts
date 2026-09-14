/**
 * Wave 43 — Handshake juggle fill-first vs contig align-five. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG as JUGGLE_CFG } from '../../src/games/juggle/types';
import { CONFIG as CONTIG_CFG } from '../../src/games/contig-60/types';

describe('Wave 43 handshake — juggle×contig win modes', () => {
  it('juggle fills 81; contig aligns 5', () => {
    expect(JUGGLE_CFG.CELLS_TO_FILL).toBe(JUGGLE_CFG.GRID_SIZE ** 2);
    expect(CONTIG_CFG.WIN_BY_ALIGNMENT).toBe(5);
    expect(JUGGLE_CFG.GRID_SIZE).not.toBe(CONTIG_CFG.WIN_BY_ALIGNMENT);
  });
});
