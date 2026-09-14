/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl OWL_REST_SPEED exact 0.4.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { OWL_REST_SPEED } from '../../src/core/owl';

describe('Wave 60 core owl — OWL_REST_SPEED exact', () => {
  it('pins rest speed constant 0.4 (not just > 0)', () => {
    expect(OWL_REST_SPEED).toBe(0.4);
  });
});
