/**
 * Wave 42 — Kwatro-Sinko board connections (center diagonals vs edges). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 42 kwatro-sinko — opening connections', () => {
  it('corner nodes have two orthogonal neighbors only', () => {
    const { nodes } = createInitialState();
    expect(nodes.get('n0-0')?.connections.sort()).toEqual(['n0-1', 'n1-0']);
    expect(nodes.get('n4-4')?.connections.sort()).toEqual(['n3-4', 'n4-3']);
  });

  it('center node n2-2 has eight connections including diagonals', () => {
    const center = createInitialState().nodes.get('n2-2');
    expect(center?.connections).toHaveLength(8);
    expect(center?.connections).toContain('n1-1');
    expect(center?.connections).toContain('n1-3');
    expect(center?.connections).toContain('n3-1');
    expect(center?.connections).toContain('n3-3');
  });

  it('edge-but-not-corner nodes lack diagonal shortcuts', () => {
    const edge = createInitialState().nodes.get('n2-0');
    expect(edge?.connections).not.toContain('n1-1');
    expect(edge?.connections).not.toContain('n3-1');
    expect(edge?.connections.sort()).toEqual(['n1-0', 'n2-1', 'n3-0']);
  });

  it('connections are bidirectional along shared edges', () => {
    const { nodes } = createInitialState();
    const a = nodes.get('n1-2');
    const b = nodes.get('n2-2');
    expect(a?.connections).toContain('n2-2');
    expect(b?.connections).toContain('n1-2');
  });
});
