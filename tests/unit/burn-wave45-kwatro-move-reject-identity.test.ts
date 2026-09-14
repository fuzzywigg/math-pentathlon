/**
 * Wave 45 — Kwatro moveChip reject identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — move reject', () => {
  it('identity without selection or invalid dest', () => {
    const state = createInitialState();
    expect(moveChip(state, 'n1-0')).toBe(state);
    const sel = selectChip(state, 'p1-0');
    expect(moveChip(sel, 'n4-4')).toBe(sel);
  });
});
