/**
 * Wave 45 — Kwatro center diagonal connections leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — board connections', () => {
  it('center node has diagonals; corner edge lacks them', () => {
    const state = createInitialState();
    const center = state.nodes.get('n2-2')!;
    expect(center.connections).toContain('n1-1');
    expect(center.connections).toContain('n3-3');
    const corner = state.nodes.get('n0-0')!;
    expect(corner.connections).not.toContain('n1-1');
  });

  it('top/bottom rows are numbered start seats', () => {
    const state = createInitialState();
    expect(state.nodes.get('n0-0')!.isNumbered).toBe(true);
    expect(state.nodes.get('n4-2')!.isNumbered).toBe(true);
    expect(state.nodes.get('n2-2')!.isNumbered).toBe(false);
  });
});
