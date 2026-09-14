/**
 * Wave 40 — handshake fab ↔ frac-fact operation symbols.
 * Tests-only leftover after #178. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getOperationSymbol as fabSymbol } from '../../src/games/fab-a-diffy/rules';
import { getOperationSymbol as fracSymbol } from '../../src/games/frac-fact/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

const OPS: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

describe('Wave 40 handshake — fab ↔ frac-fact ops', () => {
  it('operation symbols align across leftover engines', () => {
    for (const op of OPS) {
      expect(fabSymbol(op)).toBe(fracSymbol(op));
    }
  });
});
