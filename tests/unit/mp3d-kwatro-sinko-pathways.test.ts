import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { collectPathwayEdgeKeys } from '../../src/ui/three/kwatro-sinko-board-3d';

describe('mp3d Kwatro-Sinko pathway edges', () => {
  it('includes one-way engine diagonals such as n1-1 → n0-0', () => {
    const state = createInitialState();
    const n11 = state.nodes.get('n1-1');
    expect(n11?.connections).toContain('n0-0');
    // Outer start row does not list the reciprocal link.
    expect(state.nodes.get('n0-0')?.connections).not.toContain('n1-1');

    const keys = collectPathwayEdgeKeys(state);
    expect(keys).toContain('n0-0|n1-1');
  });

  it('de-dupes reciprocal links to a single undirected key', () => {
    const state = createInitialState();
    const keys = collectPathwayEdgeKeys(state);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
    // Horizontal neighbors are reciprocal — still one key.
    expect(keys).toContain('n0-0|n0-1');
    expect(keys.filter((k) => k === 'n0-0|n0-1')).toHaveLength(1);
  });
});
