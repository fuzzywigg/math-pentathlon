/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl fiar-node neighbors stub.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub fiar neighbors', () => {
  it('fiar-node stub pins Count the neighbors copy', () => {
    expect(
      stubNarrationFor({ kind: 'fiar-node', nodeId: 'n7' })
    ).toBe(
      '[STUB inspect] FIAR node n7. Count the neighbors you can reach.'
    );
  });
});
