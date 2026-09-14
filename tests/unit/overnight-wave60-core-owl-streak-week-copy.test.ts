/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl streak-week-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — streak-week-1 copy', () => {
  it('pins ONE WEEK STREAK eq-7 template', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:update')
      .find((m) => m.id === 'streak-week-1');
    expect(msg!.text).toBe(
      'ONE WEEK STREAK! 7 days of math practice! Incredible dedication!'
    );
    expect(msg!.conditions).toEqual([
      { type: 'streak', value: 7, operator: 'eq' },
    ]);
  });
});
