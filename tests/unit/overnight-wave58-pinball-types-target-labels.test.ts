/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball target label catalog.
 * Wave55 locked ids/values; deepen label strings leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
} from '../../src/games/fraction-pinball/types';

describe('Wave 58 pinball types — target labels', () => {
  it('targets labels match TARGET_POINTS leftover', () => {
    const state = createInitialState();
    expect(state.targets.map((t) => t.label)).toEqual(
      TARGET_POINTS.map(String)
    );
    expect(state.targets[0].label).toBe('10');
  });
});
