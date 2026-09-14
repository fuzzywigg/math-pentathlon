/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl streak-record-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — streak-record-1 copy', () => {
  it('pins personal-record streak update template', () => {
    const msg = owlMessages
      .getMessagesByCategory('streak:update')
      .find((m) => m.id === 'streak-record-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      "NEW PERSONAL RECORD! {currentStreak} days! You've never gone this long before!"
    );
    expect(msg!.conditions).toBeUndefined();
  });
});
