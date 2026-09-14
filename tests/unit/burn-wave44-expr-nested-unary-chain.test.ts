/**
 * Wave 44 — nested unary negation chain leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluate, parse, tokenize, astToString } from '../../src/core/expressions';

describe('Wave 44 expr — nested unary chain', () => {
  it('---5 evaluates to -5', () => {
    const r = evaluate('---5');
    expect(r.success).toBe(true);
    expect(r.value).toBe(-5);
  });

  it('astToString nests unary wrappers', () => {
    const ast = parse(tokenize('--3'));
    expect(astToString(ast)).toBe('-(-(3))');
  });
});
