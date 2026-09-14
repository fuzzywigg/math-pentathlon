/**
 * Wave 40 — astToString unary + variable leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { astToString, parse, tokenize } from '../../src/core/expressions';

describe('Wave 40 expr — astToString unary / variable', () => {
  it('formats unary negation', () => {
    const ast = parse(tokenize('-5'));
    expect(astToString(ast)).toBe('-(5)');
  });

  it('formats variable and binary', () => {
    const ast = parse(tokenize('x+2'));
    const s = astToString(ast);
    expect(s).toContain('x');
    expect(s).toContain('2');
  });
});
