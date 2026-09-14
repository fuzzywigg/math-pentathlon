/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl return-streak-1 exact copy.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 60 core owl — return-streak-1 copy', () => {
  it('pins streak gte-2 return template', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-streak-1');
    expect(msg!.priority).toBe('high');
    expect(msg!.text).toBe(
      "You're on a {currentStreak}-day streak! Keep it going, {playerName}!"
    );
    expect(msg!.conditions).toEqual([
      { type: 'streak', value: 2, operator: 'gte' },
    ]);
  });
});
