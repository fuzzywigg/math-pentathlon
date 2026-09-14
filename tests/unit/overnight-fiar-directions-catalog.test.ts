/**
 * Overnight HEAVY — FIAR getDirections includes four diagonal vectors.
 * Distinct leftover vs types graph helpers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getDirections } from '../../src/games/fiar/types';

describe('Overnight fiar — directions catalog', () => {
  it('exposes 8 directions with matching ±diagonal pairs', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const keys = dirs.map((d) => `${d.dx},${d.dy}`);
    expect(keys).toContain('80,80');
    expect(keys).toContain('-80,-80');
    expect(keys).toContain('80,-80');
    expect(keys).toContain('-80,80');
  });
});
