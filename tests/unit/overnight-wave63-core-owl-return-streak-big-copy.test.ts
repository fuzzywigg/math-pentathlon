/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl return-streak-big-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — return-streak-big-1 copy', () => {
  it('pins streak gte-7 UNSTOPPABLE return template', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-streak-big-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      'WOW! {currentStreak} days in a row! You are UNSTOPPABLE!'
    );
    expect(msg!.conditions).toEqual([
      { type: 'streak', value: 7, operator: 'gte' },
    ]);
  });
});
