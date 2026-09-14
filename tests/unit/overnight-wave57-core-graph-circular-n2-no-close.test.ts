/**
 * Overnight HEAVY leftover after #264 — createCircularGraph(2) skips ring close.
 * Distinct from wave56 circular n=8 demo. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createCircularGraph } from '../../src/core/graph';

describe('Wave 57 core graph — circular n=2', () => {
  it('two nodes get a single forward edge without closing ring', () => {
    const g = createCircularGraph(2);
    expect(g.nodes.size).toBe(2);
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0]).toMatchObject({ from: 'n0', to: 'n1' });
  });
});
