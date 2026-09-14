/**
 * Wave 39 — attributes compare typeguard + unknown op leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { compare, evaluateCondition } from '../../src/core/attributes';

describe('Wave 39 attributes — compare typeguard', () => {
  it('equals / not_equals work for mixed types', () => {
    expect(compare('red', 'equals', 'red')).toBe(true);
    expect(compare('red', 'equals', 'blue')).toBe(false);
    expect(compare(1, 'not_equals', 2)).toBe(true);
    expect(compare(true, 'equals', true)).toBe(true);
  });

  it('numeric ops require numbers else false', () => {
    expect(compare(5, 'greater_than', 3)).toBe(true);
    expect(compare(5, 'less_than', 3)).toBe(false);
    expect(compare(5, 'greater_equal', 5)).toBe(true);
    expect(compare(4, 'less_equal', 5)).toBe(true);
    expect(compare('a', 'greater_than', 1)).toBe(false);
    expect(compare(1, 'less_than', 'b')).toBe(false);
    expect(compare(true, 'greater_equal', false)).toBe(false);
  });

  it('unknown operator defaults false', () => {
    expect(compare(1, 'nope' as never, 1)).toBe(false);
  });

  it('evaluateCondition missing attribute is false', () => {
    const piece = { id: 'p', attributes: { color: 'red' } };
    expect(
      evaluateCondition(piece, {
        attribute: 'shape',
        operator: 'equals',
        value: 'circle',
      })
    ).toBe(false);
    expect(
      evaluateCondition(piece, {
        attribute: 'color',
        operator: 'equals',
        value: 'red',
      })
    ).toBe(true);
  });
});
