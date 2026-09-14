/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-generic-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-generic-2 copy', () => {
  it('pins missed-skills return generic text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-generic-2');
    expect(msg!.text).toBe(
      'Great to see you again! Your math skills have been missed!'
    );
    expect(msg!.conditions).toBeUndefined();
  });
});
