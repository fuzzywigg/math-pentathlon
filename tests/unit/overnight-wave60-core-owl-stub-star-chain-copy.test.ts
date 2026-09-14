/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl star-space/piece stub copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub star chain copy', () => {
  it('star-space and star-piece pin How far / next chain stubs', () => {
    expect(
      stubNarrationFor({
        kind: 'star-space',
        space: 4,
        player: 'blue',
      })
    ).toBe(
      '[STUB inspect] Star Track space 4 (blue). How far to the star?'
    );
    expect(
      stubNarrationFor({ kind: 'star-piece', player: 'red' })
    ).toBe(
      '[STUB inspect] Star Track piece for red. Where will the next chain take them?'
    );
  });
});
