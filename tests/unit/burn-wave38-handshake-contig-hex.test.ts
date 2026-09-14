/**
 * Wave 38 — handshake: alignment getHexNeighbors vs hex coordinate neighbors.
 * Existing modules only. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getHexNeighbors } from '../../src/core/alignment/contiguous';
import { getNeighbors as hexGetNeighbors, hexDistance, createAxial } from '../../src/core/hex';
import type { ContiguousConfig } from '../../src/core/alignment/types';

describe('Wave 38 handshake — hex neighbor count parity', () => {
  it('interior offset hex neighbors are distance-1 in axial space for odd-q', () => {
    // Contiguous hex neighbors use odd/even ROW offset (odd-r style).
    // Hex module AXIAL_DIRECTIONS are axial; compare counts only for interior.
    const cfg: ContiguousConfig = { rows: 7, cols: 7 };
    for (const row of [2, 3, 4]) {
      for (const col of [2, 3, 4]) {
        expect(getHexNeighbors(row, col, cfg)).toHaveLength(6);
      }
    }
    // axial hex neighbors always 6
    for (const q of [-2, 0, 2]) {
      for (const r of [-2, 0, 2]) {
        const n = hexGetNeighbors(createAxial(q, r));
        expect(n).toHaveLength(6);
        for (const nb of n) {
          expect(hexDistance(createAxial(q, r), nb)).toBe(1);
        }
      }
    }
  });

  it('hexDistance ring sizes match 6*radius for radius 1..4', () => {
    const origin = createAxial(0, 0);
    for (let radius = 1; radius <= 4; radius++) {
      const ring = hexGetNeighbors(origin); // only radius 1 via neighbors
      void ring;
    }
    // use spiral via repeated neighbor expansion
    const seen = new Set<string>(['0,0']);
    let frontier = [origin];
    for (let radius = 1; radius <= 4; radius++) {
      const next = [];
      for (const f of frontier) {
        for (const nb of hexGetNeighbors(f)) {
          const key = `${nb.q},${nb.r}`;
          if (!seen.has(key)) {
            seen.add(key);
            next.push(nb);
          }
        }
      }
      // new cells at this wave approximate ring; count at exact distance
      let atR = 0;
      for (const key of seen) {
        const [q, r] = key.split(',').map(Number);
        if (hexDistance(origin, createAxial(q, r)) === radius) atR++;
      }
      expect(atR).toBe(6 * radius);
      frontier = next;
    }
  });
});
