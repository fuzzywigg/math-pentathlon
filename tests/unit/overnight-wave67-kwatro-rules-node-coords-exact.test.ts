/**
 * Wave 67 leftover after tip/#324 — Kwatro board node coords exact.
 * Burn-wave42 only typeof/>0; deepen OFFSET 60 / SPACING 80 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 67 kwatro — rules node coords exact', () => {
  it('locks n0-0 and n1-1 coordinates from OFFSET/SPACING', () => {
    const state = createInitialState();
    expect(state.nodes.get('n0-0')).toMatchObject({ x: 60, y: 60 });
    expect(state.nodes.get('n1-1')).toMatchObject({ x: 140, y: 140 });
  });
});
