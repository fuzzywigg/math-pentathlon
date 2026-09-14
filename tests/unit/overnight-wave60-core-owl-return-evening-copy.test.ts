/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-evening-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-evening-1 copy', () => {
  it('pins evening owl hours return template', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-evening-1');
    expect(msg!.text).toBe(
      'Evening owl hours! The best time for strategic thinking. Ready to play?'
    );
  });
});
