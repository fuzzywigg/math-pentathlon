/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl welcome-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — welcome-1 copy', () => {
  it('pins welcome-1 high-priority first-visit text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:start')
      .find((m) => m.id === 'welcome-1');
    expect(msg).toBeTruthy();
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      "Hoot hoot! I'm Ollie the Owl, your math adventure guide! Ready to explore some amazing games?"
    );
  });
});
