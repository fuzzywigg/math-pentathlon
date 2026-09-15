/**
 * Wave 68 leftover after tip/#336 — Kwatro n4-4 coords OFFSET/SPACING.
 * Wave67 n0-0/n1-1; deepen corner leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 68 kwatro — rules n4-4 coords', () => {
  it('locks n4-4 at OFFSET+4*SPACING', () => {
    const state = createInitialState();
    expect(state.nodes.get('n4-4')).toMatchObject({ x: 380, y: 380 });
  });
});
