/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-night-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-night-1 copy', () => {
  it('pins late-night return template', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-night-1');
    expect(msg!.text).toBe(
      "Late night math session? I'm a night owl too! Let's do this!"
    );
  });
});
