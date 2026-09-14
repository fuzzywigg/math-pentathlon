/**
 * Overnight TOKENMAXX — attribute compare operator matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { compare } from '../../src/core/attributes/logic';

describe('Overnight attr — compare operators', () => {
  it('equality / inequality across types', () => {
    expect(compare(3, 'equals', 3)).toBe(true);
    expect(compare('red', 'equals', 'red')).toBe(true);
    expect(compare(true, 'not_equals', false)).toBe(true);
    expect(compare(1, 'not_equals', 1)).toBe(false);
  });

  it('numeric inequalities reject non-numbers', () => {
    expect(compare(5, 'greater_than', 2)).toBe(true);
    expect(compare(2, 'less_equal', 2)).toBe(true);
    expect(compare(1, 'greater_equal', 2)).toBe(false);
    expect(compare('a' as never, 'greater_than', 1)).toBe(false);
    expect(compare(1, 'less_than', 'b' as never)).toBe(false);
  });

  it('unknown operator returns false', () => {
    expect(compare(1, 'bogus' as never, 1)).toBe(false);
  });
});
