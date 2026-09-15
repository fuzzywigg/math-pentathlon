/**
 * Wave 68 leftover after tip/#336 — Kwatro corner node no diagonal links.
 * Center diagonals; deepen corner leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 68 kwatro — rules corner no diagonal', () => {
  it('n0-0 only connects orthogonal', () => {
    const state = createInitialState();
    const conns = state.nodes.get('n0-0')!.connections;
    expect(conns).toEqual(expect.arrayContaining(['n0-1', 'n1-0']));
    expect(conns).not.toContain('n1-1');
    expect(conns).toHaveLength(2);
  });
});
