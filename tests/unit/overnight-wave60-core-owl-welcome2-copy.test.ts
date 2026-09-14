/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl welcome-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — welcome-2 copy', () => {
  it('pins welcome-2 Math Pentathlon cheering text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:start')
      .find((m) => m.id === 'welcome-2');
    expect(msg!.text).toBe(
      "Welcome to Math Pentathlon! I'm Ollie, and I'll be cheering you on. Let's pick a game!"
    );
    expect(msg!.priority).toBe('high');
  });
});
