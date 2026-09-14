/**
 * Wave 38 — handshake: math-piece parity painted on a board → contig regions.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createMathPiece } from '../../src/core/attributes/logic';
import {
  findAllRegions,
  countRegionsByValue,
  getLargestRegion,
} from '../../src/core/alignment/contiguous';
import { createArrayGetter } from '../../src/core/alignment/grid-alignment';
import type { ContiguousConfig, CellValue } from '../../src/core/alignment/types';

describe('Wave 38 handshake — parity paint flood', () => {
  it('1..16 grid painted even/odd forms vertical stripes under 4- and 8-connect', () => {
    const nums = Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => r * 4 + c + 1)
    );
    const board: CellValue[][] = nums.map((row) =>
      row.map((n) => {
        const p = createMathPiece(n);
        return p.attributes.isEven ? 'E' : 'O';
      })
    );
    // Row-major 1..16 → columns alternate O/E and stack vertically into 4 stripes.
    // Diagonals still land on the opposite parity, so 8-connect keeps 2+2 regions.
    const get = createArrayGetter(board);
    const cfg4: ContiguousConfig = { rows: 4, cols: 4 };
    const cfg8: ContiguousConfig = { rows: 4, cols: 4, includeDiagonals: true };
    for (const cfg of [cfg4, cfg8]) {
      const counts = countRegionsByValue(get, cfg);
      expect(counts.get('E')).toBe(2);
      expect(counts.get('O')).toBe(2);
      expect(getLargestRegion('E', get, cfg)!.size).toBe(4);
      expect(getLargestRegion('O', get, cfg)!.size).toBe(4);
    }

    // True checkerboard merges under 8-connect only
    const checker: CellValue[][] = Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => ((r + c) % 2 === 0 ? 'E' : 'O'))
    );
    const g2 = createArrayGetter(checker);
    expect(countRegionsByValue(g2, cfg4).get('E')).toBe(8);
    expect(countRegionsByValue(g2, cfg8).get('E')).toBe(1);
    expect(findAllRegions(g2, cfg8)).toHaveLength(2);
  });
});
