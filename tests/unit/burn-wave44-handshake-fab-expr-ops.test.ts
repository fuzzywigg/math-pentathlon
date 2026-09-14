/**
 * Wave 44 — fab calculateResult × expr evaluate arithmetic handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculateResult, getOperationSymbol } from '../../src/games/fab-a-diffy/rules';
import { evaluate } from '../../src/core/expressions';
import { toDecimal } from '../../src/core/fractions';

describe('Wave 44 handshake — fab × expr ops', () => {
  it('fab add 1/2+1/3 matches expr decimal path', () => {
    const frac = calculateResult(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
      'add'
    );
    expect(frac).not.toBeNull();
    const expr = evaluate('1/2+1/3');
    expect(expr.success).toBe(true);
    expect(Math.abs(toDecimal(frac!) - expr.value!)).toBeLessThan(1e-9);
  });

  it('fab symbols align with expr operator cards content for + *', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('multiply')).toBe('×');
    const mul = evaluate('2*3');
    expect(mul.value).toBe(6);
  });
});
