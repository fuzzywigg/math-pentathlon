/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl streak-broken-2 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — streak-broken-2 copy', () => {
  it('pins missed-a-day streak-broken text', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:broken')
      .find((m) => m.id === 'streak-broken-2');
    expect(msg!.text).toBe(
      "Missed a day? No worries! The most important thing is you're here now!"
    );
  });
});
