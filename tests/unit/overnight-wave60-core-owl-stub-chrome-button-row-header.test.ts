/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl button-row/game-header chrome stubs.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 60 core owl — stub chrome button-row/header', () => {
  it('pins button-row and game-header chrome stubs exact', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'button-row' })
    ).toBe(
      '[STUB inspect] These are the game controls — New Game, Tutorial, How to Play.'
    );
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'game-header' })
    ).toBe(
      "[STUB inspect] That's the game title area. You're in the middle of a match!"
    );
  });
});
