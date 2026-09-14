/**
 * Overnight TOKENMAXX HEAVY — getTwoDiceResults zero-div + swap leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getTwoDiceResults } from '../../src/core/dice/roller';

describe('Overnight dice — twoDice zero and asymmetric swap', () => {
  it('a=0 excludes divisions by a; keeps b÷a skipped', () => {
    const r = getTwoDiceResults(0, 4);
    expect(r.get('0 + 4')).toBe(4);
    expect(r.get('0 × 4')).toBe(0);
    expect(r.get('0 - 4')).toBe(-4);
    expect(r.get('4 - 0')).toBe(4);
    expect(r.has('0 ÷ 4')).toBe(true); // 0%4===0 → 0
    expect(r.get('0 ÷ 4')).toBe(0);
    expect(r.has('4 ÷ 0')).toBe(false);
  });

  it('equal dice collapse subtract to 0 and skip self-div duplicate keys carefully', () => {
    const r = getTwoDiceResults(5, 5);
    expect(r.get('5 + 5')).toBe(10);
    expect(r.get('5 - 5')).toBe(0);
    expect(r.get('5 × 5')).toBe(25);
    expect(r.get('5 ÷ 5')).toBe(1);
    // Both division branches set the same key
    expect([...r.keys()].filter((k) => k.includes('÷'))).toHaveLength(1);
  });
});
