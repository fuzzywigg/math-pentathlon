/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl streak-new-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — streak-new-1 copy', () => {
  it('pins day-2 practice streak template', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:update')
      .find((m) => m.id === 'streak-new-1');
    expect(msg!.text).toBe(
      "Day {currentStreak} of your practice streak! You're building great habits!"
    );
    expect(msg!.conditions).toEqual([
      { type: 'streak', value: 2, operator: 'eq' },
    ]);
  });
});
