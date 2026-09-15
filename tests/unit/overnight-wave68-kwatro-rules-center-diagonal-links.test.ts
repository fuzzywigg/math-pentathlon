/**
 * Wave 68 leftover after tip/#336 — Kwatro center node diagonal connections.
 * Coords covered; deepen diagonal leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 68 kwatro — rules center diagonal links', () => {
  it('n2-2 includes diagonal neighbors', () => {
    const state = createInitialState();
    const conns = state.nodes.get('n2-2')!.connections;
    expect(conns).toEqual(expect.arrayContaining(['n1-1', 'n1-3', 'n3-1', 'n3-3']));
  });
});
