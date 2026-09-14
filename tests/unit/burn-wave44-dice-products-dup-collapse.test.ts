/**
 * Wave 44 — getAllPossibleProducts duplicate collapse leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleProducts } from '../../src/core/dice';

describe('Wave 44 dice — products dup collapse', () => {
  it('singleton product is itself', () => {
    expect(getAllPossibleProducts([5])).toEqual([5]);
  });

  it('same factors collapse duplicate products via Set', () => {
    const p = getAllPossibleProducts([2, 3, 6]);
    expect(p).toContain(2);
    expect(p).toContain(6);
    expect(p).toContain(36); // 2*3*6
    expect(new Set(p).size).toBe(p.length);
    expect([...p].sort((a, b) => a - b)).toEqual(p);
  });
});
