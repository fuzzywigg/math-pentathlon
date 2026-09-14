/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-afternoon-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-afternoon-1 copy', () => {
  it('pins afternoon return template', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-afternoon-1');
    expect(msg!.text).toBe(
      'Good afternoon! Perfect time for a math challenge, {playerName}!'
    );
    expect(msg!.conditions?.[0]).toEqual({
      type: 'timeOfDay',
      value: 'afternoon',
    });
  });
});
