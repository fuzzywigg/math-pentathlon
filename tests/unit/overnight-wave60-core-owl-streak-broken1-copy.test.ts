/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl streak-broken-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — streak-broken-1 copy', () => {
  it('pins streak-reset fresh-start text', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:broken')
      .find((m) => m.id === 'streak-broken-1');
    expect(msg!.text).toBe(
      "Your streak reset, but that's okay! Today is a fresh start. Let's build a new one!"
    );
  });
});
