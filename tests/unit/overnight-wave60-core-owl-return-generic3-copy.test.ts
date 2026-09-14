/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-generic-3 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-generic-3 copy', () => {
  it('pins mathematical magic return generic text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-generic-3');
    expect(msg!.text).toBe(
      "Hoot! You're back! Let's make some mathematical magic happen!"
    );
  });
});
