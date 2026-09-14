/**
 * Wave 42 — Pent'Em In getValidPlacements F/I5/X opening count leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getValidPlacements } from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — getValidPlacements opening counts', () => {
  it('F has many valid openings on empty board', () => {
    const state = createInitialState();
    const spots = getValidPlacements(state, 'F', 0, false);
    expect(spots.length).toBeGreaterThan(50);
  });

  it('I5 has valid horizontal and vertical openings', () => {
    const state = createInitialState();
    const flat = getValidPlacements(state, 'I5', 0, false);
    const upright = getValidPlacements(state, 'I5', 90, false);
    expect(flat.length).toBeGreaterThan(0);
    expect(upright.length).toBeGreaterThan(0);
  });

  it('X has valid openings despite no rotate/flip', () => {
    const state = createInitialState();
    const spots = getValidPlacements(state, 'X', 0, false);
    expect(spots.length).toBeGreaterThan(30);
    expect(spots.some((p) => p.row === 0 && p.col === 0)).toBe(true);
  });
});
