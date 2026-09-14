/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl return-generic-1 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — return-generic-1 copy', () => {
  it('pins welcome-back playerName generic return text', () => {
    const msg = owlMessages
      .getMessagesByCategory('app:return')
      .find((m) => m.id === 'return-generic-1');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'Welcome back, {playerName}! Which game shall we tackle today?'
    );
    expect(msg!.conditions).toBeUndefined();
  });
});
