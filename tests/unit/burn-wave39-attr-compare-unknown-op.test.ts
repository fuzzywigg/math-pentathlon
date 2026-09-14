/**
 * Wave 39 — compare default unknown operator leftovers.
 * Beyond wave 29 attr. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { compare } from '../../src/core/attributes';
import type { ComparisonOperator } from '../../src/core/attributes';

describe('Wave 39 attr — compare unknown op', () => {
  it('unknown operator returns false', () => {
    expect(compare(1, 'wat' as ComparisonOperator, 1)).toBe(false);
    expect(compare('a', 'contains' as ComparisonOperator, 'a')).toBe(false);
  });

  it('equals / not_equals still work', () => {
    expect(compare(3, 'equals', 3)).toBe(true);
    expect(compare(3, 'not_equals', 4)).toBe(true);
    expect(compare('x', 'equals', 'y')).toBe(false);
  });

  it('numeric compares reject mixed types', () => {
    expect(compare(5, 'greater_than', '3' as unknown as number)).toBe(false);
    expect(compare(2, 'less_equal', 2)).toBe(true);
  });
});
