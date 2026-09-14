/**
 * Wave 42 — handshake: pinball formatFraction × fab/core formatFraction.
 * Tests-only. Registry-free.
 */
import { describe, it, expect } from 'vitest';
import { formatFraction as pinFormat } from '../../src/games/fraction-pinball/rules';
import { formatFraction as coreFormat } from '../../src/core/fractions/arithmetic';

describe('Wave 42 handshake — pinball × fab formatFraction', () => {
  it('simple positives agree between pinball and core', () => {
    const samples = [
      { numerator: 1, denominator: 2 },
      { numerator: 3, denominator: 4 },
      { numerator: 5, denominator: 1 },
      { numerator: 7, denominator: 8 },
    ];
    for (const f of samples) {
      expect(pinFormat(f)).toBe(coreFormat(f));
    }
  });

  it('whole numbers and improper fractions agree', () => {
    expect(pinFormat({ numerator: 0, denominator: 1 })).toBe(
      coreFormat({ numerator: 0, denominator: 1 })
    );
    expect(pinFormat({ numerator: 9, denominator: 2 })).toBe(
      coreFormat({ numerator: 9, denominator: 2 })
    );
  });
});
