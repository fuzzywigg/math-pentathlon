/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl loss-encouraging-3 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — loss-encouraging-3 copy', () => {
  it('pins best-mathematicians loss text', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'loss-encouraging-3');
    expect(msg!.text).toBe(
      "The best mathematicians learn the most from challenges. You've got this!"
    );
  });
});
