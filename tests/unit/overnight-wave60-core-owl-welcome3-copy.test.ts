/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl welcome-3 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — welcome-3 copy', () => {
  it('pins welcome-3 twenty-games conquer text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:start')
      .find((m) => m.id === 'welcome-3');
    expect(msg!.text).toBe(
      "Hello, young mathematician! I'm Ollie the Owl. Together we'll conquer 20 amazing math games!"
    );
  });
});
