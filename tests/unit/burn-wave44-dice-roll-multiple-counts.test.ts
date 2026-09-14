/**
 * Wave 44 — rollMultiple count edge leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollMultiple, roll } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — rollMultiple counts', () => {
  it('count 0 → empty rolls total 0', () => {
    const r = rollMultiple('d6', 0);
    expect(r.rolls).toHaveLength(0);
    expect(r.total).toBe(0);
  });

  it('count 1 matches roll single type shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const a = rollMultiple('d12', 1);
    const b = roll('d12');
    expect(a.rolls).toHaveLength(1);
    expect(b.rolls).toHaveLength(1);
    expect(a.rolls[0].diceType).toBe('d12');
    expect(a.rolls[0].value).toBe(1);
  });
});
