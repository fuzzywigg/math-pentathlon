/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl tutorial/new-game chrome stubs.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub chrome tutorial/new-game', () => {
  it('pins tutorial and new-game chrome stubs exact', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'tutorial' })
    ).toBe(
      "[STUB inspect] Tutorial starts a guided walk-through. Great when you're learning!"
    );
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'new-game' })
    ).toBe(
      '[STUB inspect] New Game resets the board so you can try a fresh match.'
    );
  });
});
