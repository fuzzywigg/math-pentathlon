/**
 * Wave 42 — Queens & Guards getAdjacent ring1 / outer leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAdjacent, CONFIG } from '../../src/games/queens-guards/types';

describe('Wave 42 queens — getAdjacent ring1 and outer', () => {
  it('ring 1 position 0 has non-empty adjacency including throne', () => {
    const adj = getAdjacent({ ring: 1, position: 0 });
    expect(adj.length).toBeGreaterThan(0);
    expect(adj.some((a) => a.ring === 0 && a.position === 0)).toBe(true);
    expect(adj.some((a) => a.ring === 1)).toBe(true);
  });

  it('ring 1 adjacency includes same-ring neighbors and inner/outer links', () => {
    const adj = getAdjacent({ ring: 1, position: 3 });
    expect(adj.some((a) => a.ring === 1 && a.position === 2)).toBe(true);
    expect(adj.some((a) => a.ring === 1 && a.position === 4)).toBe(true);
    expect(adj.some((a) => a.ring === 0)).toBe(true);
    expect(adj.some((a) => a.ring === 2)).toBe(true);
  });

  it('outer ring player1 queen cell has non-empty adjacency', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const adj = getAdjacent({ ring: outer, position: 7 });
    expect(adj.length).toBeGreaterThan(0);
    expect(adj.every((a) => a.ring >= 0 && a.ring <= outer)).toBe(true);
    expect(adj.some((a) => a.ring === outer)).toBe(true);
    expect(adj.some((a) => a.ring === outer - 1)).toBe(true);
  });

  it('outer ring wraps same-ring neighbors', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const count = 6 * outer;
    const adj = getAdjacent({ ring: outer, position: 0 });
    expect(adj.some((a) => a.ring === outer && a.position === count - 1)).toBe(
      true
    );
    expect(adj.some((a) => a.ring === outer && a.position === 1)).toBe(true);
  });
});
