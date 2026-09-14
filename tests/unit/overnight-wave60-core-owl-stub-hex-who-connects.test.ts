/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl hex-cell Who connects suffix.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub hex who-connects', () => {
  it('hex-cell stub ends with Who connects across?', () => {
    expect(
      stubNarrationFor({ kind: 'hex-cell', row: 2, col: 3 })
    ).toBe(
      '[STUB inspect] Hex cell at row 2, column 3. Who connects across?'
    );
  });
});
