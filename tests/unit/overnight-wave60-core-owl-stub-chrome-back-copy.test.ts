/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl chrome back stub copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub chrome back', () => {
  it('back chrome stub pins adventure-list copy', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'back' })
    ).toBe(
      '[STUB inspect] Back takes you to the game list. Pick another adventure anytime.'
    );
  });
});
