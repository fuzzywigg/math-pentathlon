/**
 * Wave 67 leftover after tip/#324 — Kwatro board node coords exact.
 * Burn-wave42 only typeof/>0; deepen OFFSET 60 / SPACING 80 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 67 kwatro — rules node coords exact', () => {
  it('locks corner and center coordinates from OFFSET/SPACING', () => {
    const state = createInitialState();
    expect(state.nodes.get('n0-0')).toMatchObject({ x: 60, y: 60 });
    expect(state.nodes.get('n1-1')).toMatchObject({ x: 140, y: 140 });
    expect(state.nodes.get('n2-2')).toMatchObject({ x: 220, y: 220 });
    expect(state.nodes.get('n4-4')).toMatchObject({ x: 380, y: 380 });
  });
});
