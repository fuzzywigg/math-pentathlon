/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl loss-encouraging-5 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — loss-encouraging-5 copy', () => {
  it('pins mistakes-are-proof loss text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-5');
    expect(msg!.text).toBe(
      "Remember: mistakes are proof that you're trying! Ready to try again?"
    );
  });
});
