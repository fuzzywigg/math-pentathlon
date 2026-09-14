/**
 * Overnight TOKENMAXX HEAVY leftovers after #298 — Owl win-generic-3 exact copy.
 * Tip alpha after #301. MESSAGE_LIBRARY residual only. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 63 core owl — win-generic-3 copy', () => {
  it('pins math-brain win celebration + playerWon condition', () => {
    const msg = owlMessages
      .getMessagesByCategory('game:end')
      .find((m) => m.id === 'win-generic-3');
    expect(msg!.priority).toBe('normal');
    expect(msg!.text).toBe(
      'Amazing! Your math brain is really showing off today!'
    );
    expect(msg!.conditions).toEqual([{ type: 'playerWon', value: true }]);
  });
});
